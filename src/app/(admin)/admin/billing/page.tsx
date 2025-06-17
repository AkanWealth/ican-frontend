"use client";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import Billingsubpage from "./tabs/Billingsubpage";

function BillingPage() {
  return <Billingsubpage />;
}

export default function PackedBillingPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <BillingPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
