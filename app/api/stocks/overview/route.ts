import { NextResponse } from "next/server";
import { getFreeStockOverview, normalizeStockSymbol } from "@/lib/free-stock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = normalizeStockSymbol(searchParams.get("symbol") ?? "");

  if (!symbol) {
    return NextResponse.json({ error: "Missing stock symbol." }, { status: 400 });
  }

  try {
    const overview = await getFreeStockOverview(symbol);

    return NextResponse.json(
      {
        source: "FinEdge API",
        realtime: false,
        cachePolicy: "5m server cache",
        overview,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "FinEdge API",
        realtime: false,
        symbol,
        error: error instanceof Error ? error.message : "Unable to fetch stock overview.",
      },
      { status: 502 },
    );
  }
}
