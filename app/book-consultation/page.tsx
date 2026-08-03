import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Book a Mutual Fund Consultation | WealthMaster India",
  description:
    "Book a consultation with Amit Chadha for mutual fund distribution support, SIP assistance and investor education.",
  alternates: { canonical: "/book-consultation" },
};

export default function Page() {
  return <ClientPage />;
}
