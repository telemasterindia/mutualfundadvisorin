import type { Metadata } from "next";
import ClientPage from "./page-client";

export const metadata: Metadata = {
  title: "About WealthMaster India",
  description:
    "Learn how WealthMaster India supports mutual fund education, goal planning and investment assistance.",
};

export default function Page() {
  return <ClientPage />;
}
