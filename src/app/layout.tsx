import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wake-on-LAN",
  description: "A simple Wake-on-LAN (WoL) app for Windows computers built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-EN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto p-8 max-w-[1920px] bg-[#F0F0F0]`}
      >
        <main className="h-full grid grid-cols-[80px_1fr] grid-rows-1 gap-8">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
