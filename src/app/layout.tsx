import type { Metadata } from "next";
import { Merienda, Lato, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";
import { siteInfo, contact } from "@/lib/content";

const merienda = Merienda({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: `${siteInfo.name} — ${siteInfo.tagline}`,
    template: `%s · ${siteInfo.name}`,
  },
  description: siteInfo.description,
  openGraph: {
    title: `${siteInfo.name} — ${siteInfo.tagline}`,
    description: siteInfo.description,
    url: siteInfo.url,
    siteName: siteInfo.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteInfo.name,
    description: siteInfo.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: siteInfo.name,
  description: siteInfo.description,
  url: siteInfo.url,
  servesCuisine: ["Indian", "South Asian"],
  priceRange: "££",
  telephone: contact.phones[0],
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.addressLine1,
    addressLocality: contact.addressLine2,
    addressRegion: contact.region,
    postalCode: contact.postcode,
    addressCountry: "GB",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "17:30",
      closes: "22:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Saturday"],
      opens: "12:00",
      closes: "14:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "12:00",
      closes: "15:00",
    },
  ],
  hasMenu: `${siteInfo.url}/menus`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${merienda.variable} ${lato.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <CookieBanner />
        <Script
          id="ld-restaurant"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
