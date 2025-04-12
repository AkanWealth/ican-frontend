"use client";
import React from "react";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import SettingsPage from "../ui/Setting";

// const Settings = () => {
//   return <SettingsPage />;
// };

export default function Settings(){
  return (
    <AuthProvider>
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    </AuthProvider>
  );
};