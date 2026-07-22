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
  AlertTriangle,
  Banknote,
  CalendarClock,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Home,
  Info,
  Loader2,
  PiggyBank,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet,
  Bot,
  BriefcaseBusiness,
  Repeat2,
  Percent,
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
import { PersonaGuide } from "@/components/persona-guide";

const inr = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-IN")}`;
const pct = (n: number) => `${Number(n.toFixed(2))}%`;
const clampFinite = (n: number) => (Number.isFinite(n) ? n : 0);

const calculators = [
  { id: "persona-advisor", label: "Persona Advisor", icon: Bot },
  { id: "ppf", label: "PPF", icon: ShieldCheck },
  { id: "hlv", label: "HLV", icon: BriefcaseBusiness },
  { id: "sip", label: "SIP", icon: TrendingUp },
  { id: "mutual-fund", label: "Mutual Fund", icon: PiggyBank },
  { id: "stp", label: "STP", icon: Repeat2 },
  { id: "epf", label: "EPF", icon: Wallet },
  { id: "goal-sip", label: "Goal SIP", icon: Target },
  { id: "lumpsum", label: "Lumpsum", icon: PiggyBank },
  { id: "emi", label: "EMI", icon: Home },
  { id: "home-loan", label: "Home Loan", icon: Home },
  { id: "personal-loan", label: "Personal Loan", icon: Banknote },
  { id: "car-loan", label: "Car Loan", icon: Calculator },
  { id: "real-return", label: "Real Return", icon: Percent },
  { id: "retirement", label: "Retirement", icon: CalendarClock },
  { id: "net-worth", label: "Net Worth", icon: Wallet },
] as const;

type CalculatorId = (typeof calculators)[number]["id"];
type SummaryItem = [string, string, ("success" | "bold")?];

