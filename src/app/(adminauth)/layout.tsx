import "../globals.css";
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
      <body className="flex flex-row h-full bg-white items-center   ">
        <div className="flex flex-col h-screen w-1/2 bg-[#0d1b4b] pl-24 pt-12 justify-between ">
          <Image
            src="/Logo_small_white.png"
            alt="Logo"
            width={143}
            height={60}
          />
          <Image
            src="/adminlogin.png"
            alt="Logo"
            width={612}
            height={950}
            className="w-full max-w-[450px] mx-auto h-auto"
          />
        </div>
        <div className=" mx-auto">{children}</div>
      </body>
    </html>
  );
}
