import { fallbackDashboardData, type DashboardNewsItem } from "@/lib/advisor-data";

export type MarketNewsResponse = {
  source: string;
  configured: boolean;
  news: DashboardNewsItem[];
};

type NewsApiArticle = {
  title?: string;
  url?: string;
  source?: { name?: string };
  publishedAt?: string;
};

type MarketAuxArticle = {
  title?: string;
  url?: string;
  source?: string;
  published_at?: string;
};

const NEWS_QUERY =
  "India mutual funds OR SIP OR AMFI OR SEBI OR Nifty OR Sensex OR personal finance";

function relativeTime(value?: string) {
  if (!value) return "Recently";
  const published = new Date(value);
  if (Number.isNaN(published.getTime())) return "Recently";

  const diffMs = Date.now() - published.getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function fallbackNews(source = "Fallback"): MarketNewsResponse {
  return {
    source,
    configured: false,
    news: fallbackDashboardData.news,
  };
}

async function fetchNewsApi(apiKey: string): Promise<MarketNewsResponse> {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    language: "en",
    sortBy: "publishedAt",
    pageSize: "8",
    apiKey,
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 * 60 },
  });

  if (!response.ok) throw new Error(`NewsAPI failed with status ${response.status}`);

  const payload = (await response.json()) as { articles?: NewsApiArticle[] };
  const news =
    payload.articles
      ?.filter((article) => article.title)
      .slice(0, 6)
      .map((article) => ({
        title: article.title!,
        source: article.source?.name ?? "NewsAPI",
        time: relativeTime(article.publishedAt),
        url: article.url,
      })) ?? [];

  return news.length > 0 ? { source: "NewsAPI", configured: true, news } : fallbackNews("NewsAPI");
}

async function fetchMarketAux(apiKey: string): Promise<MarketNewsResponse> {
  const params = new URLSearchParams({
    api_token: apiKey,
    countries: "in",
    language: "en",
    limit: "6",
    search: "mutual funds OR SIP OR SEBI OR AMFI",
  });

  const response = await fetch(`https://api.marketaux.com/v1/news/all?${params.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 * 60 },
  });

  if (!response.ok) throw new Error(`MarketAux failed with status ${response.status}`);

  const payload = (await response.json()) as { data?: MarketAuxArticle[] };
  const news =
    payload.data
      ?.filter((article) => article.title)
      .map((article) => ({
        title: article.title!,
        source: article.source ?? "MarketAux",
        time: relativeTime(article.published_at),
        url: article.url,
      })) ?? [];

  return news.length > 0
    ? { source: "MarketAux", configured: true, news }
    : fallbackNews("MarketAux");
}

export async function getMarketNews(): Promise<MarketNewsResponse> {
  const provider = (process.env.MARKET_NEWS_PROVIDER ?? "newsapi").toLowerCase();
  const apiKey = process.env.MARKET_NEWS_API_KEY ?? process.env.NEWS_API_KEY;

  if (!apiKey) return fallbackNews();

  try {
    if (provider === "marketaux") return fetchMarketAux(apiKey);
    return fetchNewsApi(apiKey);
  } catch {
    return fallbackNews(provider === "marketaux" ? "MarketAux fallback" : "NewsAPI fallback");
  }
}
