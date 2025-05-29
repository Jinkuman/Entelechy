"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "./components/sidebar";
import "./globals.css";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where sidebar should be hidden
  const authRoutes = ["/auth", "/login", "/signup", "/register"];
  const hideSidebar = authRoutes.some((route) => pathname?.startsWith(route));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          {/* Conditionally render sidebar */}
          {!hideSidebar && <Sidebar />}

          {/* Main area - full width on auth pages, with sidebar space otherwise */}
          <main
            className={`flex-1 h-full overflow-auto ${
              hideSidebar ? "w-full" : ""
            }`}
          >
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
