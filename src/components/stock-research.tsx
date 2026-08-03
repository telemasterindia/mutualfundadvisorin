"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Landmark,
  Scale,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DataRow = Record<string, number | string | null>;

type StockResearchData = {
  symbol: string;
  profile: {
    name?: string;
    description?: string;
    website?: string;
    industry?: string;
    sector?: string;
    macro_sector?: string;
    market_cap?: number | string | null;
    nse_code?: string;
    bse_code?: string;
  } | null;
  financials: {
    profitLoss: DataRow[];
    balanceSheet: DataRow[];
    cashFlow: DataRow[];
  };
  ratios: DataRow[];
  shareholding: DataRow[];
  availableSections: number;
};

type Tab = "profit" | "balance" | "cash" | "ratios" | "ownership";

const tabs: Array<{ id: Tab; label: string; icon: typeof BarChart3 }> = [
  { id: "profit", label: "Profit & Loss", icon: CircleDollarSign },
  { id: "balance", label: "Balance Sheet", icon: Scale },
  { id: "cash", label: "Cash Flow", icon: Landmark },
  { id: "ratios", label: "Key Ratios", icon: BarChart3 },
  { id: "ownership", label: "Ownership", icon: Users },
];

const tableRows: Record<
  Exclude<Tab, "ratios" | "ownership">,
  Array<{ label: string; key: string; perShare?: boolean }>
> = {
  profit: [
    { label: "Revenue from operations", key: "revenueFromOperations" },
    { label: "Total income", key: "income" },
    { label: "Total expenses", key: "expenses" },
    { label: "Profit before tax", key: "profitBeforeTax" },
    { label: "Net profit", key: "profitLossForPeriod" },
    { label: "EPS", key: "eps", perShare: true },
  ],
  balance: [
    { label: "Total assets", key: "assets" },
    { label: "Current assets", key: "currentAssets" },
    { label: "Cash & equivalents", key: "cashAndCashEquivalents" },
    { label: "Total equity", key: "totalEquity" },
    { label: "Current liabilities", key: "currentLiabilities" },
    { label: "Non-current liabilities", key: "noncurrentLiabilities" },
  ],
  cash: [
    { label: "Operating cash flow", key: "cashFlowsFromOperatingActivities" },
    { label: "Investing cash flow", key: "cashFlowsFromInvestingActivities" },
    { label: "Financing cash flow", key: "cashFlowsFromFinancingActivities" },
    { label: "Capital expenditure", key: "purchaseOfPPEClassifiedAsInvesting" },
    { label: "Net cash flow", key: "netCashFlow" },
  ],
};

const ratioRows = [
  { label: "Gross margin", key: "grossMargin" },
  { label: "Operating margin", key: "operatingMargin" },
  { label: "EBITDA margin", key: "ebitdaMargin" },
  { label: "Net margin", key: "netMargin" },
  { label: "Return on equity", key: "returnOnEquity" },
  { label: "Return on capital", key: "returnOnCapital" },
  { label: "Return on assets", key: "returnOnAsset" },
];

const asNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const formatCrores = (value: number | string | null | undefined) => {
  const parsed = asNumber(value);
  if (parsed === null) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(parsed / 10_000_000);
};

const formatNumber = (value: number | string | null | undefined, digits = 2) => {
  const parsed = asNumber(value);
  if (parsed === null) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(parsed);
};

const formatPercent = (value: number | string | null | undefined) => {
  const parsed = asNumber(value);
  return parsed === null ? "—" : `${(parsed * 100).toFixed(1)}%`;
};

