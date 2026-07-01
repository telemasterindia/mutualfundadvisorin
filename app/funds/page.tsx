import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Explore Mutual Funds - WealthMaster India",
  description:
    "Explore curated mutual funds across equity, debt, gold, sectoral, large cap, mid cap and flexi cap categories.",
};

export default function Page() {
  return <ClientPage />;
}
