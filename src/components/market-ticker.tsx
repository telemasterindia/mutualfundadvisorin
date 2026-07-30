"use client";

import { useEffect, useState } from "react";

type IndexQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

const numberFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
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

export function MarketTicker() {
  const [quotes, setQuotes] = useState<IndexQuote[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuotes = async () => {
      try {
        const response = await fetch("/api/market-indices", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Market data request failed");

        const data = (await response.json()) as { quotes?: IndexQuote[] };
        if (!Array.isArray(data.quotes) || data.quotes.length === 0) {
          throw new Error("No market data returned");
        }

        setQuotes(data.quotes);
        setError(false);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(true);
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

      return (
        <div
          key={`${quote.symbol}-${copy}`}
          className="flex shrink-0 items-center gap-2 border-r border-border/60 px-4 py-2 text-sm sm:px-6"
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
            {positive ? "+" : ""}
            {numberFormatter.format(quote.change)} ({positive ? "+" : ""}
            {quote.changePercent.toFixed(2)}%)
          </span>
        </div>
      );
    });

  return (
    <section
      className="border-t border-border/60 bg-background"
      aria-label="Delayed market overview"
    >
      <div className="market-ticker min-h-[46px] overflow-hidden">
        {quotes.length > 0 ? (
          <div
            className="market-ticker-track flex w-max"
            style={{ animationDuration: `${Math.max(72, quotes.length * 10)}s` }}
          >
            <div className="flex shrink-0">{renderQuotes(1)}</div>
            <div className="flex shrink-0" aria-hidden="true">
              {renderQuotes(2)}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[46px] items-center justify-center">
            <span className="px-4 py-3 text-xs text-muted-foreground">
              {error
                ? "Live market data is temporarily unavailable"
                : "Loading live market data..."}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
