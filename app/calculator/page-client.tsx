"use client";
import { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Calculator() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const { invested, value, growth, data } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const inv = monthly * n;

    const data = [];
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const v = m === 0 ? 0 : monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      data.push({ year: `Y${y}`, invested: monthly * m, value: v });
    }
    return { invested: inv, value: fv, growth: fv - inv, data };
  }, [monthly, years, rate]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold">SIP Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          See the magic of compounding in action.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <Control
              label="Monthly investment"
              value={inr(monthly)}
              min={500}
              max={200000}
              step={500}
              v={monthly}
              setV={setMonthly}
            />
            <Control
              label="Time period (years)"
              value={`${years} years`}
              min={1}
              max={40}
              step={1}
              v={years}
              setV={setYears}
            />
            <Control
              label="Expected return (p.a.)"
              value={`${rate}%`}
              min={1}
              max={30}
              step={0.5}
              v={rate}
              setV={setRate}
            />

            <div className="mt-8 space-y-3">
              <Row label="Invested amount" value={inr(invested)} />
              <Row label="Estimated returns" value={inr(growth)} accent />
              <div className="my-3 h-px bg-border" />
              <Row label="Total value" value={inr(value)} bold />
            </div>

            <Button
              className="mt-6 w-full gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
              size="lg"
            >
              Start this SIP
            </Button>
          </div>

          <div className="glass rounded-3xl p-6 lg:col-span-3">
            <div className="text-sm text-muted-foreground">Wealth growth projection</div>
            <div className="mt-4 h-80">
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="year"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 10000000
                        ? `${(v / 10000000).toFixed(1)}Cr`
                        : `${(v / 100000).toFixed(0)}L`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                    formatter={(v: any) => inr(Number(v))}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    stackId="1"
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.5}
                    fill="url(#ci)"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#cv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Control({ label, value, min, max, step, v, setV }: any) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {value}
        </span>
      </div>
      <Slider
        value={[v]}
        min={min}
        max={max}
        step={step}
        onValueChange={(x) => setV(x[0])}
        aria-label={label}
        className="mt-3"
      />
    </div>
  );
}

function Row({ label, value, accent, bold }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`${bold ? "font-display text-2xl font-bold" : "font-semibold"} ${accent ? "text-success" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function Page() {
  return <Calculator />;
}
