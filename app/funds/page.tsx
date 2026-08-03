import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Explore Mutual Funds and Latest NAVs | WealthMaster India",
  description:
    "Explore mutual fund categories and fresh AMFI NAV information for educational comparison. Scheme listings are not recommendations.",
  alternates: { canonical: "/funds" },
};

export default function Page() {
  return <ClientPage />;
}
