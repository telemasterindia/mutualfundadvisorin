import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    ? {
        title: `${article.title} | WealthMaster India`,
        description: article.description,
        alternates: { canonical: `/learn/${article.slug}` },
        openGraph: {
          title: `${article.title} | WealthMaster India`,
          description: article.description,
          type: "article",
          url: `/learn/${article.slug}`,
        },
      }
    : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getLearningArticle(slug);
  if (!article) notFound();
  const canonicalUrl = `https://www.mutualfundadvisor.in/learn/${article.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      mainEntityOfPage: canonicalUrl,
      author: {
        "@type": "Person",
        name: "Amit Chadha",
        jobTitle: "Mutual Fund Distributor",
      },
      publisher: {
        "@type": "Organization",
        name: "WealthMaster India",
        url: "https://www.mutualfundadvisor.in/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.mutualfundadvisor.in/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Learn",
          item: "https://www.mutualfundadvisor.in/learn",
        },
        { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
      ],
    },
  ];
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
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <Link href="/learn" className="hover:text-primary">
              Learn
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page">{article.title}</span>
          </nav>
          <div className="mt-9 text-xs font-semibold uppercase tracking-widest text-primary">
            {article.category} · {article.readingTime}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{article.description}</p>
          <p className="mt-5 text-sm text-muted-foreground">
            Written by <span className="font-semibold text-foreground">Amit Chadha</span>, Founder
            &amp; Mutual Fund Distributor at WealthMaster India.
          </p>
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
              <Link href="/calculator">
                <Button variant="outline" className="rounded-full">
                  Use the SIP calculator
                </Button>
              </Link>
              <Link href="/funds">
                <Button variant="outline" className="rounded-full">
                  Explore mutual funds
                </Button>
              </Link>
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
            <Link
              href="/mutual-fund-distributor-delhi"
              className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Mutual Fund Distributor services in Delhi
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
