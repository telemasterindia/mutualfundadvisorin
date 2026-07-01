import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Sign Up - WealthMaster India",
  description: "Create your WealthMaster India investment account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
