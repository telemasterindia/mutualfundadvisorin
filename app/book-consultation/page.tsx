import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Book Consultation - WealthMaster India",
  description:
    "Book a consultation with Amit Chadha for mutual fund advisory, SIP planning and portfolio review.",
};

export default function Page() {
  return <ClientPage />;
}
