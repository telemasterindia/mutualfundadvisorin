import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Financial Calculators - SIP, EMI, Retirement & Net Worth | WealthMaster India",
  description:
    "Use SIP, Goal SIP, Lumpsum, EMI, Retirement and Net Worth calculators to plan investments, loans and financial goals.",
};

export default function Page() {
  return <ClientPage />;
}
