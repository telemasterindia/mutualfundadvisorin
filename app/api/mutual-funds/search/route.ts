import { NextResponse } from "next/server";
import { searchFundsWithLatestNav } from "@/lib/mfapi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (query.trim().length < 2) {
    return NextResponse.json({ funds: [] });
  }

  try {
    const funds = await searchFundsWithLatestNav(query, 9);

    return NextResponse.json(
      { funds },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
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
