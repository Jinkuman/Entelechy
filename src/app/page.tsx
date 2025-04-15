"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

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
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
