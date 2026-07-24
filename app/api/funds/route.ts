import { NextResponse } from "next/server";
import { fetchFreshAmfiFunds } from "@/lib/amfi";

const categoryKeywords: Record<string, string[]> = {
  "large-cap": ["large cap"],
  "flexi-cap": ["flexi cap", "flexicap"],
  "mid-cap": ["mid cap", "midcap"],
  "small-cap": ["small cap", "smallcap"],
  sectoral: ["sectoral", "thematic", "banking", "pharma", "technology", "infrastructure"],
  debt: ["debt", "liquid", "money market", "gilt", "bond", "overnight", "duration"],
  "gold-etf": ["gold", "gold etf"],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category")?.trim().toLowerCase() ?? "all";
  const limit = Math.min(Number(searchParams.get("limit") ?? 60), 100);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  try {
    const funds = await fetchFreshAmfiFunds(7);
    const keywords = categoryKeywords[category] ?? [];
    const filteredFunds = funds.filter((fund) => {
      const searchableText = [fund.schemeName, fund.fundHouse, fund.category, fund.schemeCode]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchableText.includes(query)) &&
        (category === "all" || keywords.some((keyword) => searchableText.includes(keyword)))
      );
    });
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 60;
    const safeOffset = Number.isFinite(offset) ? offset : 0;

    return NextResponse.json({
      source: "AMFI",
      asOf: new Date().toISOString(),
      total: filteredFunds.length,
      count: Math.min(safeLimit, Math.max(filteredFunds.length - safeOffset, 0)),
      offset: safeOffset,
      funds: filteredFunds.slice(safeOffset, safeOffset + safeLimit),
    });
  } catch {
    return NextResponse.json(
      { source: "AMFI", count: 0, funds: [], error: "Unable to fetch fresh AMFI NAV data." },
      { status: 502 },
    );
  }
}
