import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Mutual Fund Distributor in Delhi | WealthMaster India",
  description:
    "Connect with WealthMaster India, an AMFI-registered Mutual Fund Distributor in Rajouri Garden, Delhi. Explore SIPs, mutual funds and Regular Plan assistance. ARN 349461.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "Explore mutual funds, SIP calculators and investor education, or request a consultation with an AMFI-registered Mutual Fund Distributor in Delhi.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "Explore mutual funds, SIP calculators and investor education, or request a consultation with an AMFI-registered Mutual Fund Distributor in Delhi.",
    images: ["/icon.svg"],
  },
};

export default function Page() {
  return <ClientPage />;
}
