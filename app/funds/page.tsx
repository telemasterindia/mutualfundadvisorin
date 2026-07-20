import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Mutual Funds - Explore Categories and NAVs | WealthMaster India",
  description:
    "Explore mutual fund categories and fresh AMFI NAV information for educational comparison. Scheme listings are not recommendations.",
};

export default function Page() {
  return <ClientPage />;
}
