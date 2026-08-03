import type { DashboardNewsItem } from "@/lib/advisor-data";

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

type FinEdgeAnnouncement = {
  stock_symbol?: string;
  nse_code?: string;
  category?: string;
  description?: string;
  announcement_date?: string;
  timestamp_unix?: number;
  pdf_file_link?: string;
  pdf_file_link_hist?: string;
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
    news: [],
  };
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

async function fetchFinEdgeAnnouncements(apiKey: string): Promise<MarketNewsResponse> {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - 14);
  const symbols = ["RELIANCE", "HDFCBANK", "ITC", "TCS", "INFY"];

  const responses = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const params = new URLSearchParams({
        symbol,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        token: apiKey,
      });
      const response = await fetch(
        `https://data.finedgeapi.com/api/v1/corp-announcements?${params.toString()}`,
        {
          headers: { Accept: "application/json" },
          next: { revalidate: 10 * 60 },
        },
      );
      if (!response.ok) throw new Error(`FinEdge announcements failed with ${response.status}`);
      return (await response.json()) as FinEdgeAnnouncement[];
    }),
  );

  const news = responses
    .flatMap((response) => (response.status === "fulfilled" ? response.value : []))
    .map((announcement) => {
      const publishedTime =
        announcement.timestamp_unix && Number.isFinite(announcement.timestamp_unix)
          ? announcement.timestamp_unix * 1000
          : new Date(announcement.announcement_date ?? "").getTime();
      const symbol = announcement.nse_code ?? announcement.stock_symbol ?? "NSE";
      return {
        title: announcement.description?.trim() ?? "",
        source: `${symbol} · ${announcement.category ?? "Corporate announcement"}`,
        time: relativeTime(
          Number.isFinite(publishedTime) ? new Date(publishedTime).toISOString() : undefined,
        ),
        url: announcement.pdf_file_link || announcement.pdf_file_link_hist,
        publishedTime,
      };
    })
    .filter(
      (announcement) =>
        announcement.title && announcement.url && Number.isFinite(announcement.publishedTime),
    )
    .sort((a, b) => b.publishedTime - a.publishedTime)
    .slice(0, 6)
    .map(({ publishedTime: _, ...announcement }) => announcement);

  return news.length
    ? { source: "FinEdge corporate announcements", configured: true, news }
    : fallbackNews("FinEdge announcements");
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
  const finEdgeApiKey = process.env.FINEDGE_API_KEY;

  if (!apiKey) {
    if (!finEdgeApiKey) return fallbackNews("Market updates unavailable");
    try {
      return await fetchFinEdgeAnnouncements(finEdgeApiKey);
    } catch {
      return fallbackNews("FinEdge announcements unavailable");
    }
  }

  try {
    if (provider === "marketaux") return fetchMarketAux(apiKey);
    return fetchNewsApi(apiKey);
  } catch {
    if (!finEdgeApiKey) {
      return fallbackNews(
        provider === "marketaux" ? "MarketAux unavailable" : "NewsAPI unavailable",
      );
    }
    try {
      return await fetchFinEdgeAnnouncements(finEdgeApiKey);
    } catch {
      return fallbackNews("News providers unavailable");
    }
  }
}
