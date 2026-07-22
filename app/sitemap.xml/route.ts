import { learningArticles } from "@/lib/learning";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mutualfundadvisor.in").replace(
  /\/$/,
  "",
);

const pages = [
  { path: "", changeFrequency: "weekly", priority: "1.0" },
  { path: "funds", changeFrequency: "daily", priority: "0.9" },
  { path: "calculator", changeFrequency: "monthly", priority: "0.8" },
  { path: "learn", changeFrequency: "weekly", priority: "0.8" },
  { path: "about", changeFrequency: "monthly", priority: "0.6" },
  { path: "book-consultation", changeFrequency: "monthly", priority: "0.7" },
  { path: "contact", changeFrequency: "monthly", priority: "0.6" },
  { path: "get-started", changeFrequency: "monthly", priority: "0.7" },
  ...learningArticles.map((article) => ({
    path: `learn/${article.slug}`,
    changeFrequency: "monthly",
    priority: "0.7",
  })),
];

export function GET() {
  const urls = pages
    .map(
      ({ path, changeFrequency, priority }) => `  <url>
    <loc>${BASE_URL}${path ? `/${path}` : "/"}</loc>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
