"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasRole } from "@/lib/auth";

import "../globals.css";
import Sidebar from "@/components/admincomps/Sidebar";
import Header from "@/components/admincomps/Header";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!hasRole(["SUPER_ADMIN", "ADMIN"])) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <html lang="en">
      <body className=" h-full flex flex-row">
        <Sidebar />
        <div className=" w-full bg-neutral-100">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
