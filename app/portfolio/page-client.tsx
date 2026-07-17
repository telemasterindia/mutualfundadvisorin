"use client";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { RequireAuth } from "@/components/require-auth";
import { TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { fallbackDashboardData, loadAdvisorDashboardData } from "@/lib/advisor-data";

type PortfolioHolding = (typeof fallbackDashboardData.holdings)[number];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Portfolio() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(fallbackDashboardData.holdings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setHoldings(fallbackDashboardData.holdings);
      return;
    }

    let cancelled = false;

    async function loadHoldings() {
      setLoading(true);
      try {
        const data = await loadAdvisorDashboardData(supabase, user!.id);
        if (!cancelled) setHoldings(data.holdings);
      } catch {
        if (!cancelled) setHoldings(fallbackDashboardData.holdings);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHoldings();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.current, 0);
  const gain = totalCurrent - totalInvested;
  const gainPct = ((gain / totalInvested) * 100).toFixed(2);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold">Holdings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Syncing Supabase holdings..." : `${holdings.length} funds across categories`}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Invested" value={inr(totalInvested)} />
          <SummaryCard label="Current value" value={inr(totalCurrent)} />
          <SummaryCard label="Total gain" value={`${inr(gain)} (+${gainPct}%)`} tone="success" />
        </div>

        <div className="mt-6 glass rounded-3xl p-2 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 text-left">Fund</th>
                  <th className="px-3 py-3 text-left">Category</th>
                  <th className="px-3 py-3 text-right">Invested</th>
                  <th className="px-3 py-3 text-right">Current</th>
                  <th className="px-3 py-3 text-right">P/L</th>
                  <th className="px-3 py-3 text-right">1Y</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {holdings.map((h) => {
                  const pl = h.current - h.invested;
                  const plPct = ((pl / h.invested) * 100).toFixed(1);
                  const positive = pl > 0;
                  return (
                    <tr key={`${h.fund}-${h.amc}`} className="hover:bg-secondary/40">
                      <td className="px-3 py-4 font-medium">{h.fund}</td>
                      <td className="px-3 py-4 text-muted-foreground">{h.category}</td>
                      <td className="px-3 py-4 text-right">{inr(h.invested)}</td>
                      <td className="px-3 py-4 text-right font-semibold">{inr(h.current)}</td>
                      <td
                        className={`px-3 py-4 text-right ${positive ? "text-success" : "text-destructive"}`}
                      >
                        <div className="inline-flex items-center gap-1">
                          {positive ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {inr(Math.abs(pl))} ({positive ? "+" : "-"}
                          {Math.abs(Number(plPct))}%)
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right text-success">+{h.return1y}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-2 font-display text-2xl font-bold ${tone === "success" ? "text-success" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAuth>
      <Portfolio />
    </RequireAuth>
  );
}
