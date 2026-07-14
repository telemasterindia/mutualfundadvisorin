import { NextResponse } from "next/server";
import { getDailyStockHistory, normalizeStockSymbol } from "@/lib/alpha-vantage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = normalizeStockSymbol(searchParams.get("symbol") ?? "");

  if (!symbol) {
    return NextResponse.json({ error: "Missing stock symbol." }, { status: 400 });
  }

  try {
    const history = await getDailyStockHistory(symbol);

    return NextResponse.json(
      {
        source: "Alpha Vantage",
        realtime: false,
        cachePolicy: "12h server cache",
        history,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "Alpha Vantage",
        realtime: false,
        symbol,
        error: error instanceof Error ? error.message : "Unable to fetch stock history.",
      },
      { status: 502 },
    );
  }
}
