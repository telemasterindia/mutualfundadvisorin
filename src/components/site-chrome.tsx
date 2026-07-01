import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, TrendingUp, Menu, X, ArrowRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/funds", label: "Explore" },
  { to: "/calculator", label: "SIP Calculator" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/book-consultation", label: "Book Consultation" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
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
      <motion.div
        initial={false}
        animate={{ maxWidth: scrolled ? 1100 : 1280 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className={`mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-strong border border-border/60 shadow-soft"
            : "border border-transparent bg-background/40 backdrop-blur-md"
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
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid place-items-center"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </Button>
            {user ? (
              <>
                <Link href="/dashboard" prefetch={false} className="hidden sm:block">
                  <Button
                    size="sm"
                    className="rounded-full gradient-bg text-primary-foreground hover:opacity-95 shadow-glow"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex rounded-full"
                  aria-label="Sign out"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" prefetch={false} className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" prefetch={false} className="hidden sm:block">
                  <Button
                    size="sm"
                    className="rounded-full gradient-bg text-primary-foreground hover:opacity-95 shadow-glow group"
                  >
                    Get started
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </>
            )}
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

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border/60 lg:hidden"
            >
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
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/login" prefetch={false} onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl">
                      Login
                    </Button>
                  </Link>
                  <Link href="/get-started" prefetch={false} onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full rounded-xl gradient-bg text-primary-foreground"
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
              Independent wealth advisory for Indian investors — Mutual Funds, SIPs, Insurance, PMS,
              AIF, NCDs and Retirement Planning.
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
                ["Portfolio", "/dashboard"],
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
              <h4 className="text-sm font-semibold tracking-wide">{col.title}</h4>
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
            Mutual fund investments are subject to market risks. Read all scheme related documents
            carefully. Past performance is not indicative of future returns. Insurance, PMS, AIF and
            NCD products are offered through duly licensed partner intermediaries.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} WealthMaster India · Independent Financial Services &amp;
            Wealth Advisory
          </p>
        </div>
      </div>
    </footer>
  );
}
