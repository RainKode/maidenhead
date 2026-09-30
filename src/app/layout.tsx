import type { Metadata, Viewport } from "next";
import { Merienda, Lato, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartButton } from "@/components/cart/cart-button";
import { CookieBanner } from "@/components/cookie-banner";
import { siteInfo, contact, hours } from "@/lib/content";

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

// Link previews: the share image and favicon come from the files in this
// folder (opengraph-image.jpg, icon.svg, favicon.ico, apple-icon.png). Title
// and description are deliberately left out of openGraph/twitter so every
// page's own title and description are used when it is shared.
export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: `${siteInfo.name} — ${siteInfo.tagline}`,
    template: `%s · ${siteInfo.name}`,
  },
  description: siteInfo.description,
  applicationName: siteInfo.name,
  appleWebApp: { title: siteInfo.name },
  openGraph: {
    siteName: siteInfo.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfe",
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
  openingHoursSpecification: hours.weekly.flatMap((d) =>
    d.sessions.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: d.day,
      opens,
      closes,
    }))
  ),
  image: `${siteInfo.url}/opengraph-image.jpg`,
  logo: `${siteInfo.url}/brand/icon-512.png`,
  hasMenu: `${siteInfo.url}/menus`,
  acceptsReservations: `${siteInfo.url}/book`,
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
        <CartButton />
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
