/**
 * Maidenhead Spice — single source of truth for site-wide content.
 * Keep this file in sync with anything visible in the header, footer, contact,
 * structured data and metadata. One edit here updates the whole site.
 */

export const siteInfo = {
  name: "Maidenhead Spice",
  tagline: "From our tandoor to your table",
  description:
    "Maidenhead Spice — vibrant, authentic Indian cooking on Bridge Road. Sunday buffet, fragrant biryanis, slow-cooked curries and proper hospitality, seven days a week.",
  url: "https://www.maidenheadspice.com",
} as const;

export const contact = {
  addressLine1: "117 Bridge Road",
  addressLine2: "Maidenhead",
  postcode: "SL6 8NA",
  region: "Berkshire",
  country: "United Kingdom",
  phones: ["01628 670670", "01628 673673"],
  email: "info@maidenheadspice.co.uk",
  // Google Maps embed for 117 Bridge Road, Maidenhead.
  mapEmbed:
    "https://www.google.com/maps?q=Maidenhead+Spice,+117+Bridge+Road,+Maidenhead+SL6+8NA&output=embed",
} as const;

export const hours = {
  summary: "Open 7 days a week, including Bank Holidays",
  dinner: "5.30pm – 10.30pm",
  sundayBuffet: "Sunday Buffet · 12.00pm – 3.00pm",
  weekly: [
    { day: "Monday", times: "5.30pm – 10.30pm" },
    { day: "Tuesday", times: "5.30pm – 10.30pm" },
    { day: "Wednesday", times: "12.00pm – 2.00pm · 5.30pm – 10.30pm" },
    { day: "Thursday", times: "12.00pm – 2.00pm · 5.30pm – 10.30pm" },
    { day: "Friday", times: "5.30pm – 10.30pm" },
    { day: "Saturday", times: "12.00pm – 2.00pm · 5.30pm – 10.30pm" },
    { day: "Sunday", times: "12.00pm – 3.00pm · 5.30pm – 10.30pm" },
  ],
} as const;

export const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/maidenheadspicex",
  },
  {
    label: "TripAdvisor",
    href: "https://www.tripadvisor.in/Restaurant_Review-g186418-d7612304-Reviews-Maidenhead_Spice-Maidenhead_Windsor_and_Maidenhead_Berkshire_England.html",
  },
  {
    label: "Google",
    href: "https://www.google.com/search?q=Maidenhead+Spice+117+Bridge+Road",
  },
] as const;

export const navLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Menus", href: "/menus" },
  { label: "Ambience", href: "/gallery" },
  { label: "Offers", href: "/offers" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

export const ctaLinks = {
  book: "/book",
  order: "/order",
  menus: "/menus",
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Service Disclaimer", href: "/disclaimer" },
] as const;
