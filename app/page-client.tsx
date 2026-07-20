import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  IndianRupee,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";

const articles = [
  {
    slug: "what-is-a-mutual-fund",
    category: "Mutual fund basics",
    title: "What Is a Mutual Fund and How Does It Work?",
    description:
      "Understand pooling, units, NAV, fund categories, costs and market risk in plain language.",
  },
  {
    slug: "sip-vs-lump-sum",
    category: "Ways to invest",
    title: "SIP vs Lump Sum: Which Approach Should You Consider?",
    description:
      "Compare regular investing and one-time investing without treating either route as universally better.",
  },
  {
    slug: "direct-vs-regular-mutual-funds",
    category: "Plan types",
    title: "Direct vs Regular Mutual Funds: Understanding the Difference",
    description:
      "Learn how the two plans differ in distribution, expense ratios and the support available to investors.",
  },
];

const faqs = [
  {
    q: "What happens during the free consultation?",
    a: "We discuss your goals, time horizon, familiarity with mutual funds and questions. The conversation is educational and does not promise or guarantee returns.",
  },
  {
    q: "Do mutual funds guarantee returns?",
    a: "No. Mutual fund returns are market-linked and can rise or fall. Read all scheme-related documents and consider suitability before investing.",
  },
  {
    q: "What is the difference between SIP and lump sum?",
    a: "A SIP invests an amount at regular intervals, while a lump sum is invested at one time. The suitable route depends on cash flow, goals, time horizon and risk tolerance.",
  },
  {
    q: "How is a Mutual Fund Distributor compensated?",
    a: "Regular plans may pay a commission to the distributor from the scheme's expenses. The applicable commission disclosure will be shared transparently before you proceed.",
  },
  {
    q: "Is the consultation private?",
    a: "Information shared for the consultation is handled confidentially and used to respond to your request. Avoid sending passwords, OTPs or other account credentials.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <Options />
      <Learning />
      <Expectations />
      <FAQ />
      <FinalCTA />
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
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
              Mutual fund education and distribution support
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Understand mutual funds before you <span className="gradient-text">invest.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Learn the basics, calculate your goals and explore your options—with guidance when you
              need it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/learn">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-6">
                  Start learning
                </Button>
              </Link>
              <Link href="/book-consultation">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-6 gradient-bg text-primary-foreground shadow-glow"
                >
                  Book free consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-xs text-muted-foreground">
              Mutual fund investments are subject to market risks. Read all scheme-related documents
              carefully.
            </p>
          </div>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const steps = [
    { icon: BookOpen, label: "Learn the basics", done: true },
    { icon: Calculator, label: "Calculate a goal", done: true },
    { icon: WalletCards, label: "Compare options", done: false },
    { icon: UserRound, label: "Speak with us", done: false },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl" />
      <div className="glass rounded-[2rem] p-5 shadow-elegant sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Your learning path
            </div>
            <div className="mt-1 font-display text-xl font-bold">Invest with understanding</div>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-bg text-primary-foreground shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {steps.map(({ icon: Icon, label, done }, index) => (
            <div
              key={label}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${done ? "border-primary/20 bg-primary/5" : "border-border/70 bg-secondary/30"}`}
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${done ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {index + 1}
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
              {done && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/50 p-4">
            <IndianRupee className="h-4 w-4 text-primary" />
            <div className="mt-2 text-xs text-muted-foreground">Planning tools</div>
            <div className="text-lg font-bold">6 calculators</div>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <div className="mt-2 text-xs text-muted-foreground">Start here</div>
            <div className="text-lg font-bold">3 guides</div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -right-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft sm:-right-6">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <LockKeyhole className="h-4 w-4 text-primary" /> Confidential consultation
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    { icon: MapPin, title: "Physical office", body: CONTACT.address },
    {
      icon: LockKeyhole,
      title: "Confidential conversation",
      body: "Consultation information is handled privately.",
    },
    {
      icon: Scale,
      title: "Commission transparency",
      body: "Regular-plan commission disclosures are shared before proceeding.",
    },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <Icon className="h-5 w-5 text-primary" />
            <div className="mt-3 text-sm font-semibold">{title}</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Options() {
  return (
    <Section eyebrow="Understand your options" title="Explore without sales pressure.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-2xl font-bold">Mutual fund categories</h3>
          <p className="mt-3 leading-7 text-muted-foreground">
            Browse fresh AMFI NAV information and learn how equity, debt, hybrid and other
            categories differ. A category or scheme is not a recommendation by itself.
          </p>
          <Link href="/funds">
            <Button className="mt-6 rounded-full" variant="outline">
              Explore mutual funds <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-2xl font-bold">Planning calculators</h3>
          <p className="mt-3 leading-7 text-muted-foreground">
            Use SIP, goal, lump-sum, EMI, retirement and net-worth tools. Results are illustrations
            based on your assumptions—not forecasts or guaranteed returns.
          </p>
          <Link href="/calculator">
            <Button className="mt-6 rounded-full" variant="outline">
              Open calculators <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

function Learning() {
  return (
    <Section eyebrow="Recommended reading" title="Start with the essentials.">
      <div className="grid gap-5 lg:grid-cols-3">
        {articles.map((a) => (
          <article key={a.slug} className="glass flex flex-col rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {a.category}
            </div>
            <h3 className="mt-3 font-display text-xl font-bold">{a.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{a.description}</p>
            <Link
              href={`/learn/${a.slug}`}
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary"
            >
              Read article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/learn">
          <Button size="lg" variant="outline" className="rounded-full">
            View all learning resources
          </Button>
        </Link>
      </div>
    </Section>
  );
}

function Expectations() {
  const items = [
    [
      "A conversation that starts with your questions",
      "We first understand what you want to learn, your goals and your time horizon.",
    ],
    [
      "Clear explanations",
      "We explain common investment routes, categories, costs and risks in straightforward language.",
    ],
    [
      "Transparent service commitments",
      "We do not promise returns. Applicable regular-plan commission disclosures are shared before proceeding.",
    ],
  ];
  return (
    <Section eyebrow="What you can expect from us" title="A transparent, education-first process.">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
        Verified customer testimonials may be added later only with written permission and
        appropriate substantiation.
      </p>
    </Section>
  );
}

function FAQ() {
  return (
    <Section eyebrow="Frequently asked questions" title="Useful answers before you contact us.">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => (
          <details key={f.q} className="group glass rounded-2xl" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left [&::-webkit-details-marker]:hidden">
              <span className="font-medium">{f.q}</span>
              <Plus className="h-4 w-4 shrink-0 group-open:hidden" />
              <Minus className="hidden h-4 w-4 shrink-0 group-open:block" />
            </summary>
            <div className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{f.a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <div className="rounded-3xl gradient-bg p-8 text-center text-primary-foreground sm:p-12">
        <h2 className="font-display text-3xl font-bold">
          Ready to discuss your mutual fund questions?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm opacity-85">
          Book a free, confidential consultation. No guaranteed-return claims and no obligation to
          invest.
        </p>
        <Link href="/book-consultation">
          <Button size="lg" variant="secondary" className="mt-7 rounded-full">
            Book free consultation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
