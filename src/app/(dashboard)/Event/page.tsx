"use client";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import EventPage from "../ui/Event";

// const Event = () => {
//   return <EventPage />;
// };
// export default Event;


export default function Event() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        
        <EventPage />
        
      </ProtectedRoute>
    </AuthProvider>
  );
}