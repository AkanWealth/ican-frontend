// AuthProvider.tsx
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import authService, { User } from "@/services-admin/authService";
import { RolesData } from "@/libs/types"; // adjust import if needed

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshTokens: () => Promise<boolean>;
  userPermissions: string[];
  hasPermission: (permissionId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEBUG = true;
const debugAuth = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[AdminAuthProvider] ${message}`, data || "");
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const router = useRouter();

  const hasPermission = useCallback(
    (permissionId: string) => {
      const hasPermission = userPermissions.includes(permissionId);
      debugAuth(`hasPermission check: ${permissionId} = ${hasPermission}`, {
        permissionId,
        userPermissions,
        result: hasPermission
      });
      return hasPermission;
    },
    [userPermissions]
  );

  useEffect(() => {
    debugAuth("Auth state updated", {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      hasToken: !!token,
    });
  }, [user, token, isAuthenticated, isLoading]);

  // Use the auth service for refreshing tokens
  const refreshTokens = async (): Promise<boolean> => {
    debugAuth("Refreshing tokens via auth service");
    try {
      const refreshed = await authService.refreshTokens();

      if (refreshed) {
        // Update local state with latest values
        const currentToken = authService.getToken();
        const currentUser = authService.getCurrentUser();

        setToken(currentToken);
        setUser(currentUser);
        setIsAuthenticated(!!currentToken);

        debugAuth("Token refresh successful", { hasUser: !!currentUser });
        return true;
      }

      debugAuth("Token refresh failed");
      return false;
    } catch (error) {
      debugAuth("Token refresh error", error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      debugAuth("Logging in", { email });

      // Use auth service for login
      const userData = await authService.login(email, password);
      const currentToken = authService.getToken();

      // Don't set isAuthenticated to true yet - wait for roles/permissions
      setUser(userData);
      setToken(currentToken);

      // Fetch all roles, including the accessToken from cookies for authentication
      let accessToken: string | null = null;
      if (typeof window !== "undefined") {
        // On client, get cookie via document.cookie
        const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
        accessToken = match ? decodeURIComponent(match[1]) : null;
      } else if (typeof require !== "undefined") {
      }

      const rolesRes = await fetch(
        "https://ican-api-6000e8d06d3a.herokuapp.com/api/roles",
        accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : undefined
      );
      const roles: RolesData[] = await rolesRes.json();

   

      const userRoleName = userData?.role;

      const userRole = roles.find((role) => role.name === userRoleName);

      // Extract permissionIds with proper error handling and validation
      if (!userRole?.permissions || !Array.isArray(userRole.permissions)) {
        setUserPermissions([]);
      } else {
        const permissions = userRole.permissions
          .filter((p) => p && typeof p.permissionId === 'string')
          .map((p) => p.permissionId);
        
        setUserPermissions(permissions);
        // Also persist permissions in localStorage for session continuity
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("userPermissions", JSON.stringify(permissions));
          } catch (err) {
            console.warn("Failed to store permissions in localStorage", err);
          }
        }
      }




      // NOW set isAuthenticated to true after everything is complete
      setIsAuthenticated(true);

      // router.push("/admin");
    } catch (error) {
      debugAuth("Login error", error);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    debugAuth("Logging out");

    try {
      await authService.logout();

      // Update state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      debugAuth("Logout successful");
      router.push("/admin-login");
    } catch (error) {
      debugAuth("Logout error", error);

      // Still update local state and redirect even if API call fails
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      console.warn("Redirecting to login in 3 seconds.");
      setTimeout(() => {
        router.push("/admin-login");
      }, 3000);
    }
  }, [router]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      debugAuth("Checking authentication status");
      try {
        setIsLoading(true);

        // Get current token and user from auth service
        const currentToken = authService.getToken();
        const currentUser = authService.getCurrentUser();

        // Only attempt refresh if we're not on a public page
        const currentPath = window.location.pathname;
        const isPublicPage =
          currentPath === "/admin-login" || currentPath === "/admin-signup";
        debugAuth(
          `Current path: ${currentPath}, isPublicPage: ${isPublicPage}`
        );

        if (currentToken && !isPublicPage) {
          // Check if token is valid and not expired
          if (!authService.isTokenExpired(currentToken)) {
            debugAuth("Token is valid");
            // Set authentication state
            setUser(currentUser);
            setToken(currentToken);
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            debugAuth("Token expired, attempting refresh");
            const refreshed = await refreshTokens();

            if (!refreshed) {
              debugAuth("Token refresh failed, logging out");
              await logout();
            }
          }
        } else if (!isPublicPage) {
          // No token found, try to refresh
          debugAuth("No token found, attempting refresh");
          const refreshed = await refreshTokens();

          if (!refreshed) {
            debugAuth("Token refresh failed, redirect to login");
            router.push("/admin-login");
          }
        } else {
          debugAuth("On public page, skipping auth check");
        }
      } catch (error) {
        debugAuth("Error checking auth status:", error);
        console.warn(
          "Authentication error detected. Redirecting to login in 3 seconds."
        );
        setTimeout(() => {
          router.push("/admin-login");
        }, 3000);
      } finally {
        setIsLoading(false);
        debugAuth("Admin Auth check completed");
      }
    };

    checkAuthStatus();
  }, [logout, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
        refreshTokens,
        userPermissions,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
