import { NextResponse } from "next/server";
import { fetchFreshAmfiFunds } from "@/lib/amfi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (query.trim().length < 2) {
    return NextResponse.json({ funds: [] });
  }

  try {
    const normalizedQuery = query.trim().toLowerCase();
    const funds = (await fetchFreshAmfiFunds(7))
      .filter((fund) =>
        [fund.schemeName, fund.fundHouse, fund.category, fund.schemeCode]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 9)
      .map((fund) => ({
        schemeCode: Number(fund.schemeCode),
        schemeName: fund.schemeName,
        nav: fund.navText,
        navDate: fund.date,
        fundHouse: fund.fundHouse,
        category: fund.category,
      }));

    return NextResponse.json(
      { funds },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { funds: [], error: "Unable to fetch mutual fund data right now." },
      { status: 502 },
    );
  }
}
