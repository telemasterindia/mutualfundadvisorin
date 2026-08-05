import { NextResponse } from "next/server";
import { searchFreeStocks } from "@/lib/free-stock-data";

const requestLog = new Map<string, { count: number; resetAt: number }>();

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 40 || !/^[a-z0-9.&\-\s]+$/i.test(query)) {
    return NextResponse.json(
      { error: "Enter 2–40 letters, numbers, spaces or standard symbol characters." },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwardedFor || "anonymous";
  const now = Date.now();
  const current = requestLog.get(clientKey);
  if (!current || current.resetAt <= now) {
    requestLog.set(clientKey, { count: 1, resetAt: now + 60_000 });
  } else if (current.count >= 30) {
    return NextResponse.json(
      { error: "Too many searches. Please try again shortly." },
      { status: 429 },
    );
  } else {
    current.count += 1;
  }

  try {
    const results = await searchFreeStocks(query);
    return NextResponse.json(
      { source: "FinEdge API", results },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    console.error("Stock search request failed", error);
    return NextResponse.json(
      { error: "Stock search is temporarily unavailable." },
      { status: 502 },
    );
  }
}
