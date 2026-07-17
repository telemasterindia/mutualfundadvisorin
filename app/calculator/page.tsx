import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "SEBI-Aligned Financial Calculators - SIP, EMI, Retirement | WealthMaster India",
  description:
    "Use transparent SIP, Goal SIP, Lumpsum, EMI, Retirement and Net Worth calculators with SEBI investor-awareness notes, assumptions and risk disclosures.",
};

export default function Page() {
  return <ClientPage />;
}
