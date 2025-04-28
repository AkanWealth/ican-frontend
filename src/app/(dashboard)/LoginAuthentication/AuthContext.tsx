// "use client";
// import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// interface User {
//   id: string;
//   firstname: string;
//   surname: string;
//   email: string;
// }

// interface JwtPayload {
//   sub: string;
//   firstname: string;
//   surname: string;
//   email: string;
//   exp: number;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Check if token is expired
//   const isTokenExpired = (token: string): boolean => {
//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       return decoded.exp < Date.now() / 1000;
//     } catch (error) {
//       return true;
//     }
//   };

//   // Login function with JWT handling
//   const login = async (email: string, password: string) => {
//     try {
//       const response = await axios.post("https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/login", {
//         email,
//         password,
//       });

//       const { user, access_token } = response.data;

//       if (!access_token) {
//         throw new Error("No token received");
//       }

//       // Decode the JWT to extract user information
//       const decoded = jwtDecode<JwtPayload>(access_token);

//       const userData: User = {
//         id: decoded.sub,
//         email: decoded.email,
//         firstname: decoded.firstname,
//         surname: decoded.surname,
//       };

//       // Store token and user data
//       setToken(access_token);
//       setUser(user);
//       setIsAuthenticated(true);

//       if (typeof window !== "undefined") {
//         localStorage.setItem("token", access_token);
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       // Redirect to overview
//       router.push("/Overview");
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = useCallback(() => {
//     setUser(null);
//     setToken(null);
//     setIsAuthenticated(false);

//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     }

//     router.push("/login");
//   }, [router]);

//   // Check authentication on mount
//   useEffect(() => {
//     const checkAuthStatus = () => {
//       if (typeof window !== "undefined") {
//         const storedToken = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (storedToken && storedUser) {
//           try {
//             // Check if token is valid and not expired
//             if (!isTokenExpired(storedToken)) {
//               const parsedUser = JSON.parse(storedUser);
//               setUser(parsedUser);
//               setToken(storedToken);
//               setIsAuthenticated(true);
//             } else {
//               // Token is expired, logout
//               logout();
//             }
//           } catch (error) {
//             console.error("Error parsing authentication data:", error);
//             logout();
//           }
//         }
        
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, [logout]);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       token, 
//       login, 
//       logout, 
//       isAuthenticated, 
//       isLoading 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };





// "use client";
// import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { parseCookies, setCookie, destroyCookie } from "nookies";



// // Add at the top of the file
// const DEBUG = true;  // Easy toggle for debugging

// // Debugging helper
// const debugAuth = (message: string, data?: any) => {
//   if (DEBUG) {
//     console.log(`[AuthProvider] ${message}`, data || '');
//   }
// };


// interface User {
//   id: string;
//   firstname: string;
//   surname: string;
//   email: string;
//   membershipId?: string;
//   role?: string;
// }

// interface JwtPayload {
//   sub: string;
//   firstname: string;
//   surname: string;
//   email: string;
//   role: string;
//   exp: number;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   refreshTokens: () => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Cookie names - Match exactly what backend returns
// const ACCESS_TOKEN_COOKIE = 'accessToken';
// const REFRESH_TOKEN_COOKIE = 'refreshToken';
// const USER_DATA_COOKIE = 'user_data';

// // Cookie options
// const tokenCookieOptions = {
//   maxAge: 30 * 24 * 60 * 60, // 30 days
//   path: '/',
//   secure: process.env.NODE_ENV === 'production',
//   httpOnly: false, // Change to false so JS can access it
//   sameSite: 'lax' as const // 'lax' for better cross-page behavior
// };

// // Client accessible cookie options (for data we need in JS)
// const clientCookieOptions = {
//   maxAge: 30 * 24 * 60 * 60,
//   path: '/',
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'lax' as const
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     debugAuth('Auth state updated', {
//       isAuthenticated,
//       isLoading,
//       hasUser: !!user,
//       hasToken: !!token
//     });
//   }, [user, token, isAuthenticated, isLoading]);


//   // Refresh tokens function based on your API spec
//   const refreshTokens = async (): Promise<boolean> => {
//     debugAuth('Starting token refresh');
//     try {
//       debugAuth('Current cookies before refresh', parseCookies());
//       // The API will automatically use the refresh_token from cookies
//       const response = await axios.patch(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/refresh",
//         {}, // Empty body as refresh token is in cookies
//         {
//           withCredentials: true // Important: ensures cookies are sent with the request
//         }
//       );

//       debugAuth("Refresh token response", {
//         status: response.status,
//         statusText: response.statusText,
//         data: response.data,
//         headers: response.headers
//       });


//       console.log("refreah_token", response.data)
//       const { access_token } = response.data;
      
//       if (access_token) {
//         debugAuth('New access token received', {
//           tokenStart: access_token.substring(0, 10) + '...',
//           tokenLength: access_token.length
//         });
//         // Store new access token
//         setCookie(null, ACCESS_TOKEN_COOKIE, access_token, tokenCookieOptions);
        
//         // Update state
//         setToken(access_token);
//         setIsAuthenticated(true);
        
//         // Refresh user data from token
//         try {
//           const decoded = jwtDecode<JwtPayload>(access_token);
//           debugAuth('Decoded token', {
//             sub: decoded.sub,
//             exp: decoded.exp,
//             expiresAt: new Date(decoded.exp * 1000).toLocaleString()
//           });
//           const userData: User = {
//             id: decoded.sub,
//             email: decoded.email,
//             firstname: decoded.firstname,
//             surname: decoded.surname,
//             role: decoded.role
//           };
//           setUser(userData);
//           setCookie(null, USER_DATA_COOKIE, JSON.stringify(userData), clientCookieOptions);

//           debugAuth('No access token in refresh response');
//         } catch (error) {
//           debugAuth("Token refresh error:", error);
//           console.error("Error updating user data from refreshed token:", error);
//         }
        
//         return true;
//       }
      
//       return false;
//     } catch (error) {
//       console.error("Token refresh error:", error);
//       return false;
//     }
//   };

//   // Login function with JWT handling
//   const login = async (email: string, password: string) => {
//     try {
//       const response = await axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/login", 
//         {
//           email,
//           password,
//         },
//         {
//           withCredentials: true // Important: allows the response to set cookies
//         }
//       );


//       debugAuth("Login response", {
//         status: response.status,
//         headers: response.headers,
//         data: response.data
//       });
//       debugAuth('All cookies after login', parseCookies());
      


//       console.log("response", response);
//       // Use the exact field names from your backend response
//       const { user, access_token } = response.data;

//       if (!access_token) {
//         debugAuth('No access token in login response');
//         throw new Error("No access token received");
//       }

//       // Decode the JWT to extract user information
//       const decoded = jwtDecode<JwtPayload>(access_token);
//       debugAuth('Decoded access token', decoded);


//       const userData: User = {
//         id: decoded.sub,
//         email: decoded.email,
//         firstname: decoded.firstname,
//         surname: decoded.surname,
//         role: decoded.role,
//         // Use the user data from response too if you want additional fields
//         membershipId: user?.membershipId
//       };

//       // Store access token in a cookie
//       setCookie(null, ACCESS_TOKEN_COOKIE, access_token, tokenCookieOptions);
      
//       // Store user data in a cookie
//       setCookie(null, USER_DATA_COOKIE, JSON.stringify(userData), clientCookieOptions);

//       debugAuth('Cookies set after login', parseCookies());


//       // Update state
//       setToken(access_token);
//       setUser(userData);
//       setIsAuthenticated(true);

//       // Redirect to overview      // Redirect to overview
//       debugAuth('Login successful, redirecting to Overview');

//       router.push("/Overview");
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = useCallback(() => {
//     setUser(null);
//     setToken(null);
//     setIsAuthenticated(false);

//     // Clear cookies
//     destroyCookie(null, ACCESS_TOKEN_COOKIE, { path: '/' });
//     destroyCookie(null, REFRESH_TOKEN_COOKIE, { path: '/' });
//     destroyCookie(null, USER_DATA_COOKIE, { path: '/' });

//     // Call logout endpoint to clear server-side cookies
//     try {
//       axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/logout", 
//         {},
//         { withCredentials: true }
//       );
//     } catch (error) {
//       console.error("Logout error:", error);
//     }

//     console.warn("Redirecting to login in 10 seconds. Check console for errors.");
//     setTimeout(() => {
//       router.push("/login");
//     }, 40000);
//   }, [router]);

//   // Check if token is expired
//   const isTokenExpired = (token: string): boolean => {
//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       const expiresAt = decoded.exp;
//       const currentTime = Date.now() / 1000;
//       const timeLeft = expiresAt - currentTime;
      
//       debugAuth('Token expiration check', {
//         expiresAt: new Date(expiresAt * 1000).toLocaleString(),
//         currentTime: new Date(currentTime * 1000).toLocaleString(),
//         timeLeftSeconds: timeLeft,
//         isExpired: timeLeft < 300
//       });
      
//       // Check if token expires in less than 5 minutes
//       return timeLeft < 300; // 5 minutes buffer
//     } catch (error) {
//       debugAuth("Error checking token expiration:", error);
//       return true;
//     }
//   };


//   // Check authentication on mount
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       debugAuth('Checking authentication status');
//       try {
//         setIsLoading(true);
//         const cookies = parseCookies();
//         debugAuth('Current cookies', cookies);
        
//         const storedToken = cookies[ACCESS_TOKEN_COOKIE];
//         debugAuth(`Access token in cookies: ${storedToken ? 'Yes' : 'No'}`);
        
//         // Only attempt token refresh if we're not on a public page
//         const currentPath = window.location.pathname;
//         const isPublicPage = currentPath === '/login' || currentPath === '/register';
//         debugAuth(`Current path: ${currentPath}, isPublicPage: ${isPublicPage}`);
        
//         if (storedToken && !isPublicPage) {
//           // Check if token is valid and not expired
//           if (!isTokenExpired(storedToken)) {
//             debugAuth('Token is valid and not expired');
//             // Token is still valid
//             const storedUser = cookies[USER_DATA_COOKIE];
//             if (storedUser) {
//               debugAuth('User data found in cookies');
//               const parsedUser = JSON.parse(storedUser);
//               setUser(parsedUser);
//               setToken(storedToken);
//               setIsAuthenticated(true);
//             } else {
//               debugAuth('No user data in cookies, trying to refresh');
//               await refreshTokens();
//             }
//           } else {
//             // Token expired, try to refresh
//             debugAuth('Token expired, attempting refresh');
//             const refreshed = await refreshTokens();
//             debugAuth(`Token refresh result: ${refreshed ? 'Success' : 'Failed'}`);
//             if (!refreshed) {
//               debugAuth('Token refresh failed, logging out');
//   console.warn("Authentication failed. Logging out in 10 seconds. Check console for details.");
//   setTimeout(() => {
//     logout();
//   }, 10000); // 10 second delay
//             }
//           }
//         } else if (!isPublicPage) {
//           // No token found, check if we can refresh
//           debugAuth('No access token found, attempting refresh');
//           const refreshed = await refreshTokens();
//           debugAuth(`Token refresh result: ${refreshed ? 'Success' : 'Failed'}`);
//           if (!refreshed) {
//             debugAuth('Token refresh failed, setting unauthenticated');
//             setIsAuthenticated(false);
//           }
//         } else {
//           debugAuth('On public page, skipping auth check');
//         }
//       } catch (error) {
//         debugAuth("Error checking auth status:", error);
//   console.warn("Auth error detected. Logging out in 10 seconds. Check console for details.");
//   setTimeout(() => {
//     logout();
//   }, 10000);
//       } finally {
//         setIsLoading(false);
//         debugAuth('Auth check completed');
//       }
//     };
    
//     checkAuthStatus();
//   }, [logout]);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       token, 
//       login, 
//       logout, 
//       isAuthenticated, 
//       isLoading,
//       refreshTokens
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };





// AuthProvider.tsx
"use client";
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import authService, { User } from "@/services/authService";

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
    console.log(`[AuthProvider] ${message}`, data || '');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    debugAuth('Auth state updated', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      hasToken: !!token
    });
  }, [user, token, isAuthenticated, isLoading]);

  // Use the auth service for refreshing tokens
  const refreshTokens = async (): Promise<boolean> => {
    debugAuth('Refreshing tokens via auth service');
    try {
      const refreshed = await authService.refreshTokens();
      
      if (refreshed) {
        // Update local state with latest values
        const currentToken = authService.getToken();
        const currentUser = authService.getCurrentUser();
        
        setToken(currentToken);
        setUser(currentUser);
        setIsAuthenticated(!!currentToken);
        
        debugAuth('Token refresh successful', { hasUser: !!currentUser });
        return true;
      }
      
      debugAuth('Token refresh failed');
      return false;
    } catch (error) {
      debugAuth('Token refresh error', error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      debugAuth('Logging in', { email });
      
      // Use auth service for login
      const userData = await authService.login(email, password);
      const currentToken = authService.getToken();
      
      // Update state
      setUser(userData);
      setToken(currentToken);
      setIsAuthenticated(true);
      
      debugAuth('Login successful');
      
      // Redirect to overview
      router.push("/Overview");
    } catch (error) {
      debugAuth('Login error', error);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    debugAuth('Logging out');
    
    try {
      await authService.logout();
      
      // Update state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      debugAuth('Logout successful');
      router.push("/login");
    } catch (error) {
      debugAuth('Logout error', error);
      
      // Still update local state and redirect even if API call fails
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      console.warn("Redirecting to login in 3 seconds.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [router]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      debugAuth('Checking authentication status');
      try {
        setIsLoading(true);
        
        // Get current token and user from auth service
        const currentToken = authService.getToken();
        const currentUser = authService.getCurrentUser();
        
        // Only attempt refresh if we're not on a public page
        const currentPath = window.location.pathname;
        const isPublicPage = currentPath === '/login' || currentPath === '/register';
        debugAuth(`Current path: ${currentPath}, isPublicPage: ${isPublicPage}`);
        
        if (currentToken && !isPublicPage) {
          // Check if token is valid and not expired
          if (!authService.isTokenExpired(currentToken)) {
            debugAuth('Token is valid');
            // Set authentication state
            setUser(currentUser);
            setToken(currentToken);
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            debugAuth('Token expired, attempting refresh');
            const refreshed = await refreshTokens();
            
            if (!refreshed) {
              debugAuth('Token refresh failed, logging out');
              await logout();
            }
          }
        } else if (!isPublicPage) {
          // No token found, try to refresh
          debugAuth('No token found, attempting refresh');
          const refreshed = await refreshTokens();
          
          if (!refreshed) {
            debugAuth('Token refresh failed, redirect to login');
            router.push('/login');
          }
        } else {
          debugAuth('On public page, skipping auth check');
        }
      } catch (error) {
        debugAuth("Error checking auth status:", error);
        console.warn("Authentication error detected. Redirecting to login in 3 seconds.");
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setIsLoading(false);
        debugAuth('Auth check completed');
      }
    };
    
    checkAuthStatus();
  }, [logout, router]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated, 
      isLoading,
      refreshTokens
    }}>
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