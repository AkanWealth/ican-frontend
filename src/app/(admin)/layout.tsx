"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasRole } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

import "../globals.css";
import Sidebar from "@/components/admincomps/Sidebar";
import Header from "@/components/admincomps/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" h-full flex flex-row">
        <Sidebar />
        <div className=" w-full overflow-auto bg-neutral-100">
          <Header />
          <main className="p-6">
            {children}
            <Toaster />
          </main>
        </div>
      </body>
    </html>
  );
}
