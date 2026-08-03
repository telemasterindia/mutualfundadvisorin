import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Mutual Fund Distributor in Delhi | WealthMaster India",
  description:
    "AMFI-registered Mutual Fund Distributor in Rajouri Garden, Delhi. Get assistance with SIPs, mutual funds and regular-plan investments. ARN 349461.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "AMFI-registered Mutual Fund Distributor in Rajouri Garden, Delhi. SIP and regular-plan assistance. ARN 349461.",
    url: "/",
  },
};

export default function Page() {
  return <ClientPage />;
}
