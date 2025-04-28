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

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshTokens: () => Promise<boolean>;
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
  const router = useRouter();

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

      // Update state
      setUser(userData);
      setToken(currentToken);
      setIsAuthenticated(true);

      debugAuth("Login successful");

      // Redirect to overview
      router.push("/admin");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
