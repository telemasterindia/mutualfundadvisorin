import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "SIP Calculator India – Estimate SIP Growth | WealthMaster India",
  description:
    "Use our SIP and financial calculators to estimate goal values using your assumptions. Results are illustrations, not guaranteed returns.",
  alternates: { canonical: "/calculator" },
};

export default function Page() {
  return <ClientPage />;
}
