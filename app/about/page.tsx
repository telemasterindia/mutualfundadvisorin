import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "About WealthMaster India | AMFI ARN 349461",
  description:
    "Learn about WealthMaster India, an AMFI-registered Mutual Fund Distributor based in Rajouri Garden, New Delhi. ARN 349461.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <ClientPage />;
}
