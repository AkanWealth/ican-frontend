import "../globals.css";
import { Header } from "./ui/Header";
import { Sidebar } from "./ui/Sidebar";
import { NotificationProvider } from "./Context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./LoginAuthentication/AuthContext";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ICAN Surulere",
  description: "Empowering Professionals, Building Futures",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      
      <html lang="en" className="h-full">
        <body className="h-full bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <Sidebar />
            <div className="flex-1 w-full lg:ml-60 md:ml-0">
              <Header />
              <main className="w-full lg:pt-10 md:pt-8 lg:p-6 md:p-2 mt-20 ">
                {children}
                <Toaster />
              </main>
            </div>
          </div>
          </AuthProvider>
        </body>
      </html>
    </NotificationProvider>
  );
}