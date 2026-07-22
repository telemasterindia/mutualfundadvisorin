"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Info, TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import type { MfapiNavResponse } from "@/lib/mfapi";

const ranges = [
  { label: "1M", days: 31 },
  { label: "6M", days: 183 },
  { label: "1Y", days: 366 },
  { label: "3Y", days: 1096 },
  { label: "5Y", days: 1827 },
] as const;

function parseMfapiDate(value: string) {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatNav(value: number) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export default function FundDetailClient({ fund }: { fund: MfapiNavResponse }) {
  const [range, setRange] = useState<(typeof ranges)[number]>(ranges[2]);

  const allPoints = useMemo(
    () =>
      fund.data
        .map((point) => ({ date: parseMfapiDate(point.date), nav: Number(point.nav) }))
        .filter((point) => Number.isFinite(point.nav) && !Number.isNaN(point.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [fund.data],
  );

  const points = useMemo(() => {
    const latest = allPoints.at(-1)?.date;
    if (!latest) return [];
    const cutoff = new Date(latest);
    cutoff.setDate(cutoff.getDate() - range.days);
    return allPoints.filter((point) => point.date >= cutoff);
  }, [allPoints, range]);

  const latest = points.at(-1);
  const first = points[0];
  const absoluteReturn = latest && first ? (latest.nav / first.nav - 1) * 100 : null;
  const isPositive = (absoluteReturn ?? 0) >= 0;
  const consultationParams = new URLSearchParams({
    intent: "invest",
    fund: fund.meta.scheme_name,
    code: String(fund.meta.scheme_code),
    nav: latest ? String(latest.nav) : "",
    house: fund.meta.fund_house,
    category: fund.meta.scheme_category,
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/funds"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all funds
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {fund.meta.fund_house}
            </div>
            <h1 className="mt-2 max-w-4xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              {fund.meta.scheme_name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">
                {fund.meta.scheme_category}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">
                Code {fund.meta.scheme_code}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">{fund.meta.scheme_type}</span>
            </div>

            <div className="glass mt-8 rounded-3xl p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Latest NAV
                  </div>
                  <div className="mt-1 font-display text-3xl font-bold">
                    Rs. {latest ? formatNav(latest.nav) : "—"}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {latest
                      ? latest.date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Unavailable"}
                  </div>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                >
                  <div className="text-[10px] font-medium uppercase tracking-wider">
                    {range.label} absolute return
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xl font-bold">
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {absoluteReturn === null
                      ? "—"
                      : `${absoluteReturn >= 0 ? "+" : ""}${absoluteReturn.toFixed(2)}%`}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2" aria-label="NAV history range">
                {ranges.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setRange(item)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${range.label === item.label ? "gradient-bg text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 h-80 w-full" data-testid="nav-history-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={points.map((point) => ({
                      date: point.date.toLocaleDateString("en-IN", {
                        month: "short",
                        year: "2-digit",
                      }),
                      nav: point.nav,
                    }))}
                    margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      minTickGap={45}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={52}
                      tickFormatter={(value) => `Rs.${Number(value).toFixed(0)}`}
                    />
                    <Tooltip
                      formatter={(value) => [`Rs. ${formatNav(Number(value))}`, "NAV"]}
                      labelStyle={{ color: "var(--foreground)" }}
                      contentStyle={{
                        borderRadius: 12,
                        background: "var(--card)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="nav"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      fill="url(#navFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 flex gap-2 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" /> Returns are calculated from available
                NAV points and exclude investor-specific loads and taxes. Past performance does not
                guarantee future results.
              </p>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold">Interested in this fund?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Discuss suitability, risk and the investment process before making a decision.
            </p>
            <Button asChild className="mt-6 w-full rounded-full">
              <Link href={`/book-consultation?${consultationParams}`}>Discuss this fund</Link>
            </Button>
            <Button asChild variant="outline" className="mt-3 w-full rounded-full">
              <Link href="/calculator">Plan with calculator</Link>
            </Button>
            <div className="mt-6 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
              Historical data supplied by MFapi.in. Latest official scheme data may also be checked
              with AMFI.
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
