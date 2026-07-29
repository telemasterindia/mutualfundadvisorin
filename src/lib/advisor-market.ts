import { getNavHistory, searchMutualFundSchemes } from "@/lib/mfapi";
import { getFreeStockHistory, getFreeStockOverview } from "@/lib/free-stock-data";

type Risk = "conservative" | "moderate" | "aggressive";

export type AdvisorMarketIdeas = {
  asOf: string;
  allocation: { mutualFunds: number; stocks: number; reserve: number };
  monthlyAmount: number | null;
  funds: Array<{
    schemeCode: number;
    name: string;
    category: string;
    trailingReturn: number;
    monthlySip: number | null;
  }>;
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    trailingReturn: number;
    monthlyAmount: number | null;
  }>;
};

const stockUniverse = [
  ["RELIANCE", "Reliance Industries"],
  ["HDFCBANK", "HDFC Bank"],
  ["ICICIBANK", "ICICI Bank"],
  ["TCS", "Tata Consultancy Services"],
  ["INFY", "Infosys"],
  ["BHARTIARTL", "Bharti Airtel"],
  ["ITC", "ITC"],
  ["SBIN", "State Bank of India"],
] as const;

function trailingReturn(points: Array<{ date: string; nav: number }>, days = 365) {
  const sorted = points.sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted.at(-1);
  if (!latest) return null;
  const cutoff = new Date(latest.date);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  const start = sorted.find((point) => new Date(point.date) >= cutoff);
  if (!start || start.nav <= 0) return null;
  return (latest.nav / start.nav - 1) * 100;
}

function fundQueries(risk: Risk, horizon: number) {
  if (horizon <= 3) return ["liquid fund direct growth", "short duration direct growth"];
  if (risk === "conservative") {
    return ["conservative hybrid direct growth", "balanced advantage direct growth"];
  }
  if (risk === "aggressive") {
    return [
      "flexi cap direct growth",
      "large and mid cap direct growth",
      "nifty 50 index direct growth",
    ];
  }
  return [
    "balanced advantage direct growth",
    "flexi cap direct growth",
    "nifty 50 index direct growth",
  ];
}

function allocationFor(risk: Risk, horizon: number, experience: string) {
  const stockEligible = horizon >= 7 && experience !== "first-time";
  if (!stockEligible) return { mutualFunds: 90, stocks: 0, reserve: 10 };
  if (risk === "aggressive") return { mutualFunds: 70, stocks: 20, reserve: 10 };
  if (risk === "moderate") return { mutualFunds: 80, stocks: 10, reserve: 10 };
  return { mutualFunds: 90, stocks: 0, reserve: 10 };
}

export async function buildAdvisorMarketIdeas(input: {
  risk: Risk;
  horizon: number;
  experience: string;
  capacity: number | null;
  capacityType: "monthly" | "lumpsum";
}): Promise<AdvisorMarketIdeas> {
  const allocation = allocationFor(input.risk, input.horizon, input.experience);
  const monthlyAmount =
    input.capacity && input.capacity > 0
      ? input.capacityType === "monthly"
        ? input.capacity
        : Math.round(input.capacity / 6)
      : null;

  const queryResults = await Promise.all(
    fundQueries(input.risk, input.horizon).map(async (query) => {
      try {
        return await searchMutualFundSchemes(query);
      } catch {
        return [];
      }
    }),
  );
  const candidates = queryResults
    .flat()
    .filter((fund) => {
      const name = fund.schemeName.toLowerCase();
      return name.includes("direct") && name.includes("growth") && !name.includes("idcw");
    })
    .filter(
      (fund, index, funds) =>
        funds.findIndex((candidate) => candidate.schemeCode === fund.schemeCode) === index,
    )
    .slice(0, 18);

  const fundScreens = (
    await Promise.all(
      candidates.map(async (fund) => {
        try {
          const history = await getNavHistory(fund.schemeCode);
          const value = trailingReturn(
            history.data.map((point) => ({
              date: point.date.split("-").reverse().join("-"),
              nav: Number(point.nav),
            })),
          );
          if (value === null || !Number.isFinite(value)) return null;
          return {
            schemeCode: fund.schemeCode,
            name: history.meta.scheme_name || fund.schemeName,
            category: history.meta.scheme_category,
            trailingReturn: value,
            monthlySip: null as number | null,
          };
        } catch {
          return null;
        }
      }),
    )
  )
    .filter((fund): fund is NonNullable<typeof fund> => fund !== null)
    .sort((a, b) => b.trailingReturn - a.trailingReturn)
    .slice(0, 3);

  const funds = fundScreens.map((fund) => ({
    ...fund,
    monthlySip:
      monthlyAmount && fundScreens.length
        ? Math.round((monthlyAmount * allocation.mutualFunds) / 100 / fundScreens.length / 100) *
          100
        : null,
  }));

  const stockScreens =
    allocation.stocks > 0
      ? (
          await Promise.all(
            stockUniverse.map(async ([symbol, name]) => {
              try {
                const [history, overview] = await Promise.all([
                  getFreeStockHistory(symbol, "1y"),
                  getFreeStockOverview(symbol),
                ]);
                const value = trailingReturn(
                  history.points.map((point) => ({ date: point.date, nav: point.close ?? 0 })),
                );
                if (value === null || !Number.isFinite(value)) return null;
                return { symbol, name, price: overview.price, trailingReturn: value };
              } catch {
                return null;
              }
            }),
          )
        )
          .filter((stock): stock is NonNullable<typeof stock> => stock !== null)
          .sort((a, b) => b.trailingReturn - a.trailingReturn)
          .slice(0, 3)
      : [];

  const stocks = stockScreens.map((stock) => ({
    ...stock,
    monthlyAmount:
      monthlyAmount && stockScreens.length
        ? Math.round((monthlyAmount * allocation.stocks) / 100 / stockScreens.length / 100) * 100
        : null,
  }));

  return {
    asOf: new Date().toISOString(),
    allocation,
    monthlyAmount,
    funds,
    stocks,
  };
}
