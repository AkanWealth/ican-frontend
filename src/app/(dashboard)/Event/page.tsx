"use client";
import React from "react";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import EventPage from "../ui/Event";

// const Event = () => {
//   return <EventPage />;
// };
export default function Event(){
  return (
    <AuthProvider>
      <ProtectedRoute>
        <EventPage />
      </ProtectedRoute>
    </AuthProvider>
  );
};
