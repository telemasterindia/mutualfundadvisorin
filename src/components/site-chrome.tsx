"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Calculator,
  Target,
  PiggyBank,
  Home,
  CalendarClock,
  Wallet,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/funds", label: "Mutual Funds" },
  { to: "/calculator", label: "Calculators" },
  { to: "/learn", label: "Learn" },
  { to: "/mutual-fund-distributor-delhi", label: "Delhi Distributor" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const isActiveRoute = (path: string, target: string) =>
  path === target || (target !== "/" && path.startsWith(`${target}/`));

const toolLinks = [
  {
    href: "/calculator#sip",
    label: "SIP Calculator",
    description: "Monthly investment growth",
    icon: TrendingUp,
  },
  {
    href: "/calculator#goal-sip",
    label: "Goal SIP",
    description: "SIP needed for a target",
    icon: Target,
  },
  {
    href: "/calculator#lumpsum",
    label: "Lumpsum",
    description: "Future value of one-time investment",
    icon: PiggyBank,
  },
  {
    href: "/calculator#emi",
    label: "EMI Calculator",
    description: "Loan EMI and interest outgo",
    icon: Home,
  },
  {
    href: "/calculator#retirement",
    label: "Retirement",
    description: "Corpus and retirement SIP",
    icon: CalendarClock,
  },
  {
    href: "/calculator#net-worth",
    label: "Net Worth",
    description: "Assets minus liabilities",
    icon: Wallet,
  },
];

function ToolsMenu({ active }: { active: boolean }) {
  return (
    <div className="group relative">
      <Link
        href="/calculator"
        prefetch={false}
        className="relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {active && <span className="absolute inset-0 rounded-full bg-secondary" />}
        <span className={`relative z-10 ${active ? "text-foreground" : ""}`}>Tools</span>
        <ChevronDown className="relative z-10 h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </Link>

      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="rounded-3xl border border-border bg-popover p-3 shadow-elegant">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {toolLinks.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  prefetch={false}
                  className="group/item flex items-start gap-3 rounded-2xl p-3 transition hover:bg-secondary"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover/item:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {tool.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {tool.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/calculator"
            prefetch={false}
            className="mt-2 flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
          >
            View all financial planning tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-1 pt-1 sm:px-4 sm:pt-4">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-background px-4 py-3 font-semibold text-foreground shadow-lg focus:not-sr-only"
      >
        Skip to main content
      </a>
      <div
        style={{ maxWidth: scrolled ? 1100 : 1280 }}
        className={`mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-strong border border-border/60 shadow-soft"
            : "border border-border/60 bg-card/95 shadow-soft backdrop-blur-md"
        }`}
      >
        <div className="flex h-14 min-w-0 items-center justify-between gap-2 px-3 sm:h-16 sm:px-5">
          <Link
            href="/"
            prefetch={false}
            className="flex min-w-0 items-center gap-2 font-display text-base font-bold sm:text-lg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-bg shadow-glow">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="truncate max-[380px]:hidden">WealthMaster India</span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => {
              const active = isActiveRoute(path, n.to);
              return (
                <Link
                  key={n.to}
                  href={n.to}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {active && <span className="absolute inset-0 rounded-full bg-secondary" />}
                  <span className={`relative z-10 ${active ? "text-foreground" : ""}`}>
                    {n.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-full h-9 w-9"
            >
              <span className="grid place-items-center">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </span>
            </Button>
            <Link href="/book-consultation" prefetch={false} className="hidden sm:block">
              <Button
                size="sm"
                className="rounded-full gradient-bg text-primary-foreground hover:opacity-95 shadow-glow"
              >
                Book Free Consultation
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="overflow-hidden border-t border-border/60 lg:hidden">
            <div className="flex flex-col gap-0.5 px-3 py-3">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  href={n.to}
                  prefetch={false}
                  aria-current={isActiveRoute(path, n.to) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActiveRoute(path, n.to)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <div className="hidden rounded-2xl border border-border/70 bg-secondary/20 p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calculator className="h-3.5 w-3.5 text-primary" /> Tools & calculators
                </div>
                <div className="mt-1 grid gap-1">
                  {toolLinks.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        prefetch={false}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {tool.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              {[].map((n: { to: string; label: string }) => (
                <Link
                  key={n.to}
                  href={n.to}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    path === n.to ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-2">
                <Link href="/book-consultation" prefetch={false} onClick={() => setOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full rounded-xl gradient-bg text-primary-foreground"
                  >
                    Book Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      aria-label="WealthMaster India site footer"
      className="relative mt-20 overflow-hidden border-t border-border/60 bg-card/80 sm:mt-32"
    >
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background/80 to-success/10 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Clear guidance. Transparent process.
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Build your investment plan with confidence.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Speak directly with Amit Chadha about your goals and mutual fund questions.
            </p>
          </div>
          <Link href="/book-consultation" prefetch={false} className="shrink-0">
            <Button className="h-11 rounded-full px-6 gradient-bg text-primary-foreground shadow-glow">
              Book Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl gradient-bg">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </span>
              WealthMaster India
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              WealthMaster India provides mutual fund education, planning tools and distribution
              support through an AMFI-registered Mutual Fund Distributor in Delhi.
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-xs leading-relaxed">
              <BadgeCheck className="h-5 w-5 shrink-0 text-success" />
              <div>
                <div className="font-semibold text-foreground">
                  AMFI-Registered Mutual Fund Distributor
                </div>
                <div className="mt-0.5 text-muted-foreground">ARN: 349461</div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">Amit Chadha</div>
              <div className="text-xs">Founder &amp; Mutual Fund Distributor</div>
              <a href="tel:+919999252122" className="block transition-colors hover:text-foreground">
                +91 99992 52122
              </a>
              <a
                href="mailto:contact@wealthmasterindia.in"
                className="block transition-colors hover:text-foreground"
              >
                contact@wealthmasterindia.in
              </a>
              <div className="text-xs">Q-14, Rajouri Garden, New Delhi-110027</div>
            </div>
          </div>
          {[
            {
              title: "Solutions",
              links: [
                ["Mutual Funds", "/funds"],
                ["SIP Calculator", "/calculator"],
                ["Learn", "/learn"],
              ],
            },
            {
              title: "Company",
              links: [
                ["About", "/about"],
                ["Amit Chadha", "/about/amit-chadha"],
                ["Delhi Distributor", "/mutual-fund-distributor-delhi"],
                ["Contact", "/contact"],
                ["Book Consultation", "/book-consultation"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Editorial Policy", "/editorial-policy"],
                ["Risk Disclaimer", "/disclaimer"],
                ["Privacy Policy", "/privacy"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em]">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h as string}
                      prefetch={false}
                      className="inline-flex transition hover:translate-x-0.5 hover:text-primary"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} WealthMaster India · Mutual Fund Education &amp;
            Distribution Support
          </p>
        </div>
      </div>
    </footer>
  );
}
