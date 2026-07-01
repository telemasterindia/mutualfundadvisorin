import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Login - WealthMaster India",
  description: "Login to your WealthMaster India investment account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
