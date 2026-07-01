import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Contact WealthMaster India",
  description:
    "Contact WealthMaster India for mutual fund advisory, SIP planning and investment consultation.",
};

export default function Page() {
  return <ClientPage />;
}
