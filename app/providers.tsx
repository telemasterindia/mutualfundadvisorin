"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/lib/theme";

const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

const toastRoutes = [
  "/admin",
  "/auth/callback",
  "/book-consultation",
  "/calculator",
  "/contact",
  "/get-started",
  "/login",
  "/onboarding",
  "/reset-password",
  "/signup",
];

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsToaster = toastRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return (
    <ThemeProvider>
      {children}
      {needsToaster && <Toaster />}
    </ThemeProvider>
  );
}
