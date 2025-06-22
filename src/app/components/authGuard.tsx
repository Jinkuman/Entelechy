// components/AuthGuard.tsx
import { useAuth } from "../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  redirectTo = "/auth/sign-in",
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define auth routes that don't require authentication
  const authRoutes = ["/auth", "/login", "/signup", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and trying to access a protected route
      if (!user && !isAuthRoute) {
        router.replace(redirectTo);
      }
      // If user is authenticated and trying to access an auth route, redirect to dashboard
      else if (user && isAuthRoute) {
        router.replace("/pages/dashboard");
      }
    }
  }, [user, loading, router, redirectTo, isAuthRoute, pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Allow access to auth routes even if user is not authenticated
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Don't render children if user is not authenticated and trying to access protected route
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
