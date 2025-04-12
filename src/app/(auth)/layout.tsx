import "../globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

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
    <div 
      className="flex min-h-screen bg-fixed items-center flex-col justify-center"
      style={{
        backgroundImage: "url(/bgauth.png)",
        backgroundSize: "cover",
      }}
    >
      <div className="my-20 w-full sm:max-w-2xl md:max-w-3xl px-4">{children}</div>
      <Toaster />
    </div>
  );
}