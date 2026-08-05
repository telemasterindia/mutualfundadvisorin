import { NextResponse } from "next/server";
import { getIndianMarketSnapshot } from "@/lib/free-stock-data";

export async function GET() {
  try {
    const quotes = await getIndianMarketSnapshot();

    return NextResponse.json(
      {
        quotes,
        source: "FinEdge API",
        delayed: true,
        updatedAt: new Date().toISOString(),
        timeZone: "Asia/Kolkata",
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Market index request failed", error);
    return NextResponse.json(
      { error: "Market data is temporarily unavailable. Please try again later." },
      { status: 502 },
    );
  }
}
