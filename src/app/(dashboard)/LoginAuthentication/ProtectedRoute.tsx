// "use client";
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from './AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated, isLoading, logout } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       console.log('Not authenticated, redirecting to login');
//       logout(); // Ensure clean logout state
//       router.push('/login');
//     }
//   }, [isAuthenticated, isLoading, logout, router]);

//   // Show loading state while checking authentication
//   // if (isLoading) {
//   //   return <Loading />;
//   // }

//   // Only render children if authenticated
//   return isAuthenticated ? <>{children}</> : null;
// };




"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div className="flex items-center justify-center w-full h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-gray-600">Verifying authentication...</p>
    </div>
  </div>
}) => {
  const { isAuthenticated, isLoading, logout, refreshTokens } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAuthentication = async () => {
      try {
        // If auth context is still loading, wait for it
        if (isLoading) return;

        // If already authenticated according to context, we're good
        if (isAuthenticated) {
          if (isMounted) setIsVerifying(false);
          return;
        }

        console.log('Not authenticated, attempting token refresh...');
        
        // Try to refresh the token as a last resort
        const refreshed = await refreshTokens();
        
        if (!refreshed) {
          console.log('Authentication failed after refresh attempt, redirecting to login');
          logout(); // Ensure clean logout state
          router.replace('/login'); // Using replace to avoid back navigation issues
        } else {
          console.log('Token refresh successful');
          if (isMounted) setIsVerifying(false);
        }
      } catch (error) {
        console.error('Error during authentication verification:', error);
        logout();
        router.replace('/login');
      }
    };

    verifyAuthentication();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, refreshTokens, logout, router]);

  // Show loading state while verifying authentication
  if (isLoading || isVerifying) {
    return <>{fallback}</>;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};