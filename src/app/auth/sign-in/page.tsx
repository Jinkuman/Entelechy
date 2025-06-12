"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInForm, signInSchema } from "@/app/schemas/authSchema";
import supabase from "@/lib/supabaseClient";
import GoogleSignIn from "@/app/components/GoogleSignIn";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: signInForm) => {
    setLoading(true);
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Successful sign in; redirect somewhere:
      router.push("/pages/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-lg">
        {/* App branding */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Sign in to Entelechy</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Good to see you again! Please sign in to continue.
          </p>
        </div>

        {/* Google Sign-in */}
        <GoogleSignIn mode="sign-in" className="mb-6" />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-zinc-900 px-2 text-zinc-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Sign-in Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-200"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              autoComplete="email"
              {...register("email")}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="•••••••••••••"
              autoComplete="current-password"
              {...register("password")}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-500"
          >
            {loading ? "Signing In..." : "Continue"}
          </button>
        </form>

        {/* Bottom Text */}
        <div className="mt-4 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
