import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wealthmasterindia.in";

export const metadata: Metadata = {
  title: "WealthMaster India - Wealth Advisory & Financial Planning",
  description:
    "Independent wealth advisory for Indian investors - Mutual Funds, SIPs, Insurance, PMS, AIF, NCDs and Retirement Planning.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "WealthMaster India",
    type: "website",
    title: "WealthMaster India - Wealth Advisory & Financial Planning",
    description:
      "Mutual Funds, SIPs, Insurance, PMS, AIF and Retirement Planning for Indian investors.",
    images: [
      "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c32a7cd5-faa0-4389-bf88-f4b1f1d8b9c7",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WealthMaster India - Wealth Advisory & Financial Planning",
    description:
      "Mutual Funds, SIPs, Insurance, PMS, AIF and Retirement Planning for Indian investors.",
    images: [
      "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c32a7cd5-faa0-4389-bf88-f4b1f1d8b9c7",
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "WealthMaster India",
    description:
      "Independent financial services and wealth advisory platform focused on Mutual Funds, SIPs, Retirement Planning, Insurance, PMS, AIF, NCDs and long-term wealth creation for Indian investors.",
    url: SITE_URL,
    areaServed: "IN",
    serviceType: "Mutual Fund Distribution, Wealth Advisory, Insurance, PMS & AIF",
    telephone: "+91-9999252122",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Q-14, Rajouri Garden",
      addressLocality: "New Delhi",
      addressRegion: "DL",
      postalCode: "110027",
      addressCountry: "IN",
    },
    founder: { "@type": "Person", name: "Amit Chadha", jobTitle: "Founder & Investment Advisor" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
