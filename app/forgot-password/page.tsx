import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Forgot Password - WealthMaster India",
  description: "Reset access to your WealthMaster India account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
