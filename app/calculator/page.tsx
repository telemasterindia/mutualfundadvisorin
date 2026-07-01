import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "SIP Calculator - WealthMaster India",
  description:
    "Calculate SIP growth, future value, invested amount and estimated gains for long-term mutual fund planning.",
};

export default function Page() {
  return <ClientPage />;
}
