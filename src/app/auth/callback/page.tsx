"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/sign-in?error=auth_callback_failed");
        return;
      }

      if (data.session) {
        // Successful authentication
        router.push("/pages/dashboard");
      } else {
        // No session found, redirect to sign in
        router.push("/auth/sign-in");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
        <p className="text-sm text-zinc-400">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}
