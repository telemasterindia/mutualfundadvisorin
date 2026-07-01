import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Onboarding - WealthMaster India",
  description: "Complete your investment profile and risk preferences.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
