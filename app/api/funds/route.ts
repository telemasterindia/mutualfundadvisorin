import { NextResponse } from "next/server";
import { fetchFreshAmfiFunds } from "@/lib/amfi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const limit = Number(searchParams.get("limit") ?? 100);

  try {
    const funds = await fetchFreshAmfiFunds(7);
    const filteredFunds = query
      ? funds.filter((fund) =>
          [fund.schemeName, fund.fundHouse, fund.category, fund.schemeCode]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(query)),
        )
      : funds;

    return NextResponse.json({
      source: "AMFI",
      asOf: new Date().toISOString(),
      count: filteredFunds.length,
      funds: filteredFunds.slice(0, Number.isFinite(limit) && limit > 0 ? limit : 100),
    });
  } catch {
    return NextResponse.json(
      { source: "AMFI", count: 0, funds: [], error: "Unable to fetch fresh AMFI NAV data." },
      { status: 502 },
    );
  }
}
