import { Suspense } from "react";
import type { Metadata } from "next";
import ClientPage from "./page-client";
import { AuthProvider } from "@/lib/use-auth";

export const metadata: Metadata = {
  title: "Login - WealthMaster India",
  description: "Login to your WealthMaster India investment account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ClientPage />
      </Suspense>
    </AuthProvider>
  );
}
