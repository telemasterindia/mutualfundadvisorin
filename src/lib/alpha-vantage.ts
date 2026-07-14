export const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

const DEFAULT_REVALIDATE_SECONDS = 12 * 60 * 60;

export type AlphaVantageDailySeries = {
  symbol: string;
  lastRefreshed: string | null;
  timezone: string | null;
  points: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
};

export type AlphaVantageCompanyOverview = {
  symbol: string;
  name: string | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  marketCapitalization: string | null;
  peRatio: string | null;
  dividendYield: string | null;
  eps: string | null;
  revenueTTM: string | null;
  profitMargin: string | null;
  description: string | null;
};

type AlphaVantageDailyResponse = {
  "Meta Data"?: {
    "2. Symbol"?: string;
    "3. Last Refreshed"?: string;
    "5. Time Zone"?: string;
  };
  "Time Series (Daily)"?: Record<
    string,
    {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    }
  >;
  "Error Message"?: string;
  Note?: string;
  Information?: string;
};

type AlphaVantageOverviewResponse = {
  Symbol?: string;
  Name?: string;
  Exchange?: string;
  Sector?: string;
  Industry?: string;
  MarketCapitalization?: string;
  PERatio?: string;
  DividendYield?: string;
  EPS?: string;
  RevenueTTM?: string;
  ProfitMargin?: string;
  Description?: string;
  "Error Message"?: string;
  Note?: string;
  Information?: string;
};

export function normalizeStockSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

export function isSupportedStockSymbol(symbol: string) {
  return /^[A-Z0-9.-]{1,20}$/.test(symbol);
}

async function fetchAlphaVantage<T>(
  params: Record<string, string>,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ALPHA_VANTAGE_API_KEY.");
  }

  const searchParams = new URLSearchParams({
    ...params,
    apikey: apiKey,
  });

  const response = await fetch(`${ALPHA_VANTAGE_BASE_URL}?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`Alpha Vantage request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as T;
  const statusPayload = payload as {
    "Error Message"?: string;
    Note?: string;
    Information?: string;
  };
  const message = statusPayload["Error Message"] ?? statusPayload.Note ?? statusPayload.Information;

  if (message) {
    throw new Error(message);
  }

  return payload;
}

export async function getDailyStockHistory(symbol: string) {
  const normalizedSymbol = normalizeStockSymbol(symbol);

  if (!isSupportedStockSymbol(normalizedSymbol)) {
    throw new Error("Unsupported stock symbol.");
  }

  const payload = await fetchAlphaVantage<AlphaVantageDailyResponse>({
    function: "TIME_SERIES_DAILY",
    symbol: normalizedSymbol,
    outputsize: "compact",
  });

  const series = payload["Time Series (Daily)"];

  if (!series) {
    throw new Error("No daily stock history returned.");
  }

  return {
    symbol: payload["Meta Data"]?.["2. Symbol"] ?? normalizedSymbol,
    lastRefreshed: payload["Meta Data"]?.["3. Last Refreshed"] ?? null,
    timezone: payload["Meta Data"]?.["5. Time Zone"] ?? null,
    points: Object.entries(series).map(([date, values]) => ({
      date,
      open: Number(values["1. open"]),
      high: Number(values["2. high"]),
      low: Number(values["3. low"]),
      close: Number(values["4. close"]),
      volume: Number(values["5. volume"]),
    })),
  } satisfies AlphaVantageDailySeries;
}

export async function getCompanyOverview(symbol: string) {
  const normalizedSymbol = normalizeStockSymbol(symbol);

  if (!isSupportedStockSymbol(normalizedSymbol)) {
    throw new Error("Unsupported stock symbol.");
  }

  const payload = await fetchAlphaVantage<AlphaVantageOverviewResponse>({
    function: "OVERVIEW",
    symbol: normalizedSymbol,
  });

  if (!payload.Symbol) {
    throw new Error("No company overview returned.");
  }

  return {
    symbol: payload.Symbol,
    name: payload.Name ?? null,
    exchange: payload.Exchange ?? null,
    sector: payload.Sector ?? null,
    industry: payload.Industry ?? null,
    marketCapitalization: payload.MarketCapitalization ?? null,
    peRatio: payload.PERatio ?? null,
    dividendYield: payload.DividendYield ?? null,
    eps: payload.EPS ?? null,
    revenueTTM: payload.RevenueTTM ?? null,
    profitMargin: payload.ProfitMargin ?? null,
    description: payload.Description ?? null,
  } satisfies AlphaVantageCompanyOverview;
}
