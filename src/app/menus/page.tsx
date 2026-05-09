import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Menus",
  description:
    "Starters, slow-cooked curries, biryani, breads and our Sunday buffet — explore the Maidenhead Spice menu.",
};

const menuPages = [
  { label: "Page 1", href: "/menu/Maidenhead%20Spice%20Page%201.pdf" },
  { label: "Page 2", href: "/menu/Maidenhead%20Spice%20Page%202.pdf" },
  { label: "Page 3", href: "/menu/Maidenhead%20Spice%20Page%203.pdf" },
  { label: "Page 4", href: "/menu/Maidenhead%20Spice%20Page%204.pdf" },
  { label: "Page 5", href: "/menu/Maidenhead%20Spice%20Page%205.pdf" },
];

export default function MenusPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Maidenhead Spice"
          title="Our Menus"
          subtitle="Browse our full menu below. Download any page or scroll through all five."
        />

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-6 md:px-10 space-y-10">
            {menuPages.map((page, i) => (
              <div key={page.href} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="caps-track font-display text-[16px] text-oxblood-dark">
                    Menu — {page.label}
                  </h2>
                  <a
                    href={page.href}
                    download
                    className="caps-track-tight text-[11px] font-semibold text-oxblood-dark border border-oxblood-dark/30 px-4 h-8 inline-flex items-center rounded-full hover:bg-oxblood-dark hover:text-cream transition-colors"
                  >
                    Download
                  </a>
                </div>
                <div className="w-full border border-ink/10 overflow-hidden rounded-sm shadow-sm bg-white">
                  <object
                    data={page.href}
                    type="application/pdf"
                    className="w-full"
                    style={{ height: "80vh" }}
                    aria-label={`Maidenhead Spice menu ${page.label}`}
                  >
                    <div className="flex flex-col items-center justify-center py-16 text-ink/60 gap-4">
                      <p className="text-[15px]">PDF preview not available in your browser.</p>
                      <a
                        href={page.href}
                        download
                        className="caps-track-tight text-[12px] font-semibold text-oxblood-dark border border-oxblood-dark/30 px-5 h-9 inline-flex items-center rounded-full hover:bg-oxblood-dark hover:text-cream transition-colors"
                      >
                        Download {page.label}
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/book"
                className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
              >
                Book a Table
              </Link>
              <Link
                href="/order"
                className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
              >
                Order Online
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}

