import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Free Stock Market Data | WealthMaster India",
  description: "Search free delayed stock quotes and historical prices from Yahoo Finance.",
};

export default function Page() {
  return <ClientPage />;
}
