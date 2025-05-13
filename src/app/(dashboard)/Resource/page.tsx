"use client";

import React from "react";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import ResourcePage from "../ui/Resource";

// const Resource = () => {
//     return (
//         <div>
//             <ResourcePage/>
//         </div>
//     );
// };

// export default Resource;


export default function Resource() {
    return (
      <AuthProvider>
        <ProtectedRoute>
          
          <ResourcePage />
          
        </ProtectedRoute>
      </AuthProvider>
    );
  }
