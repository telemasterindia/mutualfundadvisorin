import type { SupabaseClient } from "@supabase/supabase-js";
import {
  allocation as fallbackAllocation,
  goals as fallbackGoals,
  holdings as fallbackHoldings,
  investor as fallbackInvestor,
  news as fallbackNews,
  portfolioGrowth as fallbackPortfolioGrowth,
  portfolioStats as fallbackPortfolioStats,
  sectorAllocation as fallbackSectorAllocation,
  sips as fallbackSips,
  transactions as fallbackTransactions,
} from "@/lib/mock-data";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const AMC_COLORS: Record<string, string> = {
  axis: "#97144D",
  hdfc: "#ED232A",
  icici: "#F7941E",
  kotak: "#ED1C24",
  mirae: "#0F6FB7",
  nippon: "#E2231A",
  parag: "#1E5BAF",
  ppfas: "#1E5BAF",
  sbi: "#22409A",
};

export type DashboardNewsItem = {
  title: string;
  time: string;
  source: string;
  url?: string;
};

export type AdvisorDashboardData = {
  investor: typeof fallbackInvestor;
  portfolioStats: typeof fallbackPortfolioStats;
  portfolioGrowth: typeof fallbackPortfolioGrowth;
  allocation: typeof fallbackAllocation;
  sectorAllocation: typeof fallbackSectorAllocation;
  holdings: typeof fallbackHoldings;
  sips: typeof fallbackSips;
  transactions: typeof fallbackTransactions;
  goals: typeof fallbackGoals;
  news: DashboardNewsItem[];
};

export const fallbackDashboardData: AdvisorDashboardData = {
  investor: fallbackInvestor,
  portfolioStats: fallbackPortfolioStats,
  portfolioGrowth: fallbackPortfolioGrowth,
  allocation: fallbackAllocation,
  sectorAllocation: fallbackSectorAllocation,
  holdings: fallbackHoldings,
  sips: fallbackSips,
  transactions: fallbackTransactions,
  goals: fallbackGoals,
  news: fallbackNews,
};

type FundRow = {
  id?: string;
  name?: string | null;
  category?: string | null;
  amc?: string | null;
  nav?: number | string | null;
  return_1y?: number | string | null;
  return_3y?: number | string | null;
  return_5y?: number | string | null;
  risk_level?: string | null;
};

const toNumber = (value: unknown, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const titleCase = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const formatShortDate = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatMonth = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
};

const getAmcShort = (amc?: string | null, fund?: string | null) => {
  const source = (amc || fund || "MF").replace(/mutual fund|asset|management|limited|ltd/gi, "");
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "MF";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getAmcColor = (amc?: string | null, fund?: string | null) => {
  const source = `${amc ?? ""} ${fund ?? ""}`.toLowerCase();
  const match = Object.entries(AMC_COLORS).find(([key]) => source.includes(key));
  return match?.[1] ?? "#1E5BAF";
};

const fundFromRelation = (value: unknown): FundRow => {
  if (Array.isArray(value)) return (value[0] ?? {}) as FundRow;
  return (value ?? {}) as FundRow;
};

const daysUntil = (value: string | null | undefined) => {
  if (!value) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((date.getTime() - today.getTime()) / 86400000));
};

const calculateRiskScore = (holdings: AdvisorDashboardData["holdings"]) => {
  const total = holdings.reduce((sum, holding) => sum + holding.current, 0);
  if (!total) return fallbackPortfolioStats.riskScore;

  const score = holdings.reduce((sum, holding) => {
    const category = holding.category.toLowerCase();
    const weight = holding.current / total;
    const risk = category.includes("debt")
      ? 25
      : category.includes("gold")
        ? 45
        : category.includes("hybrid")
          ? 55
          : 80;
    return sum + risk * weight;
  }, 0);

  return Math.round(score);
};

