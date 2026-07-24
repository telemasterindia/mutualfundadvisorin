import { NextResponse } from "next/server";
import { searchFreeStocks } from "@/lib/free-stock-data";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json({ error: "Enter at least two characters." }, { status: 400 });
  }

  try {
    const results = await searchFreeStocks(query);
    return NextResponse.json(
      { source: "Yahoo Finance", results },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to search stocks." },
      { status: 502 },
    );
  }
}
