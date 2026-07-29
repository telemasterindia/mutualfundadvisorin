const FINEDGE_BASE_URL = "https://data.finedgeapi.com/api/v1";
const DEFAULT_REVALIDATE_SECONDS = 5 * 60;

type FinEdgeHeaderResponse = {
  message?: string;
  error?: string;
};

type FinEdgeIndexQuote = {
  index_symbol?: string;
  index_name?: string;
  close_price?: number | string | null;
  points_change?: number | string | null;
  change_pct?: number | string | null;
};

type FinEdgeStockSymbolEntry = {
  symbol?: string;
  name?: string;
  nse_code?: string;
  bse_code?: string;
};

type FinEdgeQuoteEntry = {
  price?: number | string | null;
  current_price?: number | string | null;
  change?: string | number | null;
  prev_close?: number | string | null;
  previous_close?: number | string | null;
  high_price?: number | string | null;
  low_price?: number | string | null;
  high52?: number | string | null;
  low52?: number | string | null;
  market_cap?: number | string | null;
  volume?: number | string | null;
  tradetime?: string | null;
  exchange?: string | null;
  exchange_name?: string | null;
};

type FinEdgeDailyQuote = {
  quote_date?: string | null;
  open_price?: number | string | null;
  high_price?: number | string | null;
  low_price?: number | string | null;
  close_price?: number | string | null;
  volume?: number | string | null;
};

type FinEdgeHistoryPayload = {
  symbol?: string;
  price?: FinEdgeDailyQuote[];
};