export async function loadAdvisorDashboardData(
  supabase: SupabaseClient,
  userId: string,
): Promise<AdvisorDashboardData> {
  const [
    profileResult,
    portfoliosResult,
    sipsResult,
    transactionsResult,
    goalsResult,
    snapshotsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("portfolios")
      .select("*, fund:mutual_funds(*)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("sips")
      .select("*, fund:mutual_funds(*)")
      .eq("user_id", userId)
      .order("next_date", { ascending: true }),
    supabase
      .from("transactions")
      .select("*, fund:mutual_funds(*)")
      .eq("user_id", userId)
      .order("txn_date", { ascending: false })
      .limit(12),
    (supabase as any)
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("target_year", { ascending: true }),
    (supabase as any)
      .from("portfolio_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("snapshot_date", { ascending: true })
      .limit(13),
  ]);

  const profile = (profileResult.data ?? {}) as any;
  const portfolios = (portfoliosResult.data ?? []) as any[];
  const sipRows = (sipsResult.data ?? []) as any[];
  const transactionRows = (transactionsResult.data ?? []) as any[];
  const goalRows = (goalsResult.data ?? []) as any[];
  const snapshotRows = (snapshotsResult.data ?? []) as any[];

  const investor = {
    ...fallbackInvestor,
    name: profile.full_name || fallbackInvestor.name,
    email: profile.email || fallbackInvestor.email,
    pan: profile.pan || fallbackInvestor.pan,
    riskProfile: profile.risk_profile
      ? titleCase(profile.risk_profile)
      : fallbackInvestor.riskProfile,
  };

  const holdings =
    portfolios.length > 0
      ? portfolios.map((row) => {
          const fund = fundFromRelation(row.fund);
          const invested = toNumber(row.invested_amount);
          const current = toNumber(row.current_value);
          const amc = fund.amc ?? "Mutual Fund";
          const name = fund.name ?? "Mutual Fund Holding";

          return {
            fund: name,
            amc,
            amcShort: getAmcShort(amc, name),
            amcColor: getAmcColor(amc, name),
            category: (fund.category ||
              "Equity") as AdvisorDashboardData["holdings"][number]["category"],
            invested,
            current,
            units: toNumber(row.units),
            return1y: toNumber(fund.return_1y),
            xirr: invested > 0 ? Number((((current - invested) / invested) * 100).toFixed(1)) : 0,
          };
        })
      : fallbackHoldings;

  const invested = holdings.reduce((sum, holding) => sum + holding.invested, 0);
  const totalValue = holdings.reduce((sum, holding) => sum + holding.current, 0);
  const gain = totalValue - invested;
  const gainPercent = invested > 0 ? Number(((gain / invested) * 100).toFixed(2)) : 0;

  const sips =
    sipRows.length > 0
      ? sipRows.map((row) => {
          const fund = fundFromRelation(row.fund);
          const nextDate = row.next_date as string | null;
          const day = nextDate ? new Date(nextDate).getDate() : new Date(row.start_date).getDate();
          const status =
            String(row.status ?? "active").toLowerCase() === "active" ? "Active" : "Paused";
          const amc = fund.amc ?? "MF";
          const name = fund.name ?? "SIP";

          return {
            fund: name,
            amc,
            amcColor: getAmcColor(amc, name),
            amount: toNumber(row.amount),
            day,
            nextDate: formatShortDate(nextDate),
            daysLeft: daysUntil(nextDate),
            status,
          };
        })
      : fallbackSips;

  const transactions =
    transactionRows.length > 0
      ? transactionRows.map((row) => {
          const fund = fundFromRelation(row.fund);
          const amc = fund.amc ?? "MF";
          const name = fund.name ?? "Transaction";

          return {
            id: row.id,
            fund: name,
            amc,
            amcColor: getAmcColor(amc, name),
            type: titleCase(row.type ?? "Buy"),
            amount: toNumber(row.amount),
            units: toNumber(row.units),
            nav: toNumber(row.nav || fund.nav),
            date: formatShortDate(row.txn_date),
          };
        })
      : fallbackTransactions;

  const goals =
    goalRows.length > 0
      ? goalRows.map((row) => {
          const targetYear = Number(row.target_year);
          const yearsLeft = Number.isFinite(targetYear)
            ? Math.max(0, targetYear - new Date().getFullYear())
            : 0;

          return {
            id: row.id,
            name: row.name,
            icon: row.icon ?? "retirement",
            target: toNumber(row.target_amount),
            current: toNumber(row.current_amount),
            monthlySip: toNumber(row.monthly_sip),
            targetYear,
            yearsLeft,
            onTrack: row.status !== "behind",
            color: row.color ?? "#1E5BAF",
          };
        })
      : fallbackGoals;

  const allocationTotals = holdings.reduce<Record<string, number>>((acc, holding) => {
    acc[holding.category] = (acc[holding.category] ?? 0) + holding.current;
    return acc;
  }, {});

  const allocation =
    totalValue > 0
      ? Object.entries(allocationTotals).map(([name, value], index) => ({
          name,
          value: Number(((value / totalValue) * 100).toFixed(1)),
          color: CHART_COLORS[index % CHART_COLORS.length],
        }))
      : fallbackAllocation;

  const portfolioGrowth =
    snapshotRows.length > 0
      ? snapshotRows.map((row) => ({
          month: formatMonth(row.snapshot_date),
          value: toNumber(row.current_value),
          invested: toNumber(row.invested_amount),
        }))
      : fallbackPortfolioGrowth;

  const monthlySipTotal = sips
    .filter((sip) => sip.status === "Active")
    .reduce((sum, sip) => sum + sip.amount, 0);
  const riskScore = calculateRiskScore(holdings);

  return {
    investor,
    holdings,
    sips,
    transactions,
    goals,
    allocation,
    portfolioGrowth,
    sectorAllocation: fallbackSectorAllocation,
    news: fallbackNews,
    portfolioStats: {
      ...fallbackPortfolioStats,
      totalValue,
      invested,
      gain,
      gainPercent,
      todayChange: 0,
      todayChangePercent: 0,
      oneDayPercent: 0,
      monthlySipTotal,
      goalProgress:
        goals.length > 0
          ? Math.round(
              goals.reduce(
                (sum, goal) => sum + Math.min(100, (goal.current / goal.target) * 100),
                0,
              ) / goals.length,
            )
          : fallbackPortfolioStats.goalProgress,
      riskScore,
      healthScore: Math.max(45, Math.min(95, 100 - Math.abs(riskScore - 65))),
      xirr: gainPercent,
      cagr: gainPercent,
    },
  };
}
