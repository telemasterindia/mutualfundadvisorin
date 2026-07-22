import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNavHistory } from "@/lib/mfapi";
import FundDetailClient from "./page-client";

type PageProps = { params: Promise<{ schemeCode: string }> };

async function loadFund(schemeCode: string) {
  if (!/^\d+$/.test(schemeCode)) return null;

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 5);

  try {
    const response = await getNavHistory(schemeCode, {
      startDate: startDate.toISOString().slice(0, 10),
    });
    return response.status === "SUCCESS" && response.data.length ? response : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { schemeCode } = await params;
  const fund = await loadFund(schemeCode);

  return fund
    ? {
        title: `${fund.meta.scheme_name} NAV & History | WealthMaster India`,
        description: `View the latest NAV and historical NAV movement for ${fund.meta.scheme_name}.`,
      }
    : { title: "Fund not found | WealthMaster India" };
}

export default async function FundDetailPage({ params }: PageProps) {
  const { schemeCode } = await params;
  const fund = await loadFund(schemeCode);
  if (!fund) notFound();

  return <FundDetailClient fund={fund} />;
}
