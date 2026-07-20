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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/funds", label: "Mutual Funds" },
  { to: "/calculator", label: "Calculators" },
  { to: "/learn", label: "Learn" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

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
    <header className="sticky top-0 z-50 w-full px-2 pt-2 sm:px-4 sm:pt-4">
      <div
        style={{ maxWidth: scrolled ? 1100 : 1280 }}
        className={`mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-strong border border-border/60 shadow-soft"
            : "border border-border/60 bg-card/95 shadow-soft backdrop-blur-md"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-5">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2 font-display text-base font-bold sm:text-lg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-bg shadow-glow">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </span>
            <span>WealthMaster India</span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  href={n.to}
                  prefetch={false}
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

          <div className="flex items-center gap-1.5">
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
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    path === n.to ? "bg-secondary text-foreground" : "text-muted-foreground"
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
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl gradient-bg">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </span>
              WealthMaster India
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Mutual fund education, planning tools and distribution support for Indian investors.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">Amit Chadha</div>
              <div className="text-xs">Founder &amp; Investment Advisor</div>
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
                ["Contact", "/contact"],
                ["Book Consultation", "/book-consultation"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Privacy Policy", "#"],
                ["Terms of Use", "#"],
                ["Disclosures", "#"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold tracking-wide">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h as string}
                      prefetch={false}
                      className="transition-colors hover:text-foreground"
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
          <p>
            Mutual fund investments are subject to market risks. Read all scheme-related documents
            carefully. Past performance is not indicative of future returns. Insurance, PMS, AIF and
            NCD products are offered through duly licensed partner intermediaries.
          </p>
          <p className="mt-2" suppressHydrationWarning>
            © {new Date().getFullYear()} WealthMaster India · Mutual Fund Education &amp;
            Distribution Support
          </p>
        </div>
      </div>
    </footer>
  );
}
