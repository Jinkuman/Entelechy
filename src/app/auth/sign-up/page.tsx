"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signUpForm, signUpSchema } from "@/app/schemas/authSchema";
import supabase from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: signUpForm) => {
    setLoading(true);
    const { name, email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        // Storing additional user data in metadata (adjust this as needed)
        data: { name },
      },
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Redirect to sign in page (or another route) after successful sign up
      router.push("/auth/sign-in");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-lg">
        {/* Branding Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create your Entelechy account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Join us and start your journey toward becoming your best self.
          </p>
        </div>

        {/* Sign-up Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-200"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              {...register("name")}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-200"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
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
              autoComplete="new-password"
              {...register("password")}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-zinc-200"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="•••••••••••••"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-500"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-4 text-center">
          <p className="mt-2 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
