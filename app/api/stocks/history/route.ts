import { NextResponse } from "next/server";
import { getFreeStockHistory, normalizeStockSymbol } from "@/lib/free-stock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = normalizeStockSymbol(searchParams.get("symbol") ?? "");
  const range = searchParams.get("range") ?? "1y";

  if (!symbol) {
    return NextResponse.json({ error: "Missing stock symbol." }, { status: 400 });
  }

  try {
    const history = await getFreeStockHistory(symbol, range);

    return NextResponse.json(
      {
        source: "FinEdge API",
        realtime: false,
        cachePolicy: "5m server cache",
        history,
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
        error: error instanceof Error ? error.message : "Unable to fetch stock history.",
      },
      { status: 502 },
    );
  }
}
