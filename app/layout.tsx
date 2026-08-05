import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { FloatingContact } from "@/components/floating-contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mutualfundadvisor.in";

export const metadata: Metadata = {
  title: "Mutual Fund Distributor in Delhi | WealthMaster India",
  description:
    "Connect with WealthMaster India, an AMFI-registered Mutual Fund Distributor in Rajouri Garden, Delhi. Explore SIPs, mutual funds and Regular Plan assistance. ARN 349461.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "WealthMaster India",
    type: "website",
    title: "Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "Explore mutual funds, SIP calculators and investor education, or request a consultation with an AMFI-registered Mutual Fund Distributor in Delhi.",
    url: "/",
    images: [
      {
        url: "/wealthmaster-india-og.png",
        width: 1200,
        height: 630,
        alt: "WealthMaster India — AMFI-Registered Mutual Fund Distributor, ARN 349461, Delhi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mutual Fund Distributor in Delhi | WealthMaster India",
    description:
      "Explore mutual funds, SIP calculators and investor education, or request a consultation with an AMFI-registered Mutual Fund Distributor in Delhi.",
    images: ["/wealthmaster-india-og.png"],
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
        <AppProviders>
          <div id="main-content">{children}</div>
        </AppProviders>
        <FloatingContact />
      </body>
    </html>
  );
}
