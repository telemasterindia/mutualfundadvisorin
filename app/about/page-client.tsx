"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, MapPin, Scale, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";

const services = [
  "Mutual fund distribution",
  "SIP and lump-sum assistance",
  "Goal-based planning support",
  "Retirement and ELSS guidance",
  "Portfolio-review assistance",
  "Investor education",
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            About us
          </div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Helping investors understand mutual funds and make informed decisions.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            WealthMaster India helps individuals understand mutual funds, plan for financial goals
            and connect with a Mutual Fund Distributor for investment assistance.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <InfoCard title="Who we are" icon={ShieldCheck}>
              <dl className="space-y-4 text-sm">
                <Row label="Brand name" value="WealthMaster India" />
                <Row label="Legal entity name" value="To be confirmed" pending />
                <Row label="Year established" value="To be confirmed" pending />
                <Row label="Office location" value={CONTACT.address} />
                <Row label="Customers served" value="To be confirmed" pending />
                <Row
                  label="ARN and validity"
                  value="Verification details to be published"
                  pending
                />
              </dl>
            </InfoCard>

            <InfoCard title="What we do" icon={BookOpen}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-6 text-muted-foreground">
                Our role is to explain options and assist with the investment process. Mutual fund
                investments remain subject to market risk.
              </p>
            </InfoCard>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Value
              icon={BookOpen}
              title="Education first"
              body="We explain concepts, categories, costs and risks before discussing next steps."
            />
            <Value
              icon={Scale}
              title="Transparent service"
              body="Regular-plan commission disclosures are shared before an investor proceeds."
            />
            <Value
              icon={MapPin}
              title="Accessible support"
              body={`Speak with us remotely or contact our physical office at ${CONTACT.address}.`}
            />
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-secondary/30 p-8 text-center sm:p-10">
            <h2 className="font-display text-3xl font-bold">Have questions about mutual funds?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Book a free, confidential conversation about the process, available options and
              questions you would like clarified.
            </p>
            <Link href="/book-consultation">
              <Button size="lg" className="mt-7 rounded-full gradient-bg text-primary-foreground">
                Book free consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-7 sm:p-8">
      <Icon className="h-7 w-7 text-primary" />
      <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, value, pending }: { label: string; value: string; pending?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right font-medium ${pending ? "text-muted-foreground" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function Value({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BookOpen;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}
