const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mutualfundadvisor.in";
const entries = [
  "",
  "about",
  "funds",
  "calculator",
  "learn",
  "learn/what-is-a-mutual-fund",
  "learn/sip-vs-lump-sum",
  "learn/direct-vs-regular-mutual-funds",
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
