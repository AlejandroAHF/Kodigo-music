import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./Shared/Component/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Kodigo Music",
  description: "Aplicacion de codigo de musica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
