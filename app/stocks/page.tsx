import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Indian Market Overview – Indices and Movers | WealthMaster India",
  description:
    "View delayed Indian market indices, market movers and company information for general educational purposes. Data is not investment advice or a buy/sell recommendation.",
  alternates: { canonical: "/stocks" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ClientPage />;
}
