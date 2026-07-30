"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

const tickerSymbols = [
  { proName: "NSE:NIFTY", title: "NIFTY 50" },
  { proName: "BSE:SENSEX", title: "SENSEX" },
  { proName: "NSE:BANKNIFTY", title: "NIFTY BANK" },
  { proName: "NSE:CNXIT", title: "NIFTY IT" },
  { proName: "NSE:CNXAUTO", title: "NIFTY AUTO" },
  { proName: "FX_IDC:USDINR", title: "USD / INR" },
];

export function MarketTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget h-full";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: tickerSymbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: theme,
      locale: "en",
    });
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [theme]);

  return (
    <section className="border-t border-border/60 bg-background" aria-label="Live market overview">
      <div
        ref={containerRef}
        className="tradingview-widget-container h-[46px] min-h-[46px] overflow-hidden"
      >
        <div className="flex h-full items-center justify-center px-4 text-xs text-muted-foreground">
          Loading live market data...
        </div>
      </div>
    </section>
  );
}
