import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Scale } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { learningArticles } from "@/lib/learning";

export const metadata: Metadata = {
  title: "Learn About Mutual Funds | WealthMaster India",
  description:
    "Plain-language educational resources about mutual funds, SIPs, lump-sum investing, plan types, costs and risks.",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Learning resources
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Understand the basics before taking the next step.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Unbiased, plain-language introductions to mutual fund concepts, investment routes,
              costs and risks. Educational content is not a recommendation or return forecast.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {learningArticles.map((article, i) => {
              const Icon = [BookOpen, Calculator, Scale][i];
              return (
                <article key={article.slug} className="glass flex flex-col rounded-3xl p-7">
                  <Icon className="h-7 w-7 text-primary" />
                  <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {article.category} · {article.readingTime}
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold">{article.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {article.description}
                  </p>
                  <Link
                    href={`/learn/${article.slug}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-primary"
                  >
                    Read article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="mt-14 rounded-3xl border border-border bg-secondary/30 p-8 text-center">
            <h2 className="font-display text-2xl font-bold">Want to discuss what you learned?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Book a free consultation to ask questions about the mutual fund process.
            </p>
            <Link href="/book-consultation">
              <Button className="mt-6 rounded-full">Book free consultation</Button>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
