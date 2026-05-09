import type { Metadata } from "next";
import Link from "next/link";
import { MenuBrowse } from "@/components/menu/menu-browse";
import { PageHero } from "@/components/layout/page-hero";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";
import { menu, printableMenuPages } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Menus",
  description:
    "Browse the Maidenhead Spice menu, customise dishes and build an order for collection, delivery or dine-in pre-order.",
};

export default function MenusPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Maidenhead Spice"
          title="Our Menus"
          subtitle="Browse the full menu, customise your dishes and add favourites to your order."
        />

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-[1180px] px-6 md:px-10">
            <MenuBrowse categories={menu} />

            <div className="mt-14 border border-ink/10 bg-cream-deep px-6 py-8 text-center md:px-10">
              <p className="caps-track text-[12px] text-oxblood">Printable menu</p>
              <h2 className="mt-2 font-display text-[24px] text-ink">
                Need a copy for the fridge?
              </h2>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {printableMenuPages.map((page) => (
                  <a
                    key={page.href}
                    href={page.href}
                    download
                    className="caps-track-tight inline-flex h-9 items-center rounded-full border border-oxblood-dark/30 px-4 text-[11px] font-semibold text-oxblood-dark transition-colors hover:bg-oxblood-dark hover:text-cream"
                  >
                    Download {page.label}
                  </a>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/book"
                  className="caps-track inline-flex h-11 items-center justify-center rounded-full border border-oxblood-dark px-7 text-[12px] font-semibold text-oxblood-dark transition-colors hover:bg-oxblood-dark hover:text-cream"
                >
                  Book a Table
                </Link>
                <Link
                  href="/order"
                  className="caps-track inline-flex h-11 items-center justify-center rounded-full bg-oxblood-dark px-7 text-[12px] font-semibold text-cream transition-colors hover:bg-oxblood"
                >
                  Review Order
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}

