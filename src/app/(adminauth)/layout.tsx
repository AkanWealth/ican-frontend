import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ICAN Surulere",
  description: "Empowering Professionals, Building Futures",
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-0  bg-white items-center flex-col justify-center w-full ">
        <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
        <div className="pt-20">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}