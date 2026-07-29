"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/lib/theme";

const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

const toastRoutes = [
  "/admin",
  "/auth/callback",
  "/book-consultation",
  "/calculator",
  "/contact",
  "/get-started",
  "/login",
  "/onboarding",
  "/reset-password",
  "/signup",
];

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsToaster = toastRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return (
    <ThemeProvider>
      {children}
      {pathname !== "/disclaimer" && (
        <section
          aria-labelledby="risk-factors-heading"
          className="border-t border-border/60 bg-card/70 px-4 py-8 backdrop-blur-sm sm:px-6"
        >
          <div className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-background/80 p-4 shadow-soft sm:p-6">
            <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
              <strong id="risk-factors-heading" className="text-foreground">
                Risk Factors &ndash;
              </strong>{" "}
              Investments in Mutual Funds are subject to Market Risks. Read all scheme-related
              documents carefully before investing. Mutual Fund Schemes do not assure or guarantee
              any returns. Past performance of any Mutual Fund Scheme may or may not be sustained in
              the future. There is no guarantee that the investment objective of any suggested
              scheme will be achieved. All existing and prospective investors are advised to check
              and evaluate the exit loads and other cost structure (TER) applicable at the time of
              making an investment before finalizing any investment decision for Mutual Fund
              Schemes. We deal in Regular Plans only for Mutual Fund Schemes and earn a trailing
              commission on client investments. Disclosure of commission earnings is made to clients
              at the time of investment. The option of a Direct Plan for every Mutual Fund Scheme is
              available to investors and offers the advantage of a lower expense ratio. We are not
              entitled to earn any commission on Direct Plans; hence, we do not deal in Direct
              Plans.
            </p>
          </div>
        </section>
      )}
      {needsToaster && <Toaster />}
    </ThemeProvider>
  );
}
