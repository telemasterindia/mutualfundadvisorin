import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Portfolio - WealthMaster India",
  description: "Track mutual fund holdings, asset allocation and portfolio performance.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
