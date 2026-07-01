import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "Get Started - WealthMaster India",
  description: "Start your investment planning journey with WealthMaster India.",
};

export default function Page() {
  return <ClientPage />;
}
