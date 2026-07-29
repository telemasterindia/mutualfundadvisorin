import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, FileWarning, Scale } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Risk Disclaimer & Disclosures | WealthMaster India",
  description:
    "Important mutual fund risk, distributor role, performance, cost, commission and website disclosures.",
};

const disclosures = [
  {
    title: "Market and investment risk",
    paragraphs: [
      "Mutual fund units are market-linked investments. Their Net Asset Value may rise or fall because of equity-market movements, interest-rate changes, credit events, liquidity conditions, currency movements, issuer-specific developments and other economic or market factors. Loss of part or all of the invested capital is possible.",
      "Mutual Fund Schemes do not assure or guarantee returns unless a guarantee is expressly structured and disclosed in the applicable scheme documents. There is no assurance that a scheme’s investment objective will be achieved.",
    ],
  },
  {
    title: "Past performance and illustrations",
    paragraphs: [
      "Past performance may or may not be sustained in the future and is not a guarantee or reliable indicator of future results. Historical returns, rankings, ratings and comparisons can change and should not be the sole basis for an investment decision.",
      "Calculator results, projections, expected-return assumptions and examples on this website are illustrative only. They do not represent promised returns, actual scheme performance or an offer to provide any assured outcome.",
    ],
  },
  {
    title: "Our role as a distributor",
    paragraphs: [
      "WealthMaster India acts as an AMFI-Registered Mutual Fund Distributor (ARN 349461). Our role is mutual fund distribution and related educational or transaction-support services. Registration with AMFI does not imply that AMFI or SEBI approves, recommends or guarantees any scheme, service, return or representation made on this website.",
      "Website content is general information and does not constitute legal, tax, accounting or individualized investment advice. Investors should independently evaluate suitability and consult appropriately qualified professionals where required.",
    ],
  },
  {
    title: "Regular Plans, Direct Plans and commission",
    paragraphs: [
      "We deal in Regular Plans of Mutual Fund Schemes and may receive trailing commission from Asset Management Companies on investments mobilized through us. Applicable commission disclosures are made to clients in accordance with prevailing requirements.",
      "Direct Plans are available directly from mutual funds and have a lower expense ratio because distribution expenses and distributor commission are excluded. We do not receive commission on Direct Plans and do not facilitate investments in Direct Plans.",
    ],
  },
  {
    title: "Costs, loads and taxes",
    paragraphs: [
      "Before investing, investors should review the Scheme Information Document, Key Information Memorandum, Statement of Additional Information, latest factsheet and addenda, including the Total Expense Ratio, exit load, risk-o-meter, portfolio, benchmark and applicable transaction terms.",
      "Tax treatment depends on the investor’s circumstances and prevailing law and may change. Nothing on this website is tax advice. Investors should consult a tax professional when necessary.",
    ],
  },
  {
    title: "Suitability and investor responsibility",
    paragraphs: [
      "An investment decision should consider the investor’s objectives, financial position, time horizon, liquidity needs, knowledge, experience and ability to bear loss. Scheme categories or educational suggestions shown on this website are not automatic recommendations to buy, hold or sell any particular scheme.",
      "Investors are responsible for reviewing application details, nominee information, bank details, statements, transaction confirmations and scheme documents, and for keeping their credentials, OTPs and account access secure.",
    ],
  },
  {
    title: "Third-party information and links",
    paragraphs: [
      "NAVs, market prices, news, ratings, scheme data and other third-party information may be delayed, incomplete or subject to revision. While reasonable care is taken, WealthMaster India does not warrant that third-party information is always complete, current or error-free.",
      "Links to external websites are provided for convenience. Their content, availability, security and privacy practices are controlled by their respective operators.",
    ],
  },
  {
    title: "No offer or guarantee",
    paragraphs: [
      "Nothing on this website is an offer, solicitation or invitation to buy or sell a security in a jurisdiction where such activity would be unlawful. Product availability and eligibility may depend on applicable law, investor status and the policies of the relevant AMC or intermediary.",
      "To the extent permitted by law, WealthMaster India is not responsible for losses arising solely from market movements, investor decisions, third-party systems, inaccurate information supplied by a user or events beyond reasonable control. Nothing in this disclaimer excludes liability that cannot lawfully be excluded.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-[2rem] border border-amber-400/25 bg-gradient-to-br from-amber-500/10 via-card/85 to-primary/10 p-7 shadow-soft sm:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <FileWarning className="h-6 w-6" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            Important investor information
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Risk Disclaimer &amp; Disclosures
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Please read these disclosures together with the documents issued by the relevant Asset
            Management Company before making an investment decision.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-400/35 bg-amber-50/80 p-6 text-center shadow-soft dark:bg-amber-950/30 sm:p-8">
          <p className="text-base font-bold leading-7 text-amber-950 dark:text-amber-50 sm:text-lg">
            Mutual Fund investments are subject to market risks, read all scheme related documents
            carefully.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
          <article className="space-y-4">
            {disclosures.map((disclosure, index) => (
              <section
                key={disclosure.title}
                className="rounded-3xl border border-border/70 bg-card/75 p-6 shadow-soft sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold">{disclosure.title}</h2>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                      {disclosure.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </article>

          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-success/25 bg-success/10 p-6">
              <BadgeCheck className="h-6 w-6 text-success" />
              <h2 className="mt-4 font-display text-lg font-bold">Distributor details</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                WealthMaster India
                <br />
                AMFI ARN: 349461
                <br />
                Mutual Fund Distributor
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-soft">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-lg font-bold">Need clarification?</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Contact us before investing if you need help locating or understanding applicable
                scheme documents and disclosures.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                Contact WealthMaster India →
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
