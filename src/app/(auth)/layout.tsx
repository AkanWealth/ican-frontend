import "../globals.css";
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
    <html lang="en">
      <body
        className="flex h-full bg-fixed items-center flex-col justify-center "
        style={{
          backgroundImage: "url(/bgauth.png)",
          backgroundSize: "cover",
        }}
      >
        <div className="my-20">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
