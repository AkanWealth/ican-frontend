import "../globals.css";
import { inter, league_spartan } from "../fonts";
import Mainheader from "../../components/homecomps/Mainheader";
import Mainfooter from "../../components/homecomps/Mainfooter";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ICAN Surulere",
  description: "Empowering Professionals, Building Futures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}  ${league_spartan.variable}`}>
      <head>
      
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <Mainheader />
        {children}
        <Mainfooter />
      </body>
    </html>
  );
}
