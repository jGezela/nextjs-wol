import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
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
      <body className={ `${geistSans.variable} ${geistMono.variable} antialiased bg-[#F0F0F0]` }>
        <main className="mx-auto p-4 sm:p-8 max-w-[1920px] h-full grid grid-cols-1 sm:grid-cols-[80px_1fr] grid-rows-[80px_1fr] sm:grid-rows-1">
          <Navbar />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
