import { NextResponse } from "next/server";
import { getIndianMarketSnapshot } from "@/lib/free-stock-data";

export async function GET() {
  try {
    const quotes = await getIndianMarketSnapshot();

    return NextResponse.json(
      { quotes, delayed: true },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load market indices" },
      { status: 502 },
    );
  }
}