const sebiReferences = [
  {
    label: "SEBI Investor Charter",
    href: "https://investor.sebi.gov.in/Investor-charter.html",
  },
  {
    label: "SEBI Investor Education",
    href: "https://investor.sebi.gov.in/personalsecurities.html",
  },
  {
    label: "SEBI Investor Helpline",
    href: "https://investor.sebi.gov.in/",
  },
] as const;

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
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
              <Calculator className="h-3.5 w-3.5" /> Financial planning tools
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Financial Calculators
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Estimate SIP growth, goal funding, loan EMI, retirement corpus and net worth using
              transparent formulas, stated assumptions and SEBI investor-awareness guardrails.
            </p>
          </div>
          <a href="#consultation">
            <Button className="rounded-full gradient-bg text-primary-foreground shadow-glow">
              Get a custom plan
            </Button>
          </a>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary/25 bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              SEBI-aligned investor safety
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              These tools are educational estimates, not assured returns or investment advice. Users
              should understand risk, costs and suitability before investing.
            </p>
          </div>
          <div className="rounded-2xl border border-warning/35 bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Mutual fund risk note
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Expected return is only an assumption. Actual mutual fund returns depend on market
              performance, scheme costs, taxes and holding period.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Info className="h-4 w-4 text-primary" />
              Official references
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sebiReferences.map((reference) => (
                <a
                  key={reference.href}
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {reference.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    ? "border-primary bg-primary/10 text-primary shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {active === "persona-advisor" && <PersonaGuide />}
          {active === "ppf" && <SavingsGrowthCalculator kind="ppf" />}
          {active === "hlv" && <HlvCalculator />}
          {active === "sip" && <SipCalculator />}
          {active === "mutual-fund" && <LumpsumCalculator title="Mutual Fund Calculator" />}
          {active === "stp" && <StpCalculator />}
          {active === "epf" && <SavingsGrowthCalculator kind="epf" />}
          {active === "goal-sip" && <GoalSipCalculator />}
          {active === "lumpsum" && <LumpsumCalculator />}
          {active === "emi" && <EmiCalculator title="EMI Calculator" />}
          {active === "home-loan" && (
            <EmiCalculator
              title="Home Loan Calculator"
              defaultPrincipal={5000000}
              defaultYears={20}
              defaultRate={8.5}
            />
          )}
          {active === "personal-loan" && (
            <EmiCalculator
              title="Personal Loan Calculator"
              defaultPrincipal={500000}
              defaultYears={5}
              defaultRate={12}
            />
          )}
          {active === "car-loan" && (
            <EmiCalculator
              title="Car Loan Calculator"
              defaultPrincipal={1000000}
              defaultYears={7}
              defaultRate={9}
            />
          )}
          {active === "real-return" && <RealReturnCalculator />}
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
      methodology={[
        "Uses standard future value of an annuity-due formula for monthly SIP installments.",
        "Assumes the selected annual return is compounded monthly and every SIP is made at the beginning of the month.",
        "Does not include exit load, expense ratio, tax, missed installments or market volatility.",
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
      methodology={[
        "Discounts the target corpus using the same monthly SIP annuity-due formula in reverse.",
        "Assumes a constant expected return and fixed monthly investment through the full period.",
        "If the goal is essential, review inflation, risk tolerance and asset allocation before acting.",
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

function LumpsumCalculator({ title = "Lumpsum Calculator" }: { title?: string } = {}) {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const value = amount * Math.pow(1 + rate / 100, years);
    return { value, gains: value - amount };
  }, [amount, years, rate]);

  return (
    <CalculatorLayout
      title={title}
      subtitle="Estimate the future value of a one-time investment."
      summary={[
        ["Initial investment", inr(amount)],
        ["Estimated gains", inr(result.gains), "success"],
        ["Future value", inr(result.value), "bold"],
      ]}
      methodology={[
        "Uses annual compound growth on a one-time investment amount.",
        "Assumes the selected annual return remains constant for the full holding period.",
        "Does not factor scheme expenses, taxes, exit load or actual NAV movement.",
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

function SavingsGrowthCalculator({ kind }: { kind: "ppf" | "epf" }) {
  const isPpf = kind === "ppf";
  const [contribution, setContribution] = useState(isPpf ? 150000 : 120000);
  const [years, setYears] = useState(isPpf ? 15 : 25);
  const [rate, setRate] = useState(isPpf ? 7.1 : 8.25);
  const result = useMemo(() => {
    const maturity =
      contribution * ((Math.pow(1 + rate / 100, years) - 1) / (rate / 100)) * (1 + rate / 100);
    return { invested: contribution * years, maturity };
  }, [contribution, years, rate]);
  const title = isPpf ? "PPF Calculator" : "EPF Calculator";
  return (
    <CalculatorLayout
      title={title}
      subtitle={`Estimate long-term ${isPpf ? "PPF" : "EPF"} accumulation using an assumed contribution and rate.`}
      summary={[
        ["Total contribution", inr(result.invested)],
        ["Estimated growth", inr(result.maturity - result.invested)],
        ["Estimated maturity", inr(result.maturity), "success"],
      ]}
      methodology={[
        "Uses annual contributions and annual compounding for a planning illustration.",
        "Actual credited rates, contribution timing, rules and tax treatment may change.",
        "This estimate is not a government or employer account statement.",
      ]}
      chart={
        <BreakupChart
          invested={result.invested}
          gains={result.maturity - result.invested}
          investedLabel="Contribution"
          gainsLabel="Growth"
        />
      }
      context={`${title}: annual contribution ${inr(contribution)}, ${years} years, assumed rate ${rate}%.`}
    >
      <Control
        label="Annual contribution"
        value={inr(contribution)}
        min={12000}
        max={isPpf ? 150000 : 500000}
        step={1000}
        v={contribution}
        setV={setContribution}
      />
      <Control
        label="Investment period"
        value={`${years} years`}
        min={5}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Assumed interest rate"
        value={`${rate}% p.a.`}
        min={4}
        max={12}
        step={0.05}
        v={rate}
        setV={setRate}
      />
    </CalculatorLayout>
  );
}

function HlvCalculator() {
  const [income, setIncome] = useState(1200000);
  const [expenses, setExpenses] = useState(500000);
  const [years, setYears] = useState(25);
  const [liabilities, setLiabilities] = useState(2000000);
  const value = Math.max(0, (income - expenses) * years + liabilities);
  return (
    <CalculatorLayout
      title="Human Life Value Calculator"
      subtitle="Estimate an indicative life-insurance requirement from income support and liabilities."
      summary={[
        ["Annual family contribution", inr(income - expenses)],
        ["Outstanding liabilities", inr(liabilities)],
        ["Indicative life cover", inr(value), "bold"],
      ]}
      methodology={[
        "Uses a simplified income-replacement approach plus declared liabilities.",
        "Does not account for every asset, dependant need, inflation or existing insurance policy.",
        "Use this only as a starting estimate and review protection needs professionally.",
      ]}
      chart={
        <BreakupChart
          invested={Math.max(0, income - expenses) * years}
          gains={liabilities}
          investedLabel="Income replacement"
          gainsLabel="Liabilities"
        />
      }
      context={`HLV: income ${inr(income)}, personal expenses ${inr(expenses)}, support ${years} years, liabilities ${inr(liabilities)}.`}
    >
      <Control
        label="Annual income"
        value={inr(income)}
        min={200000}
        max={10000000}
        step={50000}
        v={income}
        setV={setIncome}
      />
      <Control
        label="Annual personal expenses"
        value={inr(expenses)}
        min={0}
        max={5000000}
        step={25000}
        v={expenses}
        setV={setExpenses}
      />
      <Control
        label="Years of income support"
        value={`${years} years`}
        min={5}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
      <Control
        label="Outstanding liabilities"
        value={inr(liabilities)}
        min={0}
        max={50000000}
        step={100000}
        v={liabilities}
        setV={setLiabilities}
      />
    </CalculatorLayout>
  );
}

function StpCalculator() {
  const [initial, setInitial] = useState(1000000);
  const [transfer, setTransfer] = useState(50000);
  const [months, setMonths] = useState(12);
  const transferred = Math.min(initial, transfer * months);
  const remaining = Math.max(0, initial - transferred);
  return (
    <CalculatorLayout
      title="STP Calculator"
      subtitle="Plan periodic transfers from one mutual fund category to another."
      summary={[
        ["Total scheduled transfer", inr(transferred), "bold"],
        ["Estimated source balance", inr(remaining)],
        ["Number of transfers", `${Math.min(months, Math.ceil(initial / transfer))}`, "success"],
      ]}
      methodology={[
        "Shows scheduled transfers without assuming returns in either source or destination scheme.",
        "Actual balances vary with NAV movement, exit loads and taxes.",
        "An STP does not remove market-timing or capital-loss risk.",
      ]}
      chart={
        <BreakupChart
          invested={transferred}
          gains={remaining}
          investedLabel="Transferred"
          gainsLabel="Remaining"
        />
      }
      context={`STP: initial ${inr(initial)}, transfer ${inr(transfer)} monthly for ${months} months.`}
    >
      <Control
        label="Initial amount"
        value={inr(initial)}
        min={100000}
        max={10000000}
        step={50000}
        v={initial}
        setV={setInitial}
      />
      <Control
        label="Monthly transfer"
        value={inr(transfer)}
        min={1000}
        max={500000}
        step={1000}
        v={transfer}
        setV={setTransfer}
      />
      <Control
        label="Transfer period"
        value={`${months} months`}
        min={1}
        max={60}
        step={1}
        v={months}
        setV={setMonths}
      />
    </CalculatorLayout>
  );
}

function RealReturnCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [nominal, setNominal] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(10);
  const realRate = ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
  const future = amount * Math.pow(1 + nominal / 100, years);
  const todayValue = future / Math.pow(1 + inflation / 100, years);
  return (
    <CalculatorLayout
      title="Real Return Calculator"
      subtitle="See how inflation changes the purchasing power of an investment return."
      summary={[
        ["Nominal future value", inr(future)],
        ["Inflation-adjusted value", inr(todayValue), "bold"],
        ["Estimated real return", `${realRate.toFixed(2)}% p.a.`, "success"],
      ]}
      methodology={[
        "Real return is calculated as (1 + nominal return) / (1 + inflation) − 1.",
        "Both return and inflation inputs are assumptions and can differ materially in practice.",
        "Taxes, costs and cash-flow timing are excluded.",
      ]}
      chart={
        <BreakupChart
          invested={todayValue}
          gains={future - todayValue}
          investedLabel="Real value"
          gainsLabel="Inflation effect"
        />
      }
      context={`Real return: ${inr(amount)}, nominal ${nominal}%, inflation ${inflation}%, ${years} years.`}
    >
      <Control
        label="Starting investment"
        value={inr(amount)}
        min={10000}
        max={10000000}
        step={10000}
        v={amount}
        setV={setAmount}
      />
      <Control
        label="Expected nominal return"
        value={`${nominal}% p.a.`}
        min={1}
        max={25}
        step={0.5}
        v={nominal}
        setV={setNominal}
      />
      <Control
        label="Expected inflation"
        value={`${inflation}% p.a.`}
        min={1}
        max={15}
        step={0.5}
        v={inflation}
        setV={setInflation}
      />
      <Control
        label="Period"
        value={`${years} years`}
        min={1}
        max={40}
        step={1}
        v={years}
        setV={setYears}
      />
    </CalculatorLayout>
  );
}

function EmiCalculator({
  title,
  defaultPrincipal = 3000000,
  defaultYears = 20,
  defaultRate = 8.5,
}: {
  title: string;
  defaultPrincipal?: number;
  defaultYears?: number;
  defaultRate?: number;
}) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [years, setYears] = useState(defaultYears);
  const [rate, setRate] = useState(defaultRate);

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
      title={title}
      subtitle="Calculate monthly loan EMI and total interest outgo."
      summary={[
        ["Monthly EMI", inr(result.emi), "bold"],
        ["Total interest", inr(result.interest)],
        ["Total payment", inr(result.total), "success"],
      ]}
      methodology={[
        "Uses the standard reducing-balance EMI formula with monthly compounding.",
        "Assumes interest rate and tenure remain unchanged through the loan period.",
        "Does not include processing fees, insurance, prepayment charges or floating-rate resets.",
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
      methodology={[
        "Inflates current monthly expenses until retirement, then estimates a 25-year retirement corpus.",
        "Corpus is calculated with real return: investment return adjusted for inflation.",
        "Required SIP uses monthly compounding until retirement and should be reviewed with risk profiling.",
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
      methodology={[
        "Adds declared assets and subtracts declared liabilities to estimate net worth.",
        "Property and investments should be updated using realistic current market values.",
        "This is a snapshot only and does not assess liquidity, tax impact or risk concentration.",
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
  methodology,
  chart,
  context,
  children,
}: {
  title: string;
  subtitle: string;
  summary: SummaryItem[];
  methodology: string[];
  chart: React.ReactNode;
  context: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6 lg:col-span-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 rounded-2xl border border-border bg-secondary p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Info className="h-4 w-4 text-primary" />
            Calculation basis
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
            {methodology.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6 lg:col-span-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.map(([label, value, tone]) => (
              <div key={label} className="rounded-2xl border border-border bg-secondary p-4">
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
          <p className="mt-4 rounded-2xl border border-border bg-secondary p-3 text-xs leading-5 text-muted-foreground">
            SEBI investor guidance emphasizes understanding risks, charges and suitability before
            investing. This calculator is an educational planning aid and does not guarantee
            returns.
          </p>
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
      className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
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
        <div className="mt-5 rounded-3xl border border-success/30 bg-secondary p-5">
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
          <div className="mt-4 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
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
          <div className="mt-5 rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
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
  const decimals = step < 1 ? 1 : 0;
  const inputValue = Number.isInteger(v) ? v.toString() : v.toFixed(decimals);
  const sanitize = (rawValue: string) => {
    const next = Number(rawValue.replace(/[^\d.]/g, ""));

    if (!Number.isFinite(next)) {
      setV(min);
      return;
    }

    setV(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {value}
        </span>
      </div>
      <Input
        className="mt-3 h-10"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={inputValue}
        onChange={(event) => sanitize(event.target.value)}
        aria-label={`${label} exact value`}
      />
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
