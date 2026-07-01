import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "About WealthMaster India",
  description:
    "Learn about WealthMaster India, an independent wealth advisory platform for Indian investors.",
};

export default function Page() {
  return <ClientPage />;
}
