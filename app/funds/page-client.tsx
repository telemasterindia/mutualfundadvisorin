"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { funds } from "@/lib/mock-data";
import type { AmfiFund } from "@/lib/amfi";

const categories = [
  "All",
  "Large Cap",
  "Flexi Cap",
  "Mid Cap",
  "Small Cap",
  "Sectoral",
  "Debt",
  "Gold ETF",
];

const categoryDetails: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  All: {
    title: "All fresh schemes",
    description:
      "Shows every recent open-ended mutual fund from AMFI with a valid latest NAV. Use this when you want the widest search.",
    keywords: [],
  },
  "Large Cap": {
    title: "Large Cap funds",
    description:
      "Primarily invest in India’s largest listed companies. They are generally steadier than mid and small cap funds.",
    keywords: ["large cap"],
  },
  "Flexi Cap": {
    title: "Flexi Cap funds",
    description:
      "Can invest across large, mid, and small cap companies, giving the fund manager flexibility to shift allocation.",
    keywords: ["flexi cap", "flexicap"],
  },
  "Mid Cap": {
    title: "Mid Cap funds",
    description:
      "Focus on medium-sized companies with higher growth potential and higher risk than large cap funds.",
    keywords: ["mid cap", "midcap"],
  },
  "Small Cap": {
    title: "Small Cap funds",
    description:
      "Invest in smaller listed companies. These can grow faster, but NAVs can be more volatile.",
    keywords: ["small cap", "smallcap"],
  },
  Sectoral: {
    title: "Sectoral and thematic funds",
    description:
      "Concentrate on one sector or theme such as banking, pharma, technology, infrastructure, or consumption.",
    keywords: ["sectoral", "thematic", "banking", "pharma", "technology", "infrastructure"],
  },
  Debt: {
    title: "Debt funds",
    description:
      "Invest mainly in bonds, money market instruments, and fixed-income securities. Often used for stability or shorter goals.",
    keywords: ["debt", "liquid", "money market", "gilt", "bond", "overnight", "duration"],
  },
  "Gold ETF": {
    title: "Gold ETF and gold funds",
    description:
      "Track gold prices through ETFs or fund-of-fund structures. Useful as a small portfolio diversifier.",
    keywords: ["gold", "gold etf"],
  },
};

function FundExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [apiFunds, setApiFunds] = useState<AmfiFund[]>([]);
  const [loadingApiFunds, setLoadingApiFunds] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const hasLiveSearch = q.trim().length >= 2;

  const list = useMemo(
    () =>
      funds.filter((f) => {
        const matchQ = f.name.toLowerCase().includes(q.toLowerCase());
        const matchC = cat === "All" || f.category === cat;
        return matchQ && matchC;
      }),
    [q, cat],
  );
  const selectedCategory = categoryDetails[cat] ?? categoryDetails.All;
  const filteredApiFunds = useMemo(() => {
    if (cat === "All") {
      return apiFunds;
    }

    const keywords = selectedCategory.keywords;

    return apiFunds.filter((fund) => {
      const text = [fund.schemeName, fund.category, fund.fundHouse].filter(Boolean).join(" ");
      const normalizedText = text.toLowerCase();

      return keywords.some((keyword) => normalizedText.includes(keyword));
    });
  }, [apiFunds, cat, selectedCategory.keywords]);

  useEffect(() => {
    const query = q.trim();

    if (query.length < 2) {
      setApiFunds([]);
      setApiError(null);
      setLoadingApiFunds(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoadingApiFunds(true);
      setApiError(null);

      try {
        const response = await fetch(`/api/funds?q=${encodeURIComponent(query)}&limit=9`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const payload = (await response.json()) as {
          funds?: AmfiFund[];
          error?: string;
        };

        setApiFunds(payload.funds ?? []);
        setApiError(payload.error ?? null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setApiFunds([]);
          setApiError("Live mutual fund data is unavailable right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingApiFunds(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [q]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold">Explore mutual funds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search fresh open-ended mutual fund NAVs from the official AMFI download.
        </p>

        <div className="mt-6 glass rounded-2xl p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by fund name..."
              aria-label="Search mutual funds by name"
              className="pl-9 h-11"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  cat === c
                    ? "gradient-bg text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-border/70 pt-4">
            <div className="text-sm font-semibold">{selectedCategory.title}</div>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-muted-foreground">
              {selectedCategory.description}
            </p>
          </div>
        </div>

        {hasLiveSearch ? (
          <LiveSearchResults
            query={q}
            funds={filteredApiFunds}
            isLoading={loadingApiFunds}
            error={apiError}
            category={cat}
          />
        ) : (
          <CuratedFundGrid funds={list} />
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

function LiveSearchResults({
  query,
  funds,
  isLoading,
  error,
  category,
}: {
  query: string;
  funds: AmfiFund[];
  isLoading: boolean;
  error: string | null;
  category: string;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Fresh AMFI NAV results</h2>
          <p className="text-sm text-muted-foreground">
            Showing recent open-ended schemes with valid NAV values.
          </p>
        </div>
        {isLoading ? (
          <span className="text-xs font-medium text-muted-foreground">Searching...</span>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && funds.length === 0 ? (
        <div className="mt-4 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          No {category === "All" ? "" : `${category.toLowerCase()} `}schemes found for "
          {query.trim()}".
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {funds.map((fund) => (
          <div
            key={`${fund.schemeCode}-${fund.schemeName}`}
            className="glass rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {fund.fundHouse ?? "Open-ended scheme"}
            </div>
            <div className="mt-1 min-h-12 font-semibold">{fund.schemeName}</div>
            <div className="mt-3 rounded-lg bg-secondary/60 p-3">
              <div className="text-[10px] uppercase text-muted-foreground">Latest NAV</div>
              <div className="mt-1 text-xl font-semibold">Rs. {fund.navText}</div>
              <div className="mt-1 text-xs text-muted-foreground">As on {fund.date}</div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {fund.category ?? "Category unavailable"}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="flex-1 gradient-bg text-primary-foreground hover:opacity-90"
              >
                Invest
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Start SIP
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CuratedFundGrid({ funds: list }: { funds: typeof funds }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((f) => (
        <div
          key={f.id}
          className="glass rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-elegant"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {f.category}
              </div>
              <div className="mt-1 font-semibold">{f.name}</div>
            </div>
            <div className="flex items-center gap-0.5 text-warning">
              {[...Array(f.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Mini label="1Y" value={`${f.return1y}%`} positive />
            <Mini label="3Y" value={`${f.return3y}%`} positive />
            <Mini label="5Y" value={`${f.return5y}%`} positive />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>NAV Rs. {f.nav}</span>
            <span>AUM {f.aum}</span>
            <span
              className={`rounded-full px-2 py-0.5 ${
                f.risk === "Low"
                  ? "bg-success/10 text-success"
                  : f.risk === "Moderate"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {f.risk}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="flex-1 gradient-bg text-primary-foreground hover:opacity-90"
            >
              Invest
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Start SIP
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Mini({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold ${positive ? "text-success" : ""}`}>{value}</div>
    </div>
  );
}

export default function Page() {
  return <FundExplorer />;
}
