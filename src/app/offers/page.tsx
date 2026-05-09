import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Sunday buffet, free local delivery, party catering and more — current offers at Maidenhead Spice.",
};

export default function OffersPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Offers"
          title="Great food, great value"
          subtitle="We believe a proper meal should not cost the earth. Here is what we are running this month."
        />

        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-12 md:grid-cols-2 items-center">
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/ambience/IMG-20251030-WA0081.jpg"
                alt="A celebratory Sunday feast spread at Maidenhead Spice"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
            <div>
              <p className="caps-track text-[12px] text-oxblood">Every Sunday</p>
              <h2 className="mt-3 font-display text-[30px] md:text-[40px] leading-[1.1] text-ink">
                Sunday Buffet
              </h2>
              <p className="mt-4 font-display text-[20px] italic text-oxblood">
                Adult £14.95 · Child (under 10) £9.95
              </p>
              <p className="mt-2 text-[15px] text-ink/75">12.00pm – 2.00pm</p>
              <p className="mt-5 text-[16px] text-ink/85 leading-[1.7]">
                Two starters, four mains, rice, breads, salads and dessert —
                a different lineup each week. Bring the family, take your
                time, eat properly.
              </p>
              <Link
                href="/book"
                className="mt-7 caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
              >
                Book Sunday Lunch
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-cream-deep py-16 md:py-20 border-y border-ink/10">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-12 md:grid-cols-2 items-center">
            <div className="md:order-2">
              <figure className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/ambience/IMG-20251030-WA0057.jpg"
                  alt="Maidenhead Spice restaurant entrance, ready for service"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </div>
            <div className="md:order-1">
              <p className="caps-track text-[12px] text-oxblood">Local delivery</p>
              <h2 className="mt-3 font-display text-[30px] md:text-[40px] leading-[1.1] text-ink">
                Free delivery within two miles
              </h2>
              <ul className="mt-5 space-y-2 text-[15px] text-ink/85">
                <li>· Within 2 miles — free delivery (minimum order £20)</li>
                <li>· Within 3 miles — £3 delivery</li>
                <li>· Within 4 miles — £4 delivery</li>
                <li>· Within 5 miles — £5 delivery</li>
              </ul>
              <div className="mt-5 text-[14px] text-ink/75 space-y-1">
                <p>
                  <strong className="text-ink">Lunch (12:00 – 14:00):</strong>{" "}
                  Wednesday, Thursday, Saturday, Sunday
                </p>
                <p>
                  <strong className="text-ink">Evenings (17:30 – 22:30):</strong>{" "}
                  every day
                </p>
                <p className="italic">
                  10% discount on orders over £10. Lunch delivery not available
                  Monday, Tuesday or Friday.
                </p>
              </div>
              <Link
                href="/order"
                className="mt-7 caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
              >
                Order Online
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-12 md:grid-cols-2 items-center">
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/ambience/IMG-20251030-WA0067.jpg"
                alt="Guests enjoying a sharing feast at Maidenhead Spice"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
            <div>
              <p className="caps-track text-[12px] text-oxblood">Catering</p>
              <h2 className="mt-3 font-display text-[30px] md:text-[40px] leading-[1.1] text-ink">
                Book your party with us
              </h2>
              <p className="mt-5 text-[16px] text-ink/85 leading-[1.7]">
                Birthdays, weddings, office gatherings, family celebrations —
                we cater for events large and small. Set menus, drinks
                packages, and the option to take over our dining room. Have a
                chat with us and we will build something around your day.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
                >
                  Get a Quote
                </Link>
                <a
                  href="tel:01628670670"
                  className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
                >
                  Call 01628 670670
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
