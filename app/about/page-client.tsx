"use client";
import { Award, Users, Shield, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          About WealthMaster India
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Trusted financial guidance for <span className="gradient-text">long-term</span> wealth.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          WealthMaster India is an independent financial services and wealth advisory platform
          focused on Mutual Funds, SIPs, Retirement Planning, Insurance, PMS, AIF, NCDs and
          long-term wealth creation for Indian investors. Founded by{" "}
          <strong className="text-foreground">Amit Chadha</strong>
          (Founder &amp; Investment Advisor), we combine seasoned human advisory with disciplined,
          goal-based planning — designed for both retail investors and HNIs.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Users} v="2.4M+" l="Investors guided" />
          <Stat icon={Shield} v="₹18,400 Cr" l="Assets under advisory" />
          <Stat icon={Award} v="4.8★" l="Investor rating" />
          <Stat icon={Sparkles} v="5,000+" l="Curated funds" />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold">Our mission</h2>
            <p className="mt-4 text-muted-foreground">
              To be India's most trusted mutual fund advisory partner — guiding investors through
              every market cycle with personalized SIP planning, goal-based portfolios and long-term
              relationship support that compounds wealth across generations.
            </p>
          </div>
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold">Our principles</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Long-term wealth creation over short-term wins</li>
              <li>• Personalized advisory, not one-size-fits-all products</li>
              <li>• SEBI-compliant operations through licensed partners</li>
              <li>• Bank-grade encryption — your data is never sold</li>
              <li>• Transparent recommendations and ongoing portfolio reviews</li>
            </ul>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Stat({ icon: Icon, v, l }: any) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-4 font-display text-2xl font-bold">{v}</div>
      <div className="text-sm text-muted-foreground">{l}</div>
    </div>
  );
}

export default function Page() {
  return <About />;
}
