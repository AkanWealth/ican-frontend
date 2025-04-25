
"use client";
import SettingsPage from "../ui/Setting";

import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
// s
export default function Settings() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        
        <SettingsPage />
        
      </ProtectedRoute>
    </AuthProvider>
  );
}