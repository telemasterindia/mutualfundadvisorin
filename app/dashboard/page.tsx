import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Investor Dashboard - WealthMaster India",
  description:
    "Your portfolio overview: SIPs, goals, allocation, XIRR and recent transactions in one place.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
