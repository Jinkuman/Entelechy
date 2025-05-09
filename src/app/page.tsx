"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Dashboard from "./pages/dashboard/page";
import { ThemeProvider } from "next-themes";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Using Supabase's getSession to check authentication state
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Redirect to dashboard if user is authenticated
        router.replace("/pages/dashboard");
      } else {
        // If no session exists, redirect to sign-in page
        router.replace("/auth/sign-in");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </div>
  );
}
