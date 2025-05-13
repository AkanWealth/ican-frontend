
"use client";
import React from "react";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import PaymentPage from "../ui/PaymentPage";
// const Payment = () => {
//     return (
//         <div>
//             <PaymentPage/>
//         </div>
//     );
// };

// export default Payment;
export default function  Payment() {
    return (
      <AuthProvider>
        <ProtectedRoute>
          
          <PaymentPage />
          
        </ProtectedRoute>
      </AuthProvider>
    );
  }

