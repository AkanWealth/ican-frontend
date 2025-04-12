import React from "react";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import ResourcePage from "../ui/Resource";

// const Resource = () => {
//     return (
//         <div>
//             <ResourcePage/>
//         </div>
//     );
// };

export default function Resource(){
    return (
        <AuthProvider>
            <ProtectedRoute>
                <ResourcePage />
            </ProtectedRoute>
        </AuthProvider>
    )
};
