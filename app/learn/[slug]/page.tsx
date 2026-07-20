import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { getLearningArticle, learningArticles } from "@/lib/learning";

export function generateStaticParams() {
  return learningArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearningArticle(slug);
  return article
    ? { title: `${article.title} | WealthMaster India`, description: article.description }
    : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getLearningArticle(slug);
  if (!article) notFound();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <Link
            href="/learn"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All learning resources
          </Link>
          <div className="mt-9 text-xs font-semibold uppercase tracking-widest text-primary">
            {article.category} · {article.readingTime}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{article.description}</p>
          <div className="mt-10 rounded-2xl border border-warning/25 bg-warning/5 p-5 text-sm leading-6 text-muted-foreground">
            This article is for investor education only. It is not investment advice, a scheme
            recommendation or an assurance of returns.
          </div>
          <div className="mt-12 space-y-11">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-bold">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-4 leading-8 text-muted-foreground">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 space-y-3 pl-5 text-muted-foreground">
                    {section.bullets.map((b) => (
                      <li key={b} className="list-disc pl-1 leading-7">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <div className="mt-14 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-bold">Have a question?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue learning or book a free conversation about the investment process.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/learn">
                <Button variant="outline" className="rounded-full">
                  More articles
                </Button>
              </Link>
              <Link href="/book-consultation">
                <Button className="rounded-full">
                  Book free consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
