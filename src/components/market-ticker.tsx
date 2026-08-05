"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type IndexQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

type MarketPayload = {
  quotes?: IndexQuote[];
  source?: string;
  updatedAt?: string;
};

const numberFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
  timeZoneName: "short",
});

const indexBadges: Record<string, string> = {
  NIF50: "N50",
  SNSXSENSEX: "BSE",
  NIFBAN: "BNK",
  NIFNEX50: "NX50",
  NIFMID100: "MID",
  NIFIT: "IT",
  NIFAUT: "AUTO",
  NIFMET: "MET",
};

export function MarketTicker({ showOverviewLink = true }: { showOverviewLink?: boolean }) {
  const [quotes, setQuotes] = useState<IndexQuote[]>([]);
  const [source, setSource] = useState("FinEdge API");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [stale, setStale] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuotes = async () => {
      try {
        const response = await fetch("/api/market-indices", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Market data request failed");

        const data = (await response.json()) as MarketPayload;
        if (!Array.isArray(data.quotes) || data.quotes.length === 0) {
          throw new Error("No market data returned");
        }

        setQuotes(data.quotes);
        setSource(data.source ?? "FinEdge API");
        setUpdatedAt(data.updatedAt ?? new Date().toISOString());
        setError(false);
        setStale(false);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setQuotes((current) => {
          if (current.length > 0) setStale(true);
          else setError(true);
          return current;
        });
      }
    };

    void loadQuotes();
    const refreshId = window.setInterval(loadQuotes, 5 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(refreshId);
    };
  }, []);

  const renderQuotes = (copy: number) =>
    quotes.map((quote) => {
      const positive = quote.change >= 0;
      const direction = positive ? "up" : "down";

      return (
        <div
          key={`${quote.symbol}-${copy}`}
          className="flex shrink-0 snap-start items-center gap-2 border-r border-border/60 px-4 py-2 text-sm sm:px-6"
          aria-label={`${quote.name}, ${numberFormatter.format(quote.price)}, ${direction} ${numberFormatter.format(Math.abs(quote.change))} points, ${Math.abs(quote.changePercent).toFixed(2)} percent, delayed data`}
        >
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-primary/10 px-1 text-[9px] font-bold text-primary">
            {indexBadges[quote.symbol] ?? quote.symbol.slice(0, 4)}
          </span>
          <span className="whitespace-nowrap font-semibold text-foreground">{quote.name}</span>
          <span className="num whitespace-nowrap text-foreground">
            {numberFormatter.format(quote.price)}
          </span>
          <span
            className={`num whitespace-nowrap ${positive ? "text-emerald-600" : "text-rose-500"}`}
          >
            {positive ? "+" : "−"}
            {numberFormatter.format(Math.abs(quote.change))} ({positive ? "+" : "−"}
            {Math.abs(quote.changePercent).toFixed(2)}%)
          </span>
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Delayed
          </span>
        </div>
      );
    });

  return (
    <section
      className="border-y border-border/60 bg-background"
      aria-label="Delayed market overview"
    >
      <div className="mx-auto flex min-h-[46px] max-w-[1600px] items-stretch">
        <div className="market-ticker min-w-0 flex-1 overflow-x-auto scroll-smooth sm:overflow-hidden">
          {quotes.length > 0 ? (
            <div
              className={`market-ticker-track flex w-max ${paused ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: `${Math.max(72, quotes.length * 10)}s` }}
            >
              <div className="flex shrink-0">{renderQuotes(1)}</div>
              <div className="hidden shrink-0 sm:flex" aria-hidden="true">
                {renderQuotes(2)}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[46px] items-center justify-center">
              <span className="px-4 py-3 text-xs text-muted-foreground">
                {error
                  ? "Market data is temporarily unavailable. Please try again later."
                  : "Loading latest available market data…"}
              </span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="m-1 h-9 w-9 shrink-0 rounded-full"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play market ticker" : "Pause market ticker"}
          aria-pressed={paused}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] leading-5 text-muted-foreground sm:px-6 lg:px-8">
        <p>
          Market data may be delayed. Information is for general educational purposes—not investment
          advice or a buy/sell recommendation.
        </p>
        <p>
          Source: {source}
          {updatedAt
            ? ` · Last successful update: ${timeFormatter.format(new Date(updatedAt))}`
            : ""}
          {stale ? " · Showing latest successfully retrieved data" : ""}
        </p>
        {showOverviewLink && (
          <Link href="/stocks" className="font-semibold text-primary underline underline-offset-2">
            View market overview
          </Link>
        )}
      </div>
    </section>
  );
}