function FinancialTable({
  rows,
  data,
}: {
  rows: Array<{ label: string; key: string; perShare?: boolean }>;
  data: DataRow[];
}) {
  const ordered = [...data].sort((a, b) => (asNumber(a.year) ?? 0) - (asNumber(b.year) ?? 0));

  if (!ordered.length) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground">
            <th className="sticky left-0 z-10 min-w-52 bg-muted px-4 py-3 text-left font-semibold">
              Figures in ₹ Crores
            </th>
            {ordered.map((item) => (
              <th key={String(item.year)} className="px-4 py-3 text-right font-semibold">
                Mar {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.key} className="hover:bg-muted/30">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
                {row.label}
              </th>
              {ordered.map((item) => (
                <td key={`${row.key}-${item.year}`} className="num px-4 py-3 text-right">
                  {row.perShare ? formatNumber(item[row.key]) : formatCrores(item[row.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RatiosTable({ data }: { data: DataRow[] }) {
  const ordered = [...data].sort((a, b) => (asNumber(a.year) ?? 0) - (asNumber(b.year) ?? 0));
  if (!ordered.length) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground">
            <th className="sticky left-0 z-10 min-w-52 bg-muted px-4 py-3 text-left font-semibold">
              Profitability ratios
            </th>
            {ordered.map((item) => (
              <th key={String(item.year)} className="px-4 py-3 text-right font-semibold">
                {item.header ?? `Mar ${item.year}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {ratioRows.map((row) => (
            <tr key={row.key} className="hover:bg-muted/30">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
                {row.label}
              </th>
              {ordered.map((item) => (
                <td key={`${row.key}-${item.year}`} className="num px-4 py-3 text-right">
                  {formatPercent(item[row.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OwnershipTable({ data }: { data: DataRow[] }) {
  const ordered = [...data].reverse();
  if (!ordered.length) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground">
            <th className="sticky left-0 z-10 min-w-52 bg-muted px-4 py-3 text-left font-semibold">
              Shareholding summary
            </th>
            {ordered.map((item) => (
              <th key={String(item.header)} className="px-4 py-3 text-right font-semibold">
                {item.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr className="hover:bg-muted/30">
            <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
              Total shares (Cr)
            </th>
            {ordered.map((item) => (
              <td key={`shares-${item.header}`} className="num px-4 py-3 text-right">
                {formatCrores(item.totalShares)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30">
            <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
              Total shareholders
            </th>
            {ordered.map((item) => (
              <td key={`holders-${item.header}`} className="num px-4 py-3 text-right">
                {formatNumber(item.totalShareholders, 0)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-muted/30">
            <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
              Demat equity shares
            </th>
            {ordered.map((item) => (
              <td key={`demat-${item.header}`} className="num px-4 py-3 text-right">
                {formatCrores(item.dematEquityShares)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-48 place-items-center p-6 text-center text-sm text-muted-foreground">
      This dataset is not available for the selected company.
    </div>
  );
}

export function StockResearch({ symbol }: { symbol: string }) {
  const [research, setResearch] = useState<StockResearchData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profit");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/stocks/fundamentals?symbol=${encodeURIComponent(symbol)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          research?: StockResearchData;
          error?: string;
        };
        if (!response.ok || !payload.research) {
          throw new Error(payload.error ?? "Fundamental data is unavailable.");
        }
        setResearch(payload.research);
      })
      .catch((requestError) => {
        if ((requestError as Error).name !== "AbortError") {
          setResearch(null);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Fundamental data is unavailable.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [symbol]);

  const activeContent = useMemo(() => {
    if (!research) return null;
    if (activeTab === "profit") {
      return <FinancialTable rows={tableRows.profit} data={research.financials.profitLoss} />;
    }
    if (activeTab === "balance") {
      return <FinancialTable rows={tableRows.balance} data={research.financials.balanceSheet} />;
    }
    if (activeTab === "cash") {
      return <FinancialTable rows={tableRows.cash} data={research.financials.cashFlow} />;
    }
    if (activeTab === "ratios") return <RatiosTable data={research.ratios} />;
    return <OwnershipTable data={research.shareholding} />;
  }, [activeTab, research]);

  if (loading) {
    return <div className="mt-5 h-80 animate-pulse rounded-3xl bg-muted" />;
  }

  if (error || !research) {
    return (
      <div className="mt-5 rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
        More company fundamentals are not available for this symbol yet.
      </div>
    );
  }

  const profile = research.profile;
  const website = profile?.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : null;

  return (
    <section id="fundamentals" className="mt-5 scroll-mt-28">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
        <div className="border-b bg-gradient-to-br from-primary/10 via-card to-success/5 p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <Building2 className="h-4 w-4" />
                Company fundamentals
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {profile?.name ?? research.symbol}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[profile?.macro_sector, profile?.sector, profile?.industry]
                  .filter(Boolean)
                  .map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))}
              </div>
              {profile?.description && (
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {profile.description}
                </p>
              )}
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-3 lg:w-72">
              <div className="rounded-2xl border bg-background/80 p-4">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                <div className="mt-3 text-[10px] font-semibold uppercase text-muted-foreground">
                  Market cap
                </div>
                <div className="mt-1 font-bold">₹{formatNumber(profile?.market_cap, 0)} Cr</div>
              </div>
              <div className="rounded-2xl border bg-background/80 p-4">
                <BarChart3 className="h-4 w-4 text-primary" />
                <div className="mt-3 text-[10px] font-semibold uppercase text-muted-foreground">
                  Exchange code
                </div>
                <div className="mt-1 font-bold">{profile?.nse_code ?? research.symbol}</div>
              </div>
            </div>
          </div>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline"
            >
              Visit company website →
            </a>
          )}
        </div>

        <div className="border-b px-3 pt-3 sm:px-5">
          <div className="flex gap-1 overflow-x-auto pb-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeContent}

        <div className="flex flex-col gap-4 border-t bg-muted/25 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-lg font-bold">Need help reading the numbers?</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Understand how business fundamentals fit into a diversified financial plan.
            </p>
          </div>
          <Link href="/book-consultation" prefetch={false}>
            <Button className="rounded-full">
              Discuss with Amit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Consolidated annual financials and quarterly ownership data provided by FinEdge API. Values
        may be delayed or restated. Review official exchange filings before making decisions.
      </p>
    </section>
  );
}
