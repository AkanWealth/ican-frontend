import "../globals.css";
import { Header } from "./ui/Header";
import { Sidebar } from "./ui/Sidebar";
import { NotificationProvider } from "./Context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en">
      <body>
        
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar />
          <div className="flex-1 pt-12 bg-gray-50">
            <Header />
            <main className="pt-16 p-6">
              {children}
              <Toaster />
            </main>
          </div>
        </div>
      </body>
    </html>
    </NotificationProvider>
  );
}
