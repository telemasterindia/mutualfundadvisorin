import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/market-news";

export async function GET() {
  const payload = await getMarketNews();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
