import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { CONTACT, waLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "AMFI-Registered Mutual Fund Distributor in Delhi | WealthMaster India",
  description:
    "Meet an AMFI-registered Mutual Fund Distributor in Rajouri Garden, Delhi for SIP and mutual fund distribution assistance. Regular Plans. ARN 349461.",
  alternates: { canonical: "/mutual-fund-distributor-delhi" },
  openGraph: {
    title: "AMFI-Registered Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "Mutual fund distribution and SIP assistance from Rajouri Garden, Delhi. Regular Plans. ARN 349461.",
    url: "/mutual-fund-distributor-delhi",
  },
};

const areas = [
  "Rajouri Garden",
  "Janakpuri",
  "Punjabi Bagh",
  "Paschim Vihar",
  "Dwarka",
  "Tilak Nagar",
  "Patel Nagar",
  "Kirti Nagar",
  "West Delhi",
];

const faqs = [
  {
    question: "What does a Mutual Fund Distributor do?",
    answer:
      "A distributor explains mutual fund options and processes, assists with transactions and ongoing service, and may receive commission from AMCs on Regular Plan investments.",
  },
  {
    question: "Do you offer Direct Plans?",
    answer:
      "No. WealthMaster India deals in Regular Plans. Direct Plans are available directly from mutual funds and have a lower expense ratio because distributor commission is excluded.",
  },
  {
    question: "Are mutual fund returns guaranteed?",
    answer:
      "No. Mutual funds are market-linked and returns are not guaranteed. Review the scheme documents, risks, costs and suitability before investing.",
  },
  {
    question: "What should I bring to an initial consultation?",
    answer:
      "Bring your questions, goals and an idea of your time horizon. Do not send PAN, Aadhaar, passwords, OTPs or account credentials through the general contact form.",
  },
];

export default function DelhiDistributorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "WealthMaster India",
    url: "https://www.mutualfundadvisor.in/mutual-fund-distributor-delhi",
    telephone: "+91-9999252122",
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Q-14, Rajouri Garden",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110027",
      addressCountry: "IN",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Delhi" },
    founder: {
      "@type": "Person",
      name: "Amit Chadha",
      jobTitle: "Mutual Fund Distributor",
      worksFor: { "@type": "Organization", name: "WealthMaster India" },
    },
    openingHours: "Mo-Sa 09:00-18:00",
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <section className="border-b border-border/60 bg-secondary/25">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              AMFI-Registered Mutual Fund Distributor | ARN 349461
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-6xl">
              Mutual Fund Distributor in Delhi
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              WealthMaster India provides mutual fund distribution, SIP assistance and investor
              education from {CONTACT.address}. We explain available options, costs and risks before
              helping with a transaction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book-consultation">
                <Button size="lg" className="rounded-full">
                  Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={CONTACT.telHref}>
                <Button size="lg" variant="outline" className="rounded-full">
                  <Phone className="mr-2 h-4 w-4" /> {CONTACT.phone}
                </Button>
              </a>
              <a
                href={waLink("Hi WealthMaster India, I would like to discuss mutual funds.")}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="lg" variant="outline" className="rounded-full">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-14 px-4 py-16 sm:px-6">
          <section className="grid gap-6 md:grid-cols-3">
            {[
              [
                "Understand",
                "Discuss goals, time horizon, liquidity needs and mutual fund basics.",
              ],
              ["Explore", "Review relevant categories, plan types, costs and material risks."],
              [
                "Proceed",
                "Receive SIP or lump-sum transaction assistance if you choose to invest.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-border bg-card p-7">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">How we support investors</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Our role includes investor education, explaining mutual fund categories and
                scheme-related documents, and assisting with SIP and lump-sum transactions. Any
                goal-based illustrations use assumptions and are not return promises.
              </p>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7">
              <h2 className="font-display text-2xl font-bold">Regular Plans and Direct Plans</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                WealthMaster India deals in Regular Plans and may receive commission from Asset
                Management Companies. Direct Plans are purchased directly from mutual funds and
                generally have a lower expense ratio because distributor commission is excluded.
              </p>
              <Link
                href="/learn/direct-vs-regular-mutual-funds"
                className="mt-4 inline-flex font-semibold text-primary hover:underline"
              >
                Understand the difference
              </Link>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold">About Amit Chadha</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Amit Chadha is Founder and Mutual Fund Distributor at WealthMaster India. The business
              operates as an AMFI-Registered Mutual Fund Distributor under ARN 349461. This website
              does not represent WealthMaster India as a SEBI-registered Investment Adviser.
            </p>
            <a
              href="https://www.amfiindia.com/locate-distributor"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex font-semibold text-primary hover:underline"
            >
              AMFI distributor verification
            </a>
          </section>

          <section className="rounded-3xl border border-border bg-secondary/30 p-8">
            <MapPin className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-bold">Rajouri Garden office</h2>
            <address className="mt-4 not-italic leading-7 text-muted-foreground">
              {CONTACT.address}
              <br />
              {CONTACT.hours}
            </address>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              We serve investors across {areas.slice(0, -1).join(", ")} and {areas.at(-1)}. Remote
              conversations are also available.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
            <h2 className="font-display text-3xl font-bold">Contact WealthMaster India</h2>
            <p className="mt-3 max-w-3xl leading-7 opacity-90">
              Book a consultation or use our contact form. Do not send PAN, Aadhaar, passwords, OTPs
              or account credentials through a general enquiry.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="mt-6 rounded-full">
                Open contact form
              </Button>
            </Link>
          </section>

          <p className="text-sm leading-7 text-muted-foreground">
            WealthMaster India acts as an AMFI-Registered Mutual Fund Distributor and deals in
            Regular Plans of mutual fund schemes. We are not a SEBI-registered Investment Adviser.
            Mutual fund investments are subject to market risks. Read all scheme-related documents
            carefully. Regular Plans may involve commission paid by AMCs to the distributor.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
