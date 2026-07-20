import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mutualfundadvisor.in";

export const metadata: Metadata = {
  title: "WealthMaster India - Mutual Fund Education & Distribution Support",
  description:
    "Learn about mutual funds, use transparent planning calculators and book a free consultation about the investment process.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "WealthMaster India",
    type: "website",
    title: "WealthMaster India - Mutual Fund Education & Distribution Support",
    description:
      "Mutual fund education, planning calculators and distribution support for Indian investors.",
    images: ["/icon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "WealthMaster India - Mutual Fund Education & Distribution Support",
    description:
      "Mutual fund education, planning calculators and distribution support for Indian investors.",
    images: ["/icon.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "WealthMaster India",
    description:
      "Mutual fund education, planning tools and distribution support for Indian investors.",
    url: SITE_URL,
    areaServed: "IN",
    serviceType: "Mutual Fund Education and Distribution Support",
    telephone: "+91-9999252122",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Q-14, Rajouri Garden",
      addressLocality: "New Delhi",
      addressRegion: "DL",
      postalCode: "110027",
      addressCountry: "IN",
    },
    founder: { "@type": "Person", name: "Amit Chadha", jobTitle: "Founder" },
  };
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          id="wealthmaster-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
