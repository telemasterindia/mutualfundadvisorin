const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wealthmasterindia.in";
const entries = [
  "",
  "about",
  "funds",
  "calculator",
  "book-consultation",
  "contact",
  "login",
  "signup",
  "get-started",
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((path) => `  <url><loc>${BASE_URL}/${path}</loc></url>`).join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "content-type": "application/xml" } });
}
