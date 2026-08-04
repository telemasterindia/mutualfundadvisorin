import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WealthMaster India",
    short_name: "WealthMaster India",
    description:
      "Explore mutual funds, SIP calculators and investor education, or request a consultation with an AMFI-registered Mutual Fund Distributor in Delhi.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
