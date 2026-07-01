"use client";
import { useMemo, useState } from "react";
import { Search, Star, Filter } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { funds } from "@/lib/mock-data";

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

function FundExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const list = useMemo(
    () =>
      funds.filter((f) => {
        const matchQ = f.name.toLowerCase().includes(q.toLowerCase());
        const matchC = cat === "All" || f.category === cat;
        return matchQ && matchC;
      }),
    [q, cat],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold">Explore mutual funds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated by our research team. Personalized for your goals. SEBI categorized.
        </p>

        <div className="mt-6 glass rounded-2xl p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by fund name…"
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
        </div>

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
                <span>NAV ₹{f.nav}</span>
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
      </div>
      <SiteFooter />
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
