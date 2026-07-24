"use client";

import { FormEvent, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
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
const ranges = ["1mo", "3mo", "6mo", "1y", "2y", "5y"];
const formatNumber = (value: number | null, digits = 2) =>
  value === null ? "—" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
const compact = (value: number | null) =>
  value === null ? "—" : new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(value);

export default function StocksPage() {
  const [input, setInput] = useState("RELIANCE.NS");
  const [symbol, setSymbol] = useState("RELIANCE.NS");
  const [range, setRange] = useState("1y");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [quoteResponse, historyResponse] = await Promise.all([
          fetch(`/api/stocks/overview?symbol=${encodeURIComponent(symbol)}`, { signal: controller.signal }),
          fetch(`/api/stocks/history?symbol=${encodeURIComponent(symbol)}&range=${range}`, { signal: controller.signal }),
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
          setError(requestError instanceof Error ? requestError.message : "Stock data is unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [symbol, range]);

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
      const exact = results.find(
        (result) => result.symbol.toUpperCase() === query.toUpperCase(),
      );
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold text-primary">Free market data</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Research any stock</h1>
          <p className="mt-3 text-muted-foreground">
            Search symbols such as RELIANCE.NS, TCS.NS, AAPL or MSFT. Quotes may be delayed.
          </p>
        </div>

        <form onSubmit={submit} className="mt-7 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-9" aria-label="Stock symbol" />
          </div>
          <Button type="submit" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <section className="mt-6 max-w-3xl rounded-2xl border bg-card p-3 shadow-sm">
            <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Choose a stock
            </div>
            <div className="grid gap-1 sm:grid-cols-2">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => selectStock(stock)}
                  className="rounded-xl px-3 py-3 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="font-semibold">{stock.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stock.symbol} · {stock.exchange ?? stock.type}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {error && <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{error}</div>}
        {loading && <div className="mt-8 h-96 animate-pulse rounded-3xl bg-muted" />}

        {!loading && overview && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <section className="rounded-3xl border bg-card p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{overview.exchange} · {overview.symbol}</div>
                  <h2 className="mt-1 text-xl font-bold">{overview.name ?? overview.symbol}</h2>
                  <div className="mt-3 text-3xl font-bold num">{formatNumber(overview.price)} <span className="text-sm font-medium text-muted-foreground">{currency}</span></div>
                  <div className={`mt-1 flex items-center gap-1 text-sm font-semibold ${positive ? "text-emerald-600" : "text-rose-500"}`}>
                    {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {positive ? "+" : ""}{formatNumber(overview.change)} ({positive ? "+" : ""}{formatNumber(overview.changePercent)}%)
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ranges.map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${range === item ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{item.toUpperCase()}</button>)}
                </div>
              </div>
              <div className="mt-8 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={points}>
                    <defs><linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3}/><stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={45} fontSize={11} />
                    <YAxis domain={["auto", "auto"]} tickLine={false} axisLine={false} width={65} fontSize={11} />
                    <Tooltip formatter={(value) => [`${formatNumber(Number(value))} ${currency}`, "Close"]} />
                    <Area type="monotone" dataKey="close" stroke="var(--primary)" strokeWidth={2} fill="url(#stockFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <aside className="rounded-3xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Market snapshot</h3>
              <dl className="mt-5 divide-y">
                {[
                  ["Previous close", formatNumber(overview.previousClose)],
                  ["Day range", `${formatNumber(overview.dayLow)} – ${formatNumber(overview.dayHigh)}`],
                  ["52-week range", `${formatNumber(overview.fiftyTwoWeekLow)} – ${formatNumber(overview.fiftyTwoWeekHigh)}`],
                  ["Volume", compact(overview.volume)],
                  ["Market cap", compact(overview.marketCap)],
                ].map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium num">{value}</dd></div>)}
              </dl>
              <p className="mt-5 text-xs leading-5 text-muted-foreground">Powered by free Yahoo Finance market data. Data may be delayed and is provided for education only; it is not investment advice.</p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
