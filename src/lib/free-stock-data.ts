const BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const CACHE_SECONDS = 5 * 60;
const SEARCH_URL = "https://query1.finance.yahoo.com/v1/finance/search";

type ChartResult = {
  meta?: {
    symbol?: string;
    shortName?: string;
    longName?: string;
    exchangeName?: string;
    fullExchangeName?: string;
    currency?: string;
    regularMarketPrice?: number;
    regularMarketPreviousClose?: number;
    previousClose?: number;
    chartPreviousClose?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
    regularMarketVolume?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    marketCap?: number;
    regularMarketTime?: number;
    timezone?: string;
  };
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: Array<number | null>;
      high?: Array<number | null>;
      low?: Array<number | null>;
      close?: Array<number | null>;
      volume?: Array<number | null>;
    }>;
  };
};

type ChartPayload = {
  chart?: {
    result?: ChartResult[];
    error?: { description?: string } | null;
  };
};

export function normalizeStockSymbol(value: string) {
  return value.trim().toUpperCase();
}

type SearchPayload = {
  quotes?: Array<{
    symbol?: string;
    shortname?: string;
    longname?: string;
    exchange?: string;
    exchDisp?: string;
    quoteType?: string;
    typeDisp?: string;
  }>;
};

const popularIndianStocks = [
  { symbol: "TATAMOTORS.NS", name: "Tata Motors Limited", exchange: "NSE", type: "Equity" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel Limited", exchange: "NSE", type: "Equity" },
  { symbol: "TATAPOWER.NS", name: "Tata Power Company Limited", exchange: "NSE", type: "Equity" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products Limited", exchange: "NSE", type: "Equity" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Limited", exchange: "NSE", type: "Equity" },
  { symbol: "TITAN.NS", name: "Titan Company Limited (Tata Group)", exchange: "NSE", type: "Equity" },
  { symbol: "TRENT.NS", name: "Trent Limited (Tata Group)", exchange: "NSE", type: "Equity" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries Limited", exchange: "NSE", type: "Equity" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", exchange: "NSE", type: "Equity" },
  { symbol: "INFY.NS", name: "Infosys Limited", exchange: "NSE", type: "Equity" },
] as const;

export async function searchFreeStocks(query: string) {
  const term = query.trim();
  if (term.length < 2 || term.length > 80) return [];

  const params = new URLSearchParams({
    q: term,
    quotesCount: "12",
    newsCount: "0",
    enableFuzzyQuery: "true",
  });
  const response = await fetch(`${SEARCH_URL}?${params}`, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 60 * 60 },
  });
  if (!response.ok) throw new Error("Stock search is temporarily unavailable.");

  const payload = (await response.json()) as SearchPayload;
  const remoteResults = (payload.quotes ?? [])
    .filter((quote) => quote.symbol && ["EQUITY", "ETF"].includes(quote.quoteType ?? ""))
    .map((quote) => ({
      symbol: quote.symbol!,
      name: quote.longname ?? quote.shortname ?? quote.symbol!,
      exchange: quote.exchDisp ?? quote.exchange ?? null,
      type: quote.typeDisp ?? quote.quoteType ?? "Stock",
    }))
    .sort((a, b) => {
      const indianA = /\.(NS|BO)$/.test(a.symbol) ? 0 : 1;
      const indianB = /\.(NS|BO)$/.test(b.symbol) ? 0 : 1;
      return indianA - indianB;
    });
  const normalizedTerm = term.toUpperCase();
  const localMatches = popularIndianStocks.filter(
    (stock) =>
      stock.symbol.includes(normalizedTerm) || stock.name.toUpperCase().includes(normalizedTerm),
  );

  return [...localMatches, ...remoteResults]
    .filter(
      (stock, index, stocks) =>
        stocks.findIndex((candidate) => candidate.symbol === stock.symbol) === index,
    )
    .slice(0, 8);
}

async function fetchChart(symbol: string, range: string) {
  const normalized = normalizeStockSymbol(symbol);
  if (!/^[A-Z0-9.^=-]{1,24}$/.test(normalized)) throw new Error("Enter a valid stock symbol.");

  const params = new URLSearchParams({ range, interval: "1d", events: "div,splits" });
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(normalized)}?${params}`, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    next: { revalidate: CACHE_SECONDS },
  });
  const payload = (await response.json().catch(() => ({}))) as ChartPayload;
  const result = payload.chart?.result?.[0];

  if (!response.ok || !result) {
    throw new Error(payload.chart?.error?.description ?? `No stock data found for ${normalized}.`);
  }
  return result;
}

export async function getFreeStockOverview(symbol: string) {
  const result = await fetchChart(symbol, "5d");
  const meta = result.meta ?? {};
  const price = meta.regularMarketPrice;
  const previousClose =
    meta.regularMarketPreviousClose ?? meta.previousClose ?? meta.chartPreviousClose;

  if (typeof price !== "number") throw new Error(`No current price found for ${symbol}.`);
  const change = typeof previousClose === "number" ? price - previousClose : null;

  return {
    symbol: meta.symbol ?? normalizeStockSymbol(symbol),
    name: meta.longName ?? meta.shortName ?? null,
    exchange: meta.fullExchangeName ?? meta.exchangeName ?? null,
    currency: meta.currency ?? null,
    price,
    previousClose: previousClose ?? null,
    change,
    changePercent:
      change !== null && previousClose ? (change / previousClose) * 100 : null,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    volume: meta.regularMarketVolume ?? null,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
    marketCap: meta.marketCap ?? null,
    marketTime: meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : null,
  };
}

export async function getFreeStockHistory(symbol: string, requestedRange: string) {
  const allowed = new Set(["1mo", "3mo", "6mo", "1y", "2y", "5y"]);
  const range = allowed.has(requestedRange) ? requestedRange : "1y";
  const result = await fetchChart(symbol, range);
  const quote = result.indicators?.quote?.[0];

  const points = (result.timestamp ?? []).flatMap((timestamp, index) => {
    const close = quote?.close?.[index];
    if (typeof close !== "number") return [];
    return [{
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      open: quote?.open?.[index] ?? null,
      high: quote?.high?.[index] ?? null,
      low: quote?.low?.[index] ?? null,
      close,
      volume: quote?.volume?.[index] ?? null,
    }];
  });

  if (!points.length) throw new Error(`No price history found for ${symbol}.`);
  return {
    symbol: result.meta?.symbol ?? normalizeStockSymbol(symbol),
    currency: result.meta?.currency ?? null,
    timezone: result.meta?.timezone ?? null,
    range,
    points,
  };
}
