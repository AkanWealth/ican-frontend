"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      logout(); // Ensure clean logout state
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, logout, router]);

  // Show loading state while checking authentication
  // if (isLoading) {
  //   return <Loading />;
  // }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};