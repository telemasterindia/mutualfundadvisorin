import { NextResponse } from "next/server";

const indices = [
  { symbol: "%5ENSEI", name: "Nifty 50" },
  { symbol: "%5EBSESN", name: "Sensex" },
] as const;

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        regularMarketPreviousClose?: number;
        chartPreviousClose?: number;
        previousClose?: number;
      };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
  };
};

async function getQuote(symbol: string, name: string) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) throw new Error(`Unable to load ${name}`);

  const data = (await response.json()) as YahooChartResponse;
  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  const price = meta?.regularMarketPrice;
  const closes = result?.indicators?.quote?.[0]?.close?.filter(
    (close): close is number => typeof close === "number",
  );
  const latestDailyClose = closes?.at(-1);
  const priorDailyClose =
    typeof latestDailyClose === "number" &&
    typeof price === "number" &&
    Math.abs(latestDailyClose - price) < 0.01
      ? closes?.at(-2)
      : latestDailyClose;
  const previousClose =
    meta?.regularMarketPreviousClose ??
    meta?.previousClose ??
    priorDailyClose ??
    meta?.chartPreviousClose;

  if (typeof price !== "number" || typeof previousClose !== "number") {
    throw new Error(`Incomplete quote for ${name}`);
  }

  const change = price - previousClose;

  return {
    name,
    price,
    change,
    changePercent: (change / previousClose) * 100,
  };
}

export async function GET() {
  try {
    const quotes = await Promise.all(indices.map(({ symbol, name }) => getQuote(symbol, name)));

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
