import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const isVercel = process.env.VERCEL === "1";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://widgets.tradingview-widget.com https://s3.tradingview.com https://www.clarity.ms https://*.clarity.ms${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: https://*.clarity.ms https://c.bing.com wss://*.tradingview.com",
  "frame-src 'self' https://s.tradingview.com https://www.tradingview.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Vercel expects `.next`. Local dev and production builds use separate,
  // stable directories so a running dev server never locks build output.
  distDir:
    process.env.NEXT_DIST_DIR ??
    (isVercel ? ".next" : isDevelopment ? ".next-local-dev" : ".next-local-build"),
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
  async redirects() {
    return [
      {
        source: "/get-started",
        destination: "/book-consultation",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mutualfundadvisor.in" }],
        destination: "https://www.mutualfundadvisor.in/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
