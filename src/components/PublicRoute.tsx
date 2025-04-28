// PublicRoute.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(dashboard)/LoginAuthentication/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectPath?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectIfAuthenticated = true,
  redirectPath = '/Overview'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If authenticated and should redirect, push to redirectPath
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && redirectIfAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, redirectPath, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Return children for public routes
  return <>{children}</>;
};