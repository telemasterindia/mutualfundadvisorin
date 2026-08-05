import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Amit Chadha | Mutual Fund Distributor, WealthMaster India",
  description:
    "Learn about Amit Chadha, Founder and Mutual Fund Distributor at WealthMaster India, associated with AMFI ARN 349461 in Delhi.",
  alternates: { canonical: "/about/amit-chadha" },
  openGraph: {
    title: "Amit Chadha | Mutual Fund Distributor",
    description: "Founder and Mutual Fund Distributor at WealthMaster India. AMFI ARN 349461.",
    url: "/about/amit-chadha",
    images: ["/wealthmaster-india-og.png"],
  },
};

export default function AmitChadhaPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Amit Chadha",
    jobTitle: "Mutual Fund Distributor",
    url: "https://www.mutualfundadvisor.in/about/amit-chadha",
    worksFor: { "@type": "Organization", name: "WealthMaster India" },
  };
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/about">About</Link>{" "}
          <span aria-hidden>/</span> <span aria-current="page">Amit Chadha</span>
        </nav>
        <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-primary">
          Author profile
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Amit Chadha</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Founder &amp; Mutual Fund Distributor, WealthMaster India
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">AMFI-Registered Mutual Fund Distributor · ARN 349461</p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Amit supports investors with mutual fund education, SIP and Regular Plan process
            assistance, documentation and service from Rajouri Garden, New Delhi. This profile
            intentionally excludes unverified qualifications, awards, assets under management and
            customer-count claims.
          </p>
          <a
            className="mt-5 inline-block font-semibold text-primary underline"
            href="https://www.amfiindia.com/distributor"
            rel="noreferrer"
          >
            Verify through AMFI distributor resources
          </a>
        </div>
        <h2 className="mt-12 font-display text-2xl font-bold">Articles written or reviewed</h2>
        <p className="mt-3 text-muted-foreground">
          Read Amit’s reviewed investor education material in the{" "}
          <Link className="text-primary underline" href="/learn">
            learning centre
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
