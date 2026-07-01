"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/use-auth";
import { Toaster } from "@/components/ui/sonner";

const FloatingContact = dynamic(
  () => import("@/components/floating-contact").then((mod) => mod.FloatingContact),
  { ssr: false },
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <FloatingContact />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
