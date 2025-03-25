"use client";
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "c:/Users/owoey/Desktop/alte_project_new/ican-frontend/node_modules/jwt-decode/build/esm/index"

interface User {
  id: string;
  firstname: string;
  surname: string;
  email: string;
}

interface JwtPayload {
  sub: string;
  firstname: string;
  surname: string;
  email: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

   // Include 'logout' in the dependency array

  // Login function with JWT handling
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/login", {
        email,
        password,
      });

      const { user, access_token } = response.data;

      if (!access_token) {
        throw new Error("No token received");
      }

      // Decode the JWT to extract user information
      const decoded = jwtDecode<JwtPayload>(access_token);

      const userData: User = {
        id: decoded.sub,
        email: decoded.email,
        firstname: decoded.firstname,
        surname: decoded.surname,
      };

      // Store token and user data
      setToken(access_token);
      setUser(user);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Redirect to overview
      router.push("/Overview");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    router.push("/login");
  }, [router]);

// Improved authentication check
  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") return false; // Ensure this runs only on the client
  
    const storedToken = localStorage.getItem("token");
  
    if (!storedToken) return false;
  
    if (isTokenExpired(storedToken)) {
      logout();
      return false;
    }
  
    return true;
  }, [logout]);
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Check if token is valid and not expired
          if (!isTokenExpired(storedToken)) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
          } else {
            // Token is expired, logout
            logout();
          }
        } catch (error) {
          console.error("Error parsing authentication data:", error);
          logout();
        }
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
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