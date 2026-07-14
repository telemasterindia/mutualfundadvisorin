"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  CalendarClock,
  Calculator,
  CheckCircle2,
  Home,
  Loader2,
  PiggyBank,
  Send,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const inr = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-IN")}`;
const pct = (n: number) => `${Number(n.toFixed(2))}%`;
const clampFinite = (n: number) => (Number.isFinite(n) ? n : 0);

const calculators = [
  { id: "sip", label: "SIP", icon: TrendingUp },
  { id: "goal-sip", label: "Goal SIP", icon: Target },
  { id: "lumpsum", label: "Lumpsum", icon: PiggyBank },
  { id: "emi", label: "EMI", icon: Home },
  { id: "retirement", label: "Retirement", icon: CalendarClock },
  { id: "net-worth", label: "Net Worth", icon: Wallet },
] as const;

type CalculatorId = (typeof calculators)[number]["id"];
type SummaryItem = [string, string, ("success" | "bold")?];

const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  message: z.string().trim().max(800).optional(),
});

function FinancialCalculators() {
  const [active, setActive] = useState<CalculatorId>("sip");

  useEffect(() => {
    const syncHash = () => {
      const selectedTool = window.location.hash.replace("#", "");

      if (calculators.some((calculator) => calculator.id === selectedTool)) {
        setActive(selectedTool as CalculatorId);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium text-primary">
              <Calculator className="h-3.5 w-3.5" /> Financial planning tools
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Financial Calculators
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Estimate SIP growth, goal funding, loan EMI, retirement corpus and net worth. Use the
              numbers as planning estimates, then speak with an advisor before making decisions.
            </p>
          </div>
          <a href="#consultation">
            <Button className="rounded-full gradient-bg text-primary-foreground shadow-glow">
              Get a custom plan
            </Button>
          </a>
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {calculators.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`flex h-14 items-center gap-3 rounded-2xl border px-4 text-left text-sm font-semibold transition ${
                  selected
                    ? "border-primary bg-primary/10 text-primary shadow-glow"
                    : "border-border/70 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {active === "sip" && <SipCalculator />}
          {active === "goal-sip" && <GoalSipCalculator />}
          {active === "lumpsum" && <LumpsumCalculator />}
          {active === "emi" && <EmiCalculator />}
          {active === "retirement" && <RetirementCalculator />}
          {active === "net-worth" && <NetWorthCalculator />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const value =
      monthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const invested = monthly * months;
    const data = Array.from({ length: years + 1 }, (_, year) => {
      const month = year * 12;
      const yearValue =
        month === 0 || monthlyRate === 0
          ? monthly * month
          : monthly * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
      return { year: `Y${year}`, invested: monthly * month, value: yearValue };
    });

    return { invested, value, gains: value - invested, data };
  }, [monthly, years, rate]);

  return (
    <CalculatorLayout
      title="SIP Calculator"
      subtitle="Estimate monthly mutual fund SIP growth with compounding."
      summary={[
        ["Invested amount", inr(result.invested)],
        ["Estimated gains", inr(result.gains), "success"],
        ["Future value", inr(result.value), "bold"],
      ]}
      chart={<GrowthChart data={result.data} />}
      context={`SIP: ${inr(monthly)} monthly for ${years} years at ${rate}% expected return. Estimated value ${inr(result.value)}.`}
    >
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
        label="Time period"
        value={`${years} years`}
        min={1}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Expected return"
        value={`${rate}% p.a.`}
        min={1}
        max={30}
        step={0.5}
        v={rate}
        setV={setRate}
      />
    </CalculatorLayout>
  );
}

function GoalSipCalculator() {
  const [target, setTarget] = useState(2500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const factor =
      monthlyRate === 0
        ? months
        : ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const sip = target / factor;
    const invested = sip * months;
    return { sip, invested, gains: target - invested };
  }, [target, years, rate]);

  return (
    <CalculatorLayout
      title="Goal SIP Calculator"
      subtitle="Find the monthly SIP needed to reach a future goal."
      summary={[
        ["Required monthly SIP", inr(result.sip), "bold"],
        ["Total invested", inr(result.invested)],
        ["Expected growth", inr(result.gains), "success"],
      ]}
      chart={<BreakupChart invested={result.invested} gains={result.gains} />}
      context={`Goal SIP: Target ${inr(target)} in ${years} years at ${rate}%. Required SIP ${inr(result.sip)}.`}
    >
      <Control
        label="Goal amount"
        value={inr(target)}
        min={100000}
        max={100000000}
        step={50000}
        v={target}
        setV={setTarget}
      />
      <Control
        label="Time to goal"
        value={`${years} years`}
        min={1}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Expected return"
        value={`${rate}% p.a.`}
        min={1}
        max={30}
        step={0.5}
        v={rate}
        setV={setRate}
      />
    </CalculatorLayout>
  );
}

function LumpsumCalculator() {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const value = amount * Math.pow(1 + rate / 100, years);
    return { value, gains: value - amount };
  }, [amount, years, rate]);

  return (
    <CalculatorLayout
      title="Lumpsum Calculator"
      subtitle="Estimate the future value of a one-time investment."
      summary={[
        ["Initial investment", inr(amount)],
        ["Estimated gains", inr(result.gains), "success"],
        ["Future value", inr(result.value), "bold"],
      ]}
      chart={<BreakupChart invested={amount} gains={result.gains} />}
      context={`Lumpsum: ${inr(amount)} for ${years} years at ${rate}%. Estimated value ${inr(result.value)}.`}
    >
      <Control
        label="Investment amount"
        value={inr(amount)}
        min={10000}
        max={10000000}
        step={10000}
        v={amount}
        setV={setAmount}
      />
      <Control
        label="Time period"
        value={`${years} years`}
        min={1}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Expected return"
        value={`${rate}% p.a.`}
        min={1}
        max={30}
        step={0.5}
        v={rate}
        setV={setRate}
      />
    </CalculatorLayout>
  );
}

function EmiCalculator() {
  const [principal, setPrincipal] = useState(3000000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
    const total = emi * months;
    return { emi, total, interest: total - principal };
  }, [principal, years, rate]);

  return (
    <CalculatorLayout
      title="EMI Calculator"
      subtitle="Calculate monthly loan EMI and total interest outgo."
      summary={[
        ["Monthly EMI", inr(result.emi), "bold"],
        ["Total interest", inr(result.interest)],
        ["Total payment", inr(result.total), "success"],
      ]}
      chart={
        <BreakupChart
          invested={principal}
          gains={result.interest}
          investedLabel="Principal"
          gainsLabel="Interest"
        />
      }
      context={`EMI: Loan ${inr(principal)} for ${years} years at ${rate}%. EMI ${inr(result.emi)}.`}
    >
      <Control
        label="Loan amount"
        value={inr(principal)}
        min={100000}
        max={50000000}
        step={50000}
        v={principal}
        setV={setPrincipal}
      />
      <Control
        label="Loan tenure"
        value={`${years} years`}
        min={1}
        max={30}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Interest rate"
        value={`${rate}% p.a.`}
        min={1}
        max={20}
        step={0.1}
        v={rate}
        setV={setRate}
      />
    </CalculatorLayout>
  );
}

function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(80000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(10);

  const result = useMemo(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const retirementYears = 25;
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
    const annualExpense = futureMonthlyExpense * 12;
    const realReturn = (1 + returnRate / 100) / (1 + inflation / 100) - 1;
    const corpus =
      realReturn === 0
        ? annualExpense * retirementYears
        : annualExpense * ((1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn);
    const monthlyRate = returnRate / 100 / 12;
    const months = yearsToRetire * 12;
    const sip =
      monthlyRate === 0
        ? corpus / months
        : corpus / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    return { yearsToRetire, futureMonthlyExpense, corpus, sip };
  }, [currentAge, retirementAge, monthlyExpense, inflation, returnRate]);

  return (
    <CalculatorLayout
      title="Retirement Calculator"
      subtitle="Estimate the corpus and SIP required for retirement planning."
      summary={[
        ["Inflated monthly expense", inr(result.futureMonthlyExpense)],
        ["Required corpus", inr(result.corpus), "bold"],
        ["Required monthly SIP", inr(result.sip), "success"],
      ]}
      chart={
        <BarSummaryChart
          data={[
            { name: "Monthly SIP", value: result.sip },
            { name: "Monthly expense", value: result.futureMonthlyExpense },
            { name: "Corpus / 100", value: result.corpus / 100 },
          ]}
        />
      }
      context={`Retirement: Age ${currentAge} to ${retirementAge}, current monthly expense ${inr(monthlyExpense)}, inflation ${inflation}%, expected return ${returnRate}%. Required corpus ${inr(result.corpus)}.`}
    >
      <Control
        label="Current age"
        value={`${currentAge}`}
        min={20}
        max={58}
        step={1}
        v={currentAge}
        setV={setCurrentAge}
      />
      <Control
        label="Retirement age"
        value={`${retirementAge}`}
        min={45}
        max={70}
        step={1}
        v={retirementAge}
        setV={setRetirementAge}
      />
      <Control
        label="Monthly expense"
        value={inr(monthlyExpense)}
        min={20000}
        max={500000}
        step={5000}
        v={monthlyExpense}
        setV={setMonthlyExpense}
      />
      <Control
        label="Inflation"
        value={`${inflation}% p.a.`}
        min={3}
        max={12}
        step={0.5}
        v={inflation}
        setV={setInflation}
      />
      <Control
        label="Expected return"
        value={`${returnRate}% p.a.`}
        min={4}
        max={18}
        step={0.5}
        v={returnRate}
        setV={setReturnRate}
      />
    </CalculatorLayout>
  );
}

function NetWorthCalculator() {
  const [assets, setAssets] = useState({
    investments: 2500000,
    property: 8000000,
    cash: 500000,
    other: 300000,
  });
  const [liabilities, setLiabilities] = useState({
    homeLoan: 2500000,
    personalLoan: 200000,
    creditCard: 50000,
  });

  const result = useMemo(() => {
    const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0);
    return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
  }, [assets, liabilities]);

  return (
    <CalculatorLayout
      title="Net Worth Calculator"
      subtitle="Track your financial position by comparing assets and liabilities."
      summary={[
        ["Total assets", inr(result.totalAssets), "success"],
        ["Total liabilities", inr(result.totalLiabilities)],
        ["Net worth", inr(result.netWorth), "bold"],
      ]}
      chart={
        <BreakupChart
          invested={result.totalAssets}
          gains={result.totalLiabilities}
          investedLabel="Assets"
          gainsLabel="Liabilities"
        />
      }
      context={`Net worth: Assets ${inr(result.totalAssets)}, liabilities ${inr(result.totalLiabilities)}, net worth ${inr(result.netWorth)}.`}
    >
      <MoneyInput
        label="Investments"
        value={assets.investments}
        onChange={(value) => setAssets({ ...assets, investments: value })}
      />
      <MoneyInput
        label="Property"
        value={assets.property}
        onChange={(value) => setAssets({ ...assets, property: value })}
      />
      <MoneyInput
        label="Cash and bank"
        value={assets.cash}
        onChange={(value) => setAssets({ ...assets, cash: value })}
      />
      <MoneyInput
        label="Other assets"
        value={assets.other}
        onChange={(value) => setAssets({ ...assets, other: value })}
      />
      <MoneyInput
        label="Home loan"
        value={liabilities.homeLoan}
        onChange={(value) => setLiabilities({ ...liabilities, homeLoan: value })}
      />
      <MoneyInput
        label="Personal loan"
        value={liabilities.personalLoan}
        onChange={(value) => setLiabilities({ ...liabilities, personalLoan: value })}
      />
      <MoneyInput
        label="Credit cards"
        value={liabilities.creditCard}
        onChange={(value) => setLiabilities({ ...liabilities, creditCard: value })}
      />
    </CalculatorLayout>
  );
}

function CalculatorLayout({
  title,
  subtitle,
  summary,
  chart,
  context,
  children,
}: {
  title: string;
  subtitle: string;
  summary: SummaryItem[];
  chart: React.ReactNode;
  context: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="glass rounded-3xl p-5 sm:p-6 lg:col-span-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </section>

      <section className="space-y-6 lg:col-span-3">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.map(([label, value, tone]) => (
              <div key={label} className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
                <div
                  className={`mt-2 font-display text-xl font-bold ${
                    tone === "success" ? "text-success" : ""
                  } ${tone === "bold" ? "text-primary" : ""}`}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-72">{chart}</div>
        </div>

        <ConsultationLeadForm calculator={title} context={context} />
      </section>
    </div>
  );
}

function ConsultationLeadForm({ calculator, context }: { calculator: string; context: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const parsed = leadSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    const { error } = await supabase.from("leads").insert({
      full_name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      source: `calculator-${calculator.toLowerCase().replace(/\s+/g, "-")}`,
      goal: calculator,
      message: `${context}${parsed.data.message ? ` Notes: ${parsed.data.message}` : ""}`,
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
    toast.success("Request sent. We'll call you with a custom plan.");
  };

  return (
    <form
      id="consultation"
      onSubmit={submit}
      className="glass rounded-3xl p-5 sm:p-6"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          {sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">
            {sent ? "Consultation request received" : "Want a custom plan?"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent
              ? "We saved your calculator result and contact details. The advisory team will call you with the next steps."
              : "Share your details and Amit Chadha's team will help you turn this estimate into an actionable investment plan."}
          </p>
        </div>
      </div>

      {sent ? (
        <div className="mt-5 rounded-3xl border border-success/30 bg-success/10 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-success text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-success">
                Your request has been sent.
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                We attached this {calculator.toLowerCase()} result to your lead so the advisor can
                give a more relevant plan.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
            {context}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/book-consultation">
              <Button type="button" className="rounded-full gradient-bg text-primary-foreground">
                Pick a consultation slot
              </Button>
            </a>
            <a href="/contact">
              <Button type="button" variant="outline" className="rounded-full">
                Contact advisor
              </Button>
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Calculator snapshot:</span> {context}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field label="Name" error={errors.name}>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
              />
            </Field>
            <Field label="Mobile" error={errors.phone}>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                inputMode="numeric"
                placeholder="99992 52122"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Notes for advisor" error={errors.message}>
              <Textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={800}
                placeholder="Goal, timeline, existing investments..."
              />
            </Field>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-5 rounded-full gradient-bg text-primary-foreground shadow-glow hover:opacity-95"
          >
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Banknote className="mr-2 h-4 w-4" />
            )}
            Request consultation
          </Button>
        </>
      )}
    </form>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  v,
  setV,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  v: number;
  setV: (value: number) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
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

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Input
        className="mt-2"
        inputMode="numeric"
        value={value.toString()}
        onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")) || 0)}
      />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function GrowthChart({ data }: { data: Array<{ year: string; invested: number; value: number }> }) {
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="calcValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="calcInvested" x1="0" y1="0" x2="0" y2="1">
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
          tickFormatter={(value) =>
            value >= 10000000
              ? `${(value / 10000000).toFixed(1)}Cr`
              : `${(value / 100000).toFixed(0)}L`
          }
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
          formatter={(value) => inr(Number(value))}
        />
        <Area
          type="monotone"
          dataKey="invested"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          fill="url(#calcInvested)"
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#calcValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BreakupChart({
  invested,
  gains,
  investedLabel = "Invested",
  gainsLabel = "Growth",
}: {
  invested: number;
  gains: number;
  investedLabel?: string;
  gainsLabel?: string;
}) {
  const data = [
    { name: investedLabel, value: Math.max(0, clampFinite(invested)), color: "var(--primary)" },
    { name: gainsLabel, value: Math.max(0, clampFinite(gains)), color: "var(--chart-2)" },
  ];

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={105}
          paddingAngle={4}
        >
          {data.map((item) => (
            <Cell key={item.name} fill={item.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => inr(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarSummaryChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
        <XAxis
          dataKey="name"
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
          tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
        />
        <Tooltip formatter={(value) => inr(Number(value))} />
        <Bar dataKey="value" fill="var(--primary)" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Page() {
  return <FinancialCalculators />;
}
