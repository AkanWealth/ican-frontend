"use client";
import React from "react";

import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import Profile from "../ui/Profile";
// s

export default function ProfilePage() {
    return (
      <AuthProvider>
        <ProtectedRoute>
          
          <Profile />
          
        </ProtectedRoute>
      </AuthProvider>
    );
  }
