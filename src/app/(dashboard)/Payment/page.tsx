"use client";
import React from "react";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import PaymentPage from "../ui/PaymentPage";
// const Payment = () => {
//     return (
//         <div>
//             <PaymentPage/>
//         </div>
//     );
// };

export default function Payment(){
    return (
        <AuthProvider>
            <ProtectedRoute>
                <PaymentPage />
            </ProtectedRoute>
        </AuthProvider>
    );
};
