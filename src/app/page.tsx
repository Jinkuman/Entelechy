"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Sidebar } from "@/components/sidebar";

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
        router.replace("/dashboard");
      } else {
        // If no session exists, redirect to sign-in page
        router.replace("/auth/sign-in");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Your page content goes here */}
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome to your workspace dashboard!</p>
      </main>
    </div>
  );
}
