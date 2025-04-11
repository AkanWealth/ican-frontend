"use client";
import React from "react";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import DashboardContent from "../ui/DashboardContent";




export default function Dashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        
        <DashboardContent />
        
      </ProtectedRoute>
    </AuthProvider>
  );
}