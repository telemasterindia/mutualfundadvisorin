import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Contact a Mutual Fund Distributor in Rajouri Garden, Delhi",
  description:
    "Contact WealthMaster India in Rajouri Garden, New Delhi for mutual fund distribution support, SIP assistance and investor education. ARN 349461.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ClientPage />;
}
