"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme";

const FloatingContact = dynamic(
  () => import("@/components/floating-contact").then((mod) => mod.FloatingContact),
  { ssr: false },
);

const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <FloatingContact />
      <Toaster />
    </ThemeProvider>
  );
}
