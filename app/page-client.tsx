"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  ShieldCheck,
  LineChart,
  Brain,
  Star,
  Plus,
  Minus,
  TrendingUp,
  PieChart,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
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
} from "recharts";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { portfolioGrowth, allocation } from "@/lib/mock-data";

const FAQS = [
  {
    q: "Is WealthMaster India regulated?",
    a: "Yes. WealthMaster India is an Mutual Fund Distributor operating in compliance with SEBI guidelines. Your investments are held directly with the AMC and registrars (CAMS/KFintech) — we never hold your money.",
  },
  {
    q: "How does WealthMaster India work?",
    a: "We pair you with a dedicated mutual fund advisor who understands your goals, risk profile and life stage. Together we build a personalized SIP and wealth plan, then review and rebalance it with you over the long term.",
  },
  {
    q: "Can I start with a small SIP?",
    a: "Absolutely. Most of our recommended SIPs start at ₹500–₹1,000 a month. Your advisor will design a plan that grows with your income and goals — no lock-in (except ELSS).",
  },
  {
    q: "How are returns calculated?",
    a: "We use XIRR — the industry standard for irregular cashflows. It accounts for the timing of every SIP, lump sum, and redemption.",
  },
  {
    q: "Is my data private?",
    a: "Bank-grade encryption end-to-end. We never sell your data. You can export or delete your account anytime.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Stats />
      <Benefits />
      <Goals />
      <PortfolioPreview />
      <AIInsights />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28 lg:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md ring-soft"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-primary" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Independent Wealth Advisory · Mutual Funds · SIPs · PMS · AIF
            </motion.div>

            <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.5rem]">
              Build Long-Term <span className="gradient-text">Wealth</span> with Confidence.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Mutual Funds, SIPs, Insurance, PMS, AIF and Wealth Planning Solutions for Indian
              Investors — guided by Amit Chadha, Founder &amp; Investment Advisor at WealthMaster
              India.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/book-consultation">
                <Button
                  size="lg"
                  className="group h-12 rounded-full px-6 gradient-bg text-primary-foreground shadow-glow hover:opacity-95"
                >
                  Speak with Amit Chadha
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full px-6 backdrop-blur"
                >
                  Try SIP calculator
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 sm:gap-8">
              <Trust label="Trusted by" value="2.4M+" sub="investors" />
              <Trust label="AUM" value="₹18,400" sub="crore" />
              <Trust label="Avg. XIRR" value="16.2%" sub="3-yr" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative"
          >
            <HeroCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Trust({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold text-foreground num">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 to-primary-glow/20 blur-3xl" />
      <div className="glass rounded-3xl p-6 shadow-elegant animate-float">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Total portfolio</div>
            <div className="mt-1 font-display text-3xl font-bold">₹18,47,250</div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-3.5 w-3.5" /> +27.4% all-time • XIRR 18.6%
            </div>
          </div>
          <div className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            Live
          </div>
        </div>

        <div className="mt-5 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioGrowth}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: any) => `₹${(Number(v) / 100000).toFixed(2)}L`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#g1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {allocation.slice(0, 3).map((a) => (
            <div key={a.name} className="rounded-xl bg-secondary/60 p-3">
              <div className="text-xs text-muted-foreground">{a.name}</div>
              <div className="mt-0.5 text-sm font-semibold">{a.value}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 hidden glass rounded-2xl p-4 shadow-soft md:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">SIP processed</div>
            <div className="text-sm font-semibold">+ ₹10,000 Axis Bluechip</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { v: "5,000+", l: "Curated mutual funds" },
    { v: "100%", l: "Personalized advisory" },
    { v: "₹18,400 Cr", l: "Assets under advisory" },
    { v: "4.8★", l: "Rated by investors" },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/40 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((i) => (
          <div key={i.l}>
            <div className="font-display text-3xl font-bold tracking-tight num sm:text-4xl">
              {i.v}
            </div>
            <div className="mt-1.5 text-sm text-muted-foreground">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    {
      icon: LineChart,
      title: "Power of compounding",
      desc: "₹10,000 monthly at 15% becomes ₹2.3 Cr in 25 years.",
    },
    {
      icon: ShieldCheck,
      title: "Disciplined investing",
      desc: "Auto-debited SIPs remove emotion from market timing.",
    },
    {
      icon: Wallet,
      title: "Start with ₹500",
      desc: "No minimum balance. Start small, scale as you grow.",
    },
    {
      icon: Target,
      title: "Tax-saving funds",
      desc: "Save up to ₹46,800 a year under Section 80C with ELSS.",
    },
  ];
  return (
    <Section eyebrow="Long-term wealth creation" title="Disciplined SIPs. Generational wealth.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="glass rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-bg text-primary-foreground shadow-glow">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Goals() {
  const goals = [
    { emoji: "🏡", title: "Buy a home", years: "10 yrs", monthly: "₹35,000" },
    { emoji: "🎓", title: "Child's education", years: "15 yrs", monthly: "₹12,000" },
    { emoji: "🏝️", title: "Early retirement", years: "20 yrs", monthly: "₹25,000" },
    { emoji: "🚗", title: "Dream car", years: "5 yrs", monthly: "₹18,000" },
  ];
  return (
    <Section eyebrow="Goal-based investing" title="Plans that match your life.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {goals.map((g) => (
          <div key={g.title} className="glass rounded-2xl p-6">
            <div className="text-3xl">{g.emoji}</div>
            <h3 className="mt-3 font-display text-lg font-semibold">{g.title}</h3>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Suggested SIP</div>
                <div className="font-semibold">{g.monthly}/mo</div>
              </div>
              <div className="rounded-full bg-secondary px-3 py-1 text-xs">{g.years}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PortfolioPreview() {
  return (
    <Section eyebrow="Portfolio tracking" title="Every rupee, beautifully visible.">
      <div className="glass rounded-3xl p-6 md:p-10 shadow-elegant">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Portfolio value</div>
                <div className="font-display text-4xl font-bold">₹18,47,250</div>
                <div className="text-sm text-success">+ ₹3,97,250 (+27.4%)</div>
              </div>
              <div className="flex gap-2">
                {["1M", "6M", "1Y", "ALL"].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded-full px-3 py-1 text-xs ${i === 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioGrowth}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.5}
                    fill="url(#g3)"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#g2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Asset allocation</div>
            <div className="mt-2 h-56">
              <ResponsiveContainer>
                <RPieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {allocation.map((a, i) => (
                      <Cell key={i} fill={a.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                </RPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {allocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </div>
                  <span className="font-medium">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function AIInsights() {
  return (
    <Section eyebrow="Advisory + technology" title="Human guidance, smarter decisions.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-bg shadow-glow">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold">Advisor-led recommendations</h3>
          <p className="mt-2 text-muted-foreground">
            Your dedicated advisor combines deep research across 5,000+ schemes with smart analytics
            to recommend funds that fit your goals — not what's trending.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Risk-adjusted returns over 1, 3, 5 years",
              "Expense ratio & category benchmark deltas",
              "Fund manager tenure & consistency score",
              "Personalized rebalancing nudges",
            ].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4">
          <InsightCard
            icon={PieChart}
            tone="success"
            title="Your equity exposure is ideal"
            body="62% equity is well-aligned with your aggressive 15-year horizon."
          />
          <InsightCard
            icon={Target}
            tone="warning"
            title="Rebalance suggestion"
            body="Debt allocation is 4% below target. Add ₹40,000 to SBI Magnum Gilt."
          />
          <InsightCard
            icon={Sparkles}
            tone="primary"
            title="Tax-saving opportunity"
            body="₹52,000 of 80C limit unused. Start an ELSS SIP before Mar 31."
          />
        </div>
      </div>
    </Section>
  );
}

function InsightCard({ icon: Icon, title, body, tone }: any) {
  const toneCls =
    tone === "success"
      ? "bg-success/10 text-success"
      : tone === "warning"
        ? "bg-warning/15 text-warning"
        : "bg-primary/10 text-primary";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{body}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Ananya Mehta",
      role: "Product Manager, Bangalore",
      body: "Cleanest portfolio dashboard I've used. The AI nudges actually helped me rebalance before the small-cap correction.",
    },
    {
      name: "Rohan Kapoor",
      role: "Founder, Mumbai",
      body: "Started SIPs of ₹20k three years ago — XIRR of 22%. The goal planner makes investing feel intentional.",
    },
    {
      name: "Pooja Iyer",
      role: "Doctor, Pune",
      body: "My advisor at WealthMaster India rebuilt my portfolio around real life goals. The hand-holding makes all the difference.",
    },
  ];
  return (
    <Section eyebrow="Loved by investors" title="Trusted by India's long-term investors.">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-6">
            <div className="flex gap-1 text-warning">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm">{t.body}</p>
            <div className="mt-5 border-t border-border pt-4">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = FAQS;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section eyebrow="FAQ" title="Everything you wanted to ask.">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="glass rounded-2xl">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <span className="font-medium">{f.q}</span>
              {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}

export default function Page() {
  return <Landing />;
}
