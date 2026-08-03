import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Market – Stocks, Indices and Movers | WealthMaster India",
  description: "Search free delayed stock quotes and historical prices from Yahoo Finance.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ClientPage />;
}
