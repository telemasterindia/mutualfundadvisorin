import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "WealthMaster India - Build Long-Term Wealth with Confidence",
  description:
    "Independent financial services and wealth advisory: Mutual Funds, SIPs, Insurance, PMS, AIF, NCDs and Retirement Planning for Indian investors.",
};

export default function Page() {
  return <ClientPage />;
}
