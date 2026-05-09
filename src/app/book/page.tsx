import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { BookingForm } from "@/components/forms/booking-form";
import { contact, hours } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Table",
  description:
    "Reserve your table at Maidenhead Spice — lunch, dinner or our Sunday buffet. We will confirm by phone.",
};

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Reservations"
          title="Book a Table"
          subtitle="Tell us when you would like to come, and we will confirm your booking by phone."
        />

        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="bg-cream-deep border border-ink/10 px-6 md:px-10 py-10 md:py-12">
              <BookingForm />
            </div>

            <aside className="space-y-8">
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Opening Hours
                </h3>
                <ul className="space-y-1.5 text-[14px] text-ink/85">
                  {hours.weekly.map((d) => (
                    <li key={d.day} className="flex justify-between gap-4">
                      <span className="font-display">{d.day}</span>
                      <span className="text-right text-ink/70">
                        {d.times}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Find Us
                </h3>
                <address className="not-italic font-display text-[16px] text-ink/85 leading-relaxed">
                  {contact.addressLine1}
                  <br />
                  {contact.addressLine2}
                  <br />
                  {contact.postcode}
                </address>
              </div>

              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Speak to us
                </h3>
                <ul className="space-y-1.5 font-display text-[16px] text-ink/85">
                  {contact.phones.map((p) => (
                    <li key={p}>
                      <a
                        href={`tel:${p.replace(/\s+/g, "")}`}
                        className="link-rule"
                      >
                        {p}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${contact.email}`} className="link-rule">
                      {contact.email}
                    </a>
                  </li>
                </ul>
              </div>

              <p className="text-[13px] text-ink/65 italic">
                Large parties (8+) — please call us directly so we can plan
                the table properly.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-oxblood-dark text-cream py-14">
          <div className="mx-auto max-w-[900px] px-6 md:px-10 text-center">
            <h2 className="font-display text-[24px] md:text-[32px]">
              Not sure yet? Have a look at the menu first.
            </h2>
            <Link
              href="/menus"
              className="mt-6 caps-track inline-flex items-center justify-center rounded-full bg-saffron px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-saffron-dark transition-colors"
            >
              View Our Menu
            </Link>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
