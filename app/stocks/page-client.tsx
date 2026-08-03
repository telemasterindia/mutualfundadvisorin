"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StockResearch } from "@/components/stock-research";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Overview = {
  symbol: string;
  name: string | null;
  exchange: string | null;
  currency: string | null;
  price: number;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  marketCap: number | null;
  marketTime: string | null;
};

type Point = { date: string; close: number };
type StockSearchResult = {
  symbol: string;
  name: string;
  exchange: string | null;
  type: string;
};
type MarketQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
};
type MarketNewsItem = {
  title: string;
  source: string;
  time: string;
  url?: string;
};
const ranges = ["1mo", "3mo", "6mo", "1y", "2y", "5y"];
const formatNumber = (value: number | null, digits = 2) =>
  value === null
    ? "—"
    : new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
const compact = (value: number | null) =>
  value === null
    ? "—"
    : new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(
        value,
      );

export default function StocksPage() {
  const [input, setInput] = useState("RELIANCE.NS");
  const [symbol, setSymbol] = useState("RELIANCE.NS");
  const [range, setRange] = useState("1y");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [marketQuotes, setMarketQuotes] = useState<MarketQuote[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [quoteResponse, historyResponse] = await Promise.all([
          fetch(`/api/stocks/overview?symbol=${encodeURIComponent(symbol)}`, {
            signal: controller.signal,
          }),
          fetch(`/api/stocks/history?symbol=${encodeURIComponent(symbol)}&range=${range}`, {
            signal: controller.signal,
          }),
        ]);
        const quote = await quoteResponse.json();
        const history = await historyResponse.json();
        if (!quoteResponse.ok) throw new Error(quote.error ?? "Unable to load this stock.");
        if (!historyResponse.ok) throw new Error(history.error ?? "Unable to load price history.");
        setOverview(quote.overview);
        setPoints(history.history.points);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setOverview(null);
          setPoints([]);
          setError(
            requestError instanceof Error ? requestError.message : "Stock data is unavailable.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [symbol, range]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([
      fetch("/api/stocks/market", { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error("Market snapshot unavailable");
        return response.json() as Promise<{ quotes?: MarketQuote[] }>;
      }),
      fetch("/api/market-news", { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error("Market news unavailable");
        return response.json() as Promise<{ news?: MarketNewsItem[] }>;
      }),
    ]).then(([quotesResult, newsResult]) => {
      if (quotesResult.status === "fulfilled") {
        setMarketQuotes(quotesResult.value.quotes ?? []);
      }
      if (newsResult.status === "fulfilled") {
        setMarketNews(newsResult.value.news ?? []);
      }
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const query = input.trim();
    if (query.length < 2 || query.toUpperCase() === symbol.toUpperCase()) {
      setSearchResults([]);
      setSuggestionLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as { results?: StockSearchResult[] };
        if (response.ok) setSearchResults(payload.results ?? []);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setSuggestionLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [input, symbol]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;

    setSearching(true);
    setError(null);
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      const payload = (await response.json()) as {
        results?: StockSearchResult[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Unable to search stocks.");

      const results = payload.results ?? [];
      const exact = results.find((result) => result.symbol.toUpperCase() === query.toUpperCase());
      if (exact) {
        selectStock(exact);
      } else if (results.length === 1) {
        selectStock(results[0]);
      } else {
        setSearchResults(results);
        setOverview(null);
        setPoints([]);
        if (!results.length) setError(`No stocks found for “${query}”. Try an exact symbol.`);
      }
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Unable to search stocks.");
    } finally {
      setSearching(false);
    }
  }

  function selectStock(stock: StockSearchResult) {
    setInput(stock.symbol);
    setSearchResults([]);
    setSymbol(stock.symbol);
  }

  const positive = (overview?.change ?? 0) >= 0;
  const currency = overview?.currency ?? "INR";
  const equityQuotes = marketQuotes.filter((quote) => !quote.symbol.startsWith("^"));
  const advancing = equityQuotes.filter((quote) => quote.change >= 0).length;
  const declining = equityQuotes.length - advancing;
  const breadthPercent = equityQuotes.length ? (advancing / equityQuotes.length) * 100 : 50;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="border-b bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                India markets
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Markets today
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Indices, market movers, breaking updates and stock research in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Market status
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Delayed market data
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              ["Overview", "#overview"],
              ["Indices", "#indices"],
              ["Market Movers", "#movers"],
              ["Market News", "#news"],
              ["Stock Search", "#stock-search"],
              ["Fundamentals", "#fundamentals"],
            ].map(([item, href], index) => (
              <a
                key={item}
                href={href}
                className={`shrink-0 rounded-md px-3 py-1.5 font-medium ${
                  index === 0
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {marketQuotes.length > 0 && (
          <section id="indices" className="mb-5 scroll-mt-28">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Live market pulse
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">Benchmark indices</h2>
              </div>
              <div className="text-xs text-muted-foreground">Refreshes every 5 minutes</div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {marketQuotes
                .filter((quote) => quote.symbol.startsWith("^"))
                .map((quote) => {
                  const gain = quote.change >= 0;
                  return (
                    <div
                      key={quote.symbol}
                      className="relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm"
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-1 ${gain ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{quote.name}</div>
                        <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold">
                          {quote.symbol.replace("^", "")}
                        </span>
                      </div>
                      <div className="mt-2 text-2xl font-bold num">{formatNumber(quote.price)}</div>
                      <div
                        className={`mt-1 text-sm font-semibold num ${gain ? "text-emerald-600" : "text-rose-500"}`}
                      >
                        {gain ? "+" : ""}
                        {formatNumber(quote.change)} ({gain ? "+" : ""}
                        {formatNumber(quote.changePercent)}%)
                      </div>
                    </div>
                  );
                })}
              <div className="rounded-xl border bg-card p-4 shadow-sm sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Market breadth</div>
                    <div className="text-xs text-muted-foreground">Popular NSE stocks</div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="font-semibold text-emerald-600">{advancing} advancing</span>
                    <span className="mx-1 text-muted-foreground">/</span>
                    <span className="font-semibold text-rose-500">{declining} declining</span>
                  </div>
                </div>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-rose-400">
                  <div className="bg-emerald-500" style={{ width: `${breadthPercent}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
                  {marketQuotes
                    .filter((quote) => !quote.symbol.startsWith("^"))
                    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                    .slice(0, 6)
                    .map((quote) => (
                      <button
                        key={quote.symbol}
                        type="button"
                        onClick={() =>
                          selectStock({
                            symbol: quote.symbol,
                            name: quote.name,
                            exchange: "NSE",
                            type: "Equity",
                          })
                        }
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"
                      >
                        <span className="truncate text-xs font-semibold">
                          {quote.symbol.replace(".NS", "")}
                        </span>
                        <span
                          className={`text-xs font-semibold num ${quote.change >= 0 ? "text-emerald-600" : "text-rose-500"}`}
                        >
                          {quote.change >= 0 ? "+" : ""}
                          {formatNumber(quote.changePercent)}%
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {(marketQuotes.length > 0 || marketNews.length > 0) && (
          <section id="overview" className="mb-5 grid scroll-mt-28 gap-3 lg:grid-cols-3">
            <div
              id="movers"
              className="scroll-mt-28 rounded-xl border bg-card p-4 shadow-sm lg:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                    Share market
                  </div>
                  <h2 className="mt-1 text-xl font-bold">Market movers</h2>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  NSE watchlist
                </span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Top gainers",
                    quotes: marketQuotes
                      .filter((quote) => !quote.symbol.startsWith("^") && quote.change >= 0)
                      .sort((a, b) => b.changePercent - a.changePercent)
                      .slice(0, 5),
                    color: "text-emerald-600",
                  },
                  {
                    title: "Top losers",
                    quotes: marketQuotes
                      .filter((quote) => !quote.symbol.startsWith("^") && quote.change < 0)
                      .sort((a, b) => a.changePercent - b.changePercent)
                      .slice(0, 5),
                    color: "text-rose-500",
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <div className="border-b pb-2 text-sm font-semibold">{group.title}</div>
                    <div className="divide-y">
                      {group.quotes.length ? (
                        group.quotes.map((quote) => (
                          <button
                            key={quote.symbol}
                            type="button"
                            onClick={() =>
                              selectStock({
                                symbol: quote.symbol,
                                name: quote.name,
                                exchange: "NSE",
                                type: "Equity",
                              })
                            }
                            className="flex w-full items-center justify-between gap-3 py-3 text-left hover:text-primary"
                          >
                            <span>
                              <span className="block text-sm font-semibold">
                                {quote.symbol.replace(".NS", "")}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ₹{formatNumber(quote.price)}
                              </span>
                            </span>
                            <span className={`text-sm font-semibold num ${group.color}`}>
                              {quote.change >= 0 ? "+" : ""}
                              {formatNumber(quote.changePercent)}%
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="py-6 text-sm text-muted-foreground">
                          No stocks in this group.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside id="news" className="scroll-mt-28 rounded-xl border bg-card p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Latest updates
              </div>
              <h2 className="mt-1 text-xl font-bold">Market news &amp; filings</h2>
              <div className="mt-4 divide-y">
                {marketNews.slice(0, 6).map((item) => (
                  <a
                    key={`${item.title}-${item.time}`}
                    href={item.url ?? "#"}
                    target={item.url ? "_blank" : undefined}
                    rel={item.url ? "noreferrer" : undefined}
                    className="block py-3 hover:text-primary"
                  >
                    <div className="text-sm font-semibold leading-5">{item.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.source} · {item.time}
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </section>
        )}
        <div
          id="stock-search"
          className="grid scroll-mt-28 gap-3 rounded-xl border bg-card p-4 shadow-sm lg:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Stock research
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold">Find any listed company</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by company name or symbol. NSE symbols end with .NS.
            </p>
          </div>
          <div className="border-t pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick access
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                ["Reliance", "RELIANCE.NS"],
                ["TCS", "TCS.NS"],
                ["HDFC Bank", "HDFCBANK.NS"],
                ["Infosys", "INFY.NS"],
                ["ICICI Bank", "ICICIBANK.NS"],
                ["SBI", "SBIN.NS"],
              ].map(([name, stockSymbol]) => (
                <button
                  key={stockSymbol}
                  type="button"
                  onClick={() =>
                    selectStock({ symbol: stockSymbol, name, exchange: "NSE", type: "Equity" })
                  }
                  className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="relative mt-3 flex max-w-3xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-9 pr-10"
              aria-label="Search company or stock symbol"
              aria-autocomplete="list"
              aria-expanded={searchResults.length > 0}
              aria-controls="stock-suggestions"
              autoComplete="off"
              placeholder="Search company or symbol, e.g. Tata, Reliance, TCS"
            />
            {suggestionLoading && (
              <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted border-t-primary" />
            )}
          </div>
          <Button type="submit" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <section
            id="stock-suggestions"
            role="listbox"
            aria-label="Stock suggestions"
            className="relative z-20 mt-2 max-w-3xl rounded-xl border bg-card p-2 shadow-xl"
          >
            <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested stocks
            </div>
            <div className="grid gap-1">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => selectStock(stock)}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{stock.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stock.exchange ?? stock.type}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {stock.symbol}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {loading && <div className="mt-4 h-80 animate-pulse rounded-xl bg-muted" />}

        {!loading && overview && (
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <section className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {overview.exchange} · {overview.symbol}
                  </div>
                  <h2 className="mt-1 text-xl font-bold">{overview.name ?? overview.symbol}</h2>
                  <div className="mt-3 text-3xl font-bold num">
                    {formatNumber(overview.price)}{" "}
                    <span className="text-sm font-medium text-muted-foreground">{currency}</span>
                  </div>
                  <div
                    className={`mt-1 flex items-center gap-1 text-sm font-semibold ${positive ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {positive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {positive ? "+" : ""}
                    {formatNumber(overview.change)} ({positive ? "+" : ""}
                    {formatNumber(overview.changePercent)}%)
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ranges.map((item) => (
                    <button
                      key={item}
                      onClick={() => setRange(item)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${range === item ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={points}>
                    <defs>
                      <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      minTickGap={45}
                      fontSize={11}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                      fontSize={11}
                    />
                    <Tooltip
                      formatter={(value) => [`${formatNumber(Number(value))} ${currency}`, "Close"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#stockFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <aside className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold">Market snapshot</h3>
              <dl className="mt-5 divide-y">
                {[
                  ["Previous close", formatNumber(overview.previousClose)],
                  [
                    "Day range",
                    `${formatNumber(overview.dayLow)} – ${formatNumber(overview.dayHigh)}`,
                  ],
                  [
                    "52-week range",
                    `${formatNumber(overview.fiftyTwoWeekLow)} – ${formatNumber(overview.fiftyTwoWeekHigh)}`,
                  ],
                  ["Volume", compact(overview.volume)],
                  ["Market cap", compact(overview.marketCap)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium num">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                Powered by FinEdge API with a fallback market-data source. Data may be delayed and
                is provided for education only; it is not investment advice.
              </p>
            </aside>
          </div>
        )}
        {!loading && overview && <StockResearch symbol={symbol} />}
      </main>
      <SiteFooter />
    </div>
  );
}
