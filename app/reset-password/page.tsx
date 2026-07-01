import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Reset Password - WealthMaster India",
  description: "Set a new password for your WealthMaster India account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
