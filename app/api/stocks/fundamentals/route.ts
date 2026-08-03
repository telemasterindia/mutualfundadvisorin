import { NextResponse } from "next/server";
import { getStockResearch, normalizeStockSymbol } from "@/lib/free-stock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = normalizeStockSymbol(searchParams.get("symbol") ?? "");

  if (!symbol) {
    return NextResponse.json({ error: "Missing stock symbol." }, { status: 400 });
  }

  try {
    const research = await getStockResearch(symbol);
    return NextResponse.json(
      {
        source: "FinEdge API",
        delayed: true,
        research,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "FinEdge API",
        symbol,
        error: error instanceof Error ? error.message : "Unable to fetch company fundamentals.",
      },
      { status: 502 },
    );
  }
}
