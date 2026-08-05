import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Editorial Policy | WealthMaster India",
  description:
    "How WealthMaster India writes, reviews, sources, corrects and updates investor education content.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | WealthMaster India",
    description: "Our standards for accurate, transparent mutual fund education content.",
    url: "/editorial-policy",
    images: ["/wealthmaster-india-og.png"],
  },
};

const sections = [
  [
    "Who writes and reviews",
    "Educational content is written or reviewed by Amit Chadha, Founder & Mutual Fund Distributor, WealthMaster India (AMFI ARN 349461). The named author and reviewer are shown on each article.",
  ],
  [
    "Sources and fact-checking",
    "We prioritize current material from AMFI, SEBI, Asset Management Companies, scheme documents and other official sources. Material claims are checked against those sources before publication.",
  ],
  [
    "Updates and corrections",
    "Publication and genuine modification dates appear on articles. We update content when rules, official guidance or scheme-document conventions materially change. Confirmed errors are corrected promptly and substantive corrections are reflected in the modification date.",
  ],
  [
    "Educational limitation",
    "Content is general investor education, not individualized investment, legal or tax advice. We do not promise or imply guaranteed or assured returns and do not present rankings without a transparent methodology.",
  ],
  [
    "AI assistance",
    "AI tools may assist with outlining, editing or quality checks. A human reviewer remains responsible for factual review, compliant wording, sources and the final published content.",
  ],
];

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Editorial Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: 5 August 2026</p>
        <div className="mt-10 space-y-10">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="font-display text-2xl font-bold">{title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          Questions or correction requests can be sent through our{" "}
          <Link className="text-primary underline" href="/contact">
            contact page
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
