"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  Bell,
  ChevronRight,
  IndianRupee,
  Activity,
  Plus,
  Pause,
  Play,
  Award,
  Target,
  Briefcase,
  GraduationCap,
  Home,
  Plane,
  Heart,
  Shield,
  Gauge,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { SiteHeader } from "@/components/site-chrome";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { ChartTooltip, inr, inrShort } from "@/components/chart-tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import {
  fallbackDashboardData,
  loadAdvisorDashboardData,
  type AdvisorDashboardData,
} from "@/lib/advisor-data";
import type { AmfiFund } from "@/lib/amfi";

const goalIcons = {
  retirement: Briefcase,
  education: GraduationCap,
  home: Home,
  travel: Plane,
  car: Plane,
} as const;

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdvisorDashboardData>(fallbackDashboardData);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [freshFunds, setFreshFunds] = useState<AmfiFund[]>([]);
  const [freshFundsLoading, setFreshFundsLoading] = useState(true);
  const [freshFundsError, setFreshFundsError] = useState<string | null>(null);

  const {
    investor,
    portfolioStats,
    portfolioGrowth,
    allocation,
    sips,
    transactions,
    holdings,
    goals,
    sectorAllocation,
  } = dashboardData;
  const topPerformers = [...holdings]
    .filter((h) => h.return1y > 0)
    .sort((a, b) => b.return1y - a.return1y)
    .slice(0, 4);
  const underPerformers = [...holdings].sort((a, b) => a.return1y - b.return1y).slice(0, 3);

  useEffect(() => {
    if (!user?.id) {
      setDashboardData(fallbackDashboardData);
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      setDashboardLoading(true);
      try {
        const data = await loadAdvisorDashboardData(supabase, user!.id);
        if (!cancelled) setDashboardData(data);
      } catch {
        if (!cancelled) setDashboardData(fallbackDashboardData);
      } finally {
        if (!cancelled) setDashboardLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFreshFunds() {
      try {
        const response = await fetch("/api/funds?limit=6", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("AMFI request failed");
        }

        const payload = (await response.json()) as {
          funds?: AmfiFund[];
          error?: string;
        };

        setFreshFunds(payload.funds ?? []);
        setFreshFundsError(payload.error ?? null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFreshFunds([]);
          setFreshFundsError("Fresh AMFI NAV data is unavailable right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setFreshFundsLoading(false);
        }
      }
    }

    loadFreshFunds();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-bg text-base font-bold text-primary-foreground shadow-glow">
              {investor.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Welcome back, {investor.name}</div>
              <h1 className="font-display text-xl font-bold sm:text-2xl">
                Your investor dashboard
              </h1>
              {dashboardLoading && (
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Syncing your Supabase portfolio data...
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Bell className="mr-1.5 h-3.5 w-3.5" /> Alerts
            </Button>
            <Link href="/funds">
              <Button
                size="sm"
                className="rounded-full gradient-bg text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Invest
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero portfolio card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="relative mt-5 overflow-hidden rounded-3xl gradient-bg p-6 text-primary-foreground shadow-elegant sm:p-8"
        >
          <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="text-xs font-medium uppercase tracking-[0.14em] opacity-80">
                Total portfolio value
              </div>
              <div className="mt-2 font-display text-3xl font-bold tracking-tight num sm:text-4xl">
                {inr(portfolioStats.totalValue)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5" />+{inr(portfolioStats.todayChange)} (
                {portfolioStats.todayChangePercent}%) today
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <MiniStat label="Invested" value={inr(portfolioStats.invested)} />
                <MiniStat label="Total gain" value={`+${inr(portfolioStats.gain)}`} />
                <MiniStat label="Returns" value={`+${portfolioStats.gainPercent}%`} />
                <MiniStat label="XIRR" value={`${portfolioStats.xirr}%`} />
                <MiniStat label="CAGR (3Y)" value={`${portfolioStats.cagr}%`} />
                <MiniStat label="Monthly SIP" value={inr(portfolioStats.monthlySipTotal)} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-80">Monthly growth · last 13 months</span>
                <div className="flex gap-1">
                  {["1M", "6M", "1Y", "ALL"].map((t, i) => (
                    <button
                      key={t}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${i === 2 ? "bg-white/25 text-white" : "text-white/70 hover:text-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 h-44 sm:h-52">
                <ResponsiveContainer>
                  <AreaChart
                    data={portfolioGrowth}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.6)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />
                    <Tooltip
                      content={<ChartTooltip valueFormatter={inrShort} />}
                      cursor={{ stroke: "rgba(255,255,255,0.3)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      fill="url(#hg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <QuickStat
            icon={Wallet}
            label="Invested"
            value={inr(portfolioStats.invested)}
            sub={`${holdings.length} schemes`}
          />
          <QuickStat
            icon={TrendingUp}
            label="Total gain"
            value={`+${inr(portfolioStats.gain)}`}
            sub={`+${portfolioStats.gainPercent}%`}
            tone="success"
          />
          <QuickStat
            icon={Activity}
            label="XIRR"
            value={`${portfolioStats.xirr}%`}
            sub="annualized"
            tone="success"
          />
          <QuickStat
            icon={Target}
            label="Monthly SIP"
            value={inr(portfolioStats.monthlySipTotal)}
            sub={`${sips.filter((s) => s.status === "Active").length} active SIPs`}
          />
        </div>

        <div className="mt-5">
          <Card>
            <CardHeader
              title="Fresh AMFI NAV funds"
              subtitle="Open-ended schemes updated within the last 7 days"
              action={
                <Link href="/funds" className="text-xs font-medium text-primary">
                  Explore
                </Link>
              }
            />
            {freshFundsLoading ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-2xl bg-secondary/60" />
                ))}
              </div>
            ) : freshFundsError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {freshFundsError}
              </div>
            ) : freshFunds.length === 0 ? (
              <div className="rounded-xl border bg-secondary/30 p-4 text-sm text-muted-foreground">
                No fresh AMFI NAV rows passed the 7-day filter.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {freshFunds.map((fund) => (
                  <FreshFundCard key={`${fund.schemeCode}-${fund.schemeName}`} fund={fund} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Health score, Riskometer, CAGR */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" /> Portfolio health
                  </span>
                ) as any
              }
              subtitle="AI-evaluated score"
            />
            <HealthGauge score={portfolioStats.healthScore} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
              <HealthChip ok label="Diversified" />
              <HealthChip ok label="Cost efficient" />
              <HealthChip warn label="Sector tilt" />
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" /> Riskometer
                  </span>
                ) as any
              }
              subtitle="Portfolio risk level"
            />
            <Riskometer score={portfolioStats.riskScore} />
          </Card>

          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Returns snapshot
                  </span>
                ) as any
              }
              subtitle="Annualized"
            />
            <div className="mt-1 grid grid-cols-2 gap-3">
              <ReturnTile
                label="XIRR"
                value={`${portfolioStats.xirr}%`}
                sub="Since inception"
                tone="success"
              />
              <ReturnTile
                label="CAGR 3Y"
                value={`${portfolioStats.cagr}%`}
                sub="3-year"
                tone="success"
              />
              <ReturnTile label="1Y return" value="+21.4%" sub="Trailing" tone="success" />
              <ReturnTile label="Benchmark" value="+15.8%" sub="Nifty 500 TRI" />
            </div>
            <div className="mt-3 rounded-xl bg-success/10 px-3 py-2 text-[11px] text-success">
              Outperforming benchmark by 5.6% over last 1Y.
            </div>
          </Card>
        </div>

        {/* Performance + allocation */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Monthly growth" subtitle="Portfolio value vs invested" />
            <div className="h-64 sm:h-72">
              <ResponsiveContainer>
                <AreaChart
                  data={portfolioGrowth}
                  margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={inrShort} />} />
                  <Area
                    type="monotone"
                    name="Invested"
                    dataKey="invested"
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.5}
                    fill="url(#dg2)"
                  />
                  <Area
                    type="monotone"
                    name="Value"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#dg1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Asset allocation" subtitle={`${allocation.length} categories`} />
            <div className="relative h-48">
              <ResponsiveContainer>
                <RPieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {allocation.map((a, i) => (
                      <Cell key={i} fill={a.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `${v}%`} />} />
                </RPieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Equity
                  </div>
                  <div className="font-display text-xl font-bold num">{allocation[0].value}%</div>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {allocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </div>
                  <span className="font-semibold num">{a.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Goals */}
        <div className="mt-5">
          <SectionTitle
            title="Goal-based investing"
            subtitle="Track every life goal"
            action={
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="mr-1 h-3.5 w-3.5" /> New goal
              </Button>
            }
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {goals.map((g, i) => {
              const Icon = goalIcons[g.icon] || Target;
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass glass-hover rounded-3xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-glow"
                      style={{ background: g.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${g.onTrack ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}
                    >
                      {g.onTrack ? "On track" : "Behind"}
                    </span>
                  </div>
                  <div className="mt-4 text-sm font-semibold">{g.name}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Target {g.targetYear} · {g.yearsLeft} yrs left
                  </div>

                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="font-display text-lg font-bold num">
                      {inrShort(g.current)}
                    </span>
                    <span className="text-muted-foreground num">/ {inrShort(g.target)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: g.color }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{pct}% complete</span>
                    <span className="num">SIP {inr(g.monthlySip)}/mo</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SIP tracker + upcoming */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="SIP tracker"
              subtitle={`${sips.length} SIPs · ${inr(portfolioStats.monthlySipTotal)}/mo`}
              action={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="mr-1 h-3.5 w-3.5" /> New SIP
                </Button>
              }
            />
            <div className="divide-y divide-border">
              {sips.map((s) => (
                <div key={s.fund} className="flex items-center gap-3 py-3.5">
                  <AmcLogo color={s.amcColor} short={s.amc.slice(0, 2).toUpperCase()} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.fund}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.amc} · {s.day}
                      <sup>th</sup> every month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold num">{inr(s.amount)}</div>
                    <div
                      className={`text-[11px] ${s.status === "Active" ? "text-success" : "text-warning"}`}
                    >
                      {s.status === "Active" ? "● Active" : "❚❚ Paused"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label={`${s.status === "Active" ? "Pause" : "Resume"} SIP for ${s.fund}`}
                  >
                    {s.status === "Active" ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" /> Upcoming SIPs
                  </span>
                ) as any
              }
              subtitle="Next 30 days"
            />
            <div className="space-y-3">
              {sips
                .filter((s) => s.status === "Active")
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .map((s) => (
                  <div
                    key={s.fund}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-center text-primary">
                      <div>
                        <div className="text-[9px] uppercase">Jun</div>
                        <div className="text-sm font-bold leading-none num">{s.day}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.fund}</div>
                      <div className="text-[11px] text-muted-foreground">
                        in {s.daysLeft} days · auto-debit
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold num">{inr(s.amount)}</div>
                  </div>
                ))}
            </div>
            <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-[11px] text-warning">
              Ensure ₹
              {sips
                .filter((s) => s.status === "Active")
                .reduce((a, b) => a + b.amount, 0)
                .toLocaleString("en-IN")}{" "}
              balance for next month's debits.
            </div>
          </Card>
        </div>

        {/* Top + Underperformers */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" /> Top performing schemes
                  </span>
                ) as any
              }
              subtitle="By 1Y return"
            />
            <div className="space-y-3">
              {topPerformers.map((f) => (
                <PerfRow key={f.fund} f={f} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                (
                  <span className="inline-flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" /> Underperforming schemes
                  </span>
                ) as any
              }
              subtitle="Review recommended"
            />
            <div className="space-y-3">
              {underPerformers.map((f) => (
                <PerfRow key={f.fund} f={f} negative />
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
              Talk to your advisor before exiting. Sectoral funds are cyclical.
            </div>
          </Card>
        </div>

        {/* Sector allocation */}
        <div className="mt-5">
          <Card>
            <CardHeader title="Sector allocation" subtitle="Look-through equity exposure" />
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart
                  data={sectorAllocation}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="sector"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-15}
                    dy={10}
                    height={40}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `${v}%`} />} />
                  <Bar dataKey="weight" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Transactions */}
        <div className="mt-5">
          <Card>
            <CardHeader
              title="Recent SIP & transactions"
              subtitle="Last 30 days"
              action={
                <Link href="/portfolio" className="text-xs font-medium text-primary">
                  View all
                </Link>
              }
            />
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-2 pb-3 text-left font-medium">Scheme</th>
                    <th className="px-2 pb-3 text-left font-medium">Type</th>
                    <th className="px-2 pb-3 text-right font-medium">Amount</th>
                    <th className="px-2 pb-3 text-right font-medium">NAV</th>
                    <th className="px-2 pb-3 text-right font-medium">Units</th>
                    <th className="px-2 pb-3 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-secondary/40">
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <AmcLogo color={t.amcColor} short={t.amc.slice(0, 2).toUpperCase()} sm />
                          <span className="font-medium">{t.fund}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            t.type === "Buy"
                              ? "bg-primary/10 text-primary"
                              : t.type === "SIP"
                                ? "bg-success/10 text-success"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right num">{inr(t.amount)}</td>
                      <td className="px-2 py-3 text-right text-muted-foreground num">
                        ₹{t.nav.toFixed(2)}
                      </td>
                      <td className="px-2 py-3 text-right text-muted-foreground num">
                        {t.units.toFixed(2)}
                      </td>
                      <td className="px-2 py-3 text-right text-muted-foreground">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub components ---------- */

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="mt-0.5 font-semibold num">{value}</div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, sub, tone }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-hover rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-lg font-bold num sm:text-xl">{value}</div>
      <div
        className={`mt-0.5 text-[11px] ${tone === "success" ? "text-success" : "text-muted-foreground"}`}
      >
        {sub}
      </div>
    </motion.div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl p-5 sm:p-6 ${className}`}>{children}</div>;
}

function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="font-display text-base font-semibold">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-bold sm:text-xl">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AmcLogo({ color, short, sm }: { color: string; short: string; sm?: boolean }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-lg font-bold text-white ${sm ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs"}`}
      style={{ background: color }}
    >
      {short}
    </div>
  );
}

function FreshFundCard({ fund }: { fund: AmfiFund }) {
  return (
    <Link
      href={`/funds/${fund.schemeCode}`}
      className="block rounded-2xl border border-border/70 bg-secondary/30 p-4 transition hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
            {fund.fundHouse ?? "AMFI"}
          </div>
          <div className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
            {fund.schemeName}
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          Fresh
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</div>
          <div className="mt-0.5 font-display text-lg font-bold num">Rs. {fund.navText}</div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <div>{fund.date}</div>
          <div className="mt-0.5 truncate">{fund.category ?? "Open ended"}</div>
        </div>
      </div>
      <div className="mt-3 text-xs font-semibold text-primary">View NAV history →</div>
    </Link>
  );
}

function HealthGauge({ score }: { score: number }) {
  const data = [{ name: "score", value: score, fill: "var(--primary)" }];
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs review";
  return (
    <div className="relative h-44">
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={210}
          endAngle={-30}
        >
          <RadialBar
            background={{ fill: "var(--secondary)" } as any}
            dataKey="value"
            cornerRadius={20}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-3xl font-bold num">{score}</div>
          <div className="mt-0.5 text-[11px] font-medium text-success">{label}</div>
        </div>
      </div>
    </div>
  );
}

function HealthChip({ ok, warn, label }: { ok?: boolean; warn?: boolean; label: string }) {
  const Icon = warn ? AlertTriangle : CheckCircle2;
  return (
    <div
      className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 ${warn ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}
    >
      <Icon className="h-3 w-3" /> {label}
    </div>
  );
}

function Riskometer({ score }: { score: number }) {
  // 0-100 mapped to 5 zones
  const zones = ["Low", "Mod-Low", "Moderate", "Mod-High", "High"];
  const zoneIdx = Math.min(4, Math.floor(score / 20));
  const angle = -90 + (score / 100) * 180; // -90..90 deg
  const colors = ["#16a34a", "#65a30d", "#eab308", "#f97316", "#dc2626"];
  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-2 h-28 w-full max-w-[260px]">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          {colors.map((c, i) => {
            const start = -90 + i * 36;
            const end = start + 36;
            const r1 = 70,
              r2 = 95;
            const a1 = (start * Math.PI) / 180;
            const a2 = (end * Math.PI) / 180;
            const x1 = 100 + r2 * Math.cos(a1);
            const y1 = 100 + r2 * Math.sin(a1);
            const x2 = 100 + r2 * Math.cos(a2);
            const y2 = 100 + r2 * Math.sin(a2);
            const x3 = 100 + r1 * Math.cos(a2);
            const y3 = 100 + r1 * Math.sin(a2);
            const x4 = 100 + r1 * Math.cos(a1);
            const y4 = 100 + r1 * Math.sin(a1);
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`}
                fill={c}
                opacity={i === zoneIdx ? 1 : 0.3}
              />
            );
          })}
          {/* needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="22"
              stroke="var(--foreground)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="6" fill="var(--foreground)" />
          </g>
        </svg>
      </div>
      <div className="mt-1 text-center">
        <div className="font-display text-lg font-bold">{zones[zoneIdx]}</div>
        <div className="text-[11px] text-muted-foreground">
          Risk score {score}/100 · suits aggressive investors
        </div>
      </div>
    </div>
  );
}

function ReturnTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "success";
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-lg font-bold num ${tone === "success" ? "text-success" : ""}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function PerfRow({ f, negative }: { f: any; negative?: boolean }) {
  const pnl = f.current - f.invested;
  const pct = ((pnl / f.invested) * 100).toFixed(1);
  return (
    <div className="flex items-center gap-3">
      <AmcLogo color={f.amcColor} short={f.amcShort} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{f.fund}</div>
        <div className="text-[11px] text-muted-foreground">
          {f.amc} · {f.category}
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-sm font-semibold num ${negative ? "text-destructive" : "text-success"}`}
        >
          {f.return1y >= 0 ? "+" : ""}
          {f.return1y}%
        </div>
        <div className="text-[11px] text-muted-foreground num">
          {inrShort(f.current)} · {pct}%
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
