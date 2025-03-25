'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      logout(); // Ensure clean logout state
      router.push('/login');
    }
  }, [isAuthenticated, logout, router]);

  // Only render children if authenticated
  return isAuthenticated() ? <>{children}</> : null;
};