type YahooChartResult = {
  meta?: {
    symbol?: string;
    shortName?: string;
    longName?: string;
    fullExchangeName?: string;
    exchangeName?: string;
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

function normalizeSymbolValue(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeStockSymbol(value: string) {
  return normalizeSymbolValue(value);
}

function normalizeForFinEdgeSymbol(symbol: string) {
  return normalizeSymbolValue(symbol)
    .replace(/\.NS$/i, "")
    .replace(/\.BO$/i, "")
    .replace(/\.BSE$/i, "");
}

function getFinEdgeApiToken() {
  const token = process.env.FINEDGE_API_KEY?.trim() || process.env.FINEDGE_TOKEN?.trim();
  if (!token) {
    throw new Error("FinEdge API key is not configured.");
  }
  return token;
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[%,$]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toPercent(value: number | string | null | undefined) {
  const parsed = toNumber(value);
  if (parsed === null) return null;
  return parsed;
}

function parseChange(value: number | string | null | undefined) {
  const parsed = toNumber(value);
  if (parsed === null) return null;
  return parsed;
}

function toYahooSymbol(symbol: string) {
  const normalized = normalizeStockSymbol(symbol);
  return /\.(NS|BO)$/i.test(normalized) ? normalized : `${normalized}.NS`;
}

async function fetchYahooChart(symbol: string, range: string) {
  const yahooSymbol = toYahooSymbol(symbol);
  const params = new URLSearchParams({ range, interval: "1d", events: "div,splits" });
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?${params}`,
    {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS },
    },
  );
  const payload = (await response.json().catch(() => ({}))) as {
    chart?: { result?: YahooChartResult[]; error?: { description?: string } | null };
  };
  const result = payload.chart?.result?.[0];
  if (!response.ok || !result) {
    throw new Error(payload.chart?.error?.description ?? `No stock data found for ${yahooSymbol}.`);
  }
  return result;
}

async function getYahooStockOverview(symbol: string) {
  const result = await fetchYahooChart(symbol, "5d");
  const meta = result.meta ?? {};
  const price = meta.regularMarketPrice;
  if (typeof price !== "number") throw new Error(`No current price found for ${symbol}.`);

  const previousClose =
    meta.regularMarketPreviousClose ?? meta.previousClose ?? meta.chartPreviousClose ?? null;
  const change = previousClose !== null ? price - previousClose : null;
  return {
    symbol: meta.symbol ?? toYahooSymbol(symbol),
    name: meta.longName ?? meta.shortName ?? null,
    exchange: meta.fullExchangeName ?? meta.exchangeName ?? null,
    currency: meta.currency ?? "INR",
    price,
    previousClose,
    change,
    changePercent: change !== null && previousClose ? (change / previousClose) * 100 : null,
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

async function getYahooStockHistory(symbol: string, range: string) {
  const result = await fetchYahooChart(symbol, range);
  const quote = result.indicators?.quote?.[0];
  const points = (result.timestamp ?? []).flatMap((timestamp, index) => {
    const close = quote?.close?.[index];
    if (typeof close !== "number") return [];
    return [
      {
        date: new Date(timestamp * 1000).toISOString().slice(0, 10),
        open: quote?.open?.[index] ?? null,
        high: quote?.high?.[index] ?? null,
        low: quote?.low?.[index] ?? null,
        close,
        volume: quote?.volume?.[index] ?? null,
      },
    ];
  });
  if (!points.length) throw new Error(`No price history found for ${symbol}.`);
  return {
    symbol: result.meta?.symbol ?? toYahooSymbol(symbol),
    currency: result.meta?.currency ?? "INR",
    timezone: result.meta?.timezone ?? "Asia/Kolkata",
    range,
    points,
  };
}

async function finedgeFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = DEFAULT_REVALIDATE_SECONDS,
) {
  const searchParams = new URLSearchParams({ token: getFinEdgeApiToken() });
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }

  const response = await fetch(`${FINEDGE_BASE_URL}${path}?${searchParams.toString()}`, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    next: { revalidate },
  });

  const responseText = await response.text();
  let payload: unknown = {};
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const detail =
      (payload as FinEdgeHeaderResponse | null)?.message ??
      (payload as FinEdgeHeaderResponse | null)?.error ??
      `FinEdge request failed with status ${response.status}.`;
    throw new Error(detail);
  }

  return payload as T;
}

export async function getIndianMarketSnapshot() {
  const payload = await finedgeFetch<FinEdgeIndexQuote[]>(
    "/index/market-price/daily-feed",
    {},
    5 * 60,
  );

  const preferredIndices = [
    "NIF50",
    "SNSXSENSEX",
    "NIFBAN",
    "NIFNEX50",
    "NIFMID100",
    "NIFIT",
    "NIFAUT",
    "NIFMET",
  ];
  const quotesBySymbol = new Map(
    (payload ?? []).map((quote) => [quote.index_symbol?.toUpperCase(), quote]),
  );

  return preferredIndices.flatMap((symbol) => {
    const quote = quotesBySymbol.get(symbol);
    if (!quote) return [];

    const name = quote.index_name ?? quote.index_symbol ?? "Index";
    const price = toNumber(quote.close_price);
    const change = parseChange(quote.points_change);
    const changePercent = toPercent(quote.change_pct);

    return [
      {
        symbol: quote.index_symbol ?? symbol,
        name,
        price: price ?? 0,
        change: change ?? 0,
        changePercent: changePercent ?? 0,
        currency: "INR",
      },
    ];
  });
}

export async function searchFreeStocks(query: string) {
  const term = query.trim();
  if (term.length < 2 || term.length > 80) return [];

  const normalizedTerm = term.toUpperCase();
  const payload = await finedgeFetch<FinEdgeStockSymbolEntry[]>("/stock-symbols", {}, 60 * 60);

  const remoteResults = (payload ?? [])
    .filter((entry) => {
      const candidates = [entry.symbol, entry.nse_code, entry.name].filter(Boolean) as string[];
      return candidates.some((candidate) => candidate.toUpperCase().includes(normalizedTerm));
    })
    .slice(0, 8)
    .map((entry) => ({
      symbol: entry.nse_code ?? entry.symbol ?? "",
      name: entry.name ?? entry.symbol ?? "",
      exchange: entry.bse_code ? "BSE/NSE" : "NSE",
      type: "Equity",
    }));

  return remoteResults.filter((stock, index, stocks) => {
    return stocks.findIndex((candidate) => candidate.symbol === stock.symbol) === index;
  });
}

export async function getFreeStockOverview(symbol: string) {
  const normalized = normalizeForFinEdgeSymbol(symbol);
  let payload: Record<string, FinEdgeQuoteEntry>;
  try {
    payload = await finedgeFetch<Record<string, FinEdgeQuoteEntry>>(
      "/quote",
      { symbol: normalized },
      5 * 60,
    );
  } catch {
    return getYahooStockOverview(symbol);
  }
  const quote = payload?.[normalized] ?? payload?.[normalized.toUpperCase()];

  if (!quote) {
    return getYahooStockOverview(symbol);
  }

  const price = toNumber(quote.current_price ?? quote.price);
  if (price === null) return getYahooStockOverview(symbol);

  const changePercent = toPercent(quote.change);
  const explicitPreviousClose = toNumber(quote.prev_close ?? quote.previous_close);
  const previousClose =
    explicitPreviousClose ??
    (changePercent !== null && changePercent !== -100 ? price / (1 + changePercent / 100) : null);
  const change = previousClose !== null ? price - previousClose : null;

  return {
    symbol: normalized,
    name: null,
    exchange: quote.exchange ?? quote.exchange_name ?? null,
    currency: "INR",
    price,
    previousClose: previousClose ?? null,
    change,
    changePercent: changePercent ?? null,
    dayHigh: toNumber(quote.high_price) ?? null,
    dayLow: toNumber(quote.low_price) ?? null,
    volume: toNumber(quote.volume) ?? null,
    fiftyTwoWeekHigh: toNumber(quote.high52) ?? null,
    fiftyTwoWeekLow: toNumber(quote.low52) ?? null,
    marketCap: toNumber(quote.market_cap) ?? null,
    marketTime: quote.tradetime ?? null,
  };
}

export async function getFreeStockHistory(symbol: string, requestedRange: string) {
  const normalized = normalizeForFinEdgeSymbol(symbol);
  const currentYear = new Date().getFullYear();
  const range = ["1mo", "3mo", "6mo", "1y", "2y", "5y"].includes(requestedRange)
    ? requestedRange
    : "1y";
  const from =
    range === "5y" ? currentYear - 5 : range === "2y" ? currentYear - 2 : currentYear - 1;

  let payload: FinEdgeHistoryPayload;
  try {
    payload = await finedgeFetch<FinEdgeHistoryPayload>(
      `/daily-quotes/${encodeURIComponent(normalized)}`,
      { from, to: currentYear },
      10 * 60,
    );
  } catch {
    return getYahooStockHistory(symbol, range);
  }

  const allPoints = (payload.price ?? [])
    .map((entry) => ({
      date: entry.quote_date ?? "",
      open: toNumber(entry.open_price),
      high: toNumber(entry.high_price),
      low: toNumber(entry.low_price),
      close: toNumber(entry.close_price),
      volume: toNumber(entry.volume),
    }))
    .filter((point) => point.close !== null && point.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const rangeDays: Record<string, number> = {
    "1mo": 31,
    "3mo": 93,
    "6mo": 186,
    "1y": 366,
    "2y": 732,
    "5y": 1830,
  };
  const latestDate = allPoints.at(-1)?.date;
  const cutoff = latestDate ? new Date(`${latestDate}T00:00:00Z`) : null;
  cutoff?.setUTCDate(cutoff.getUTCDate() - rangeDays[range]);
  const points = cutoff
    ? allPoints.filter((point) => new Date(`${point.date}T00:00:00Z`) >= cutoff)
    : allPoints;

  if (!points.length) throw new Error(`No price history found for ${symbol}.`);
  return {
    symbol: normalized,
    currency: "INR",
    timezone: "Asia/Kolkata",
    range,
    points,
  };
}
