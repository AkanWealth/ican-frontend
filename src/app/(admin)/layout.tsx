import "../globals.css";

import Sidebar from "@/components/admincomps/Sidebar";
import Header from "@/components/admincomps/Header";

import { Toaster } from "@/components/ui/toaster";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ICAN Surulere",
  description: "Empowering Professionals, Building Futures",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className=" h-full flex flex-row">
        <AuthProvider>
          <Sidebar />
          <div className=" w-full overflow-auto bg-neutral-100">
            <Header />
            <main className="p-6">
              {children}
              <Toaster />
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
