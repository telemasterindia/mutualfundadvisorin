import type { Metadata } from "next";
import ClientPage from "./page-client";
import { AuthProvider } from "@/lib/use-auth";

export const metadata: Metadata = {
  title: "Admin CRM - WealthMaster India",
  description: "Advisor CRM for WealthMaster India leads and consultations.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthProvider>
      <ClientPage />
    </AuthProvider>
  );
}
