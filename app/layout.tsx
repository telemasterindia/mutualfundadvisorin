import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { FloatingContact } from "@/components/floating-contact";

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
    "@graph": [
      {
        "@type": ["Organization", "FinancialService"],
        "@id": `${SITE_URL}/#organization`,
        name: "WealthMaster India",
        description:
          "AMFI-Registered Mutual Fund Distributor providing mutual fund education and distribution support. ARN 349461.",
        url: SITE_URL,
        areaServed: { "@type": "AdministrativeArea", name: "Delhi" },
        serviceType: "Mutual Fund Distribution",
        telephone: "+91-9999252122",
        email: "contact@wealthmasterindia.in",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Q-14, Rajouri Garden",
          addressLocality: "New Delhi",
          addressRegion: "Delhi",
          postalCode: "110027",
          addressCountry: "IN",
        },
        founder: {
          "@type": "Person",
          name: "Amit Chadha",
          jobTitle: "Mutual Fund Distributor",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "WealthMaster India",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          id="wealthmaster-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
        <AppProviders>{children}</AppProviders>
        <FloatingContact />
      </body>
    </html>
  );
}
