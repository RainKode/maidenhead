import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order from Maidenhead Spice for delivery or collection. Free delivery within two miles on orders over £20.",
};

export default function OrderPage() {
  const phone = contact.phones[0];
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Delivery & Collection"
          title="Order Online"
          subtitle="Free local delivery within two miles. Order ahead and we will have it ready when you arrive."
        />

        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10">
            <div className="grid gap-6 md:grid-cols-2">
              <PartnerCard
                title="Order direct"
                blurb="Coming soon — direct online ordering with no third-party fees."
                cta="Notify me"
                href="/#newsletter"
                disabled
              />
              <PartnerCard
                title="Order by phone"
                blurb={`The fastest way today — call us on ${phone}. We will take your order, arrange delivery or collection, and have it ready in around thirty minutes.`}
                cta={`Call ${phone}`}
                href={`tel:${phone.replace(/\s+/g, "")}`}
              />
            </div>

            <div className="mt-14 bg-cream-deep border border-ink/10 px-6 md:px-10 py-10">
              <p className="caps-track text-[12px] text-oxblood">
                Delivery zones
              </p>
              <h2 className="mt-3 font-display text-[24px] md:text-[28px] text-ink">
                We deliver around Maidenhead, seven days a week
              </h2>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2 text-[15px] text-ink/85">
                <li>· Within 2 miles — free (min. £20)</li>
                <li>· Within 3 miles — £3</li>
                <li>· Within 4 miles — £4</li>
                <li>· Within 5 miles — £5</li>
              </ul>
              <p className="mt-5 text-[14px] text-ink/75 italic">
                Evening delivery 17:30 – 22:30 every day. Lunch delivery
                12:00 – 14:00 on Wednesdays, Thursdays, Saturdays and Sundays.
                10% off when you spend over £10.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/menus"
                  className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
                >
                  Browse the Menu
                </Link>
                <Link
                  href="/offers"
                  className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
                >
                  See Current Offers
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

function PartnerCard({
  title,
  blurb,
  cta,
  href,
  disabled,
}: {
  title: string;
  blurb: string;
  cta: string;
  href: string;
  disabled?: boolean;
}) {
  const baseClass =
    "mt-6 caps-track inline-flex items-center justify-center rounded-full px-7 h-11 text-[12px] font-semibold transition-colors";
  const variant = disabled
    ? "bg-ink/10 text-ink/45 cursor-not-allowed"
    : "bg-oxblood-dark text-cream hover:bg-oxblood";
  return (
    <article className="bg-cream-deep border border-ink/10 px-6 md:px-8 py-10 flex flex-col">
      <h3 className="caps-track font-display text-[18px] text-oxblood-dark">
        {title}
      </h3>
      <p className="mt-4 text-[15px] leading-[1.7] text-ink/85 flex-1">
        {blurb}
      </p>
      {disabled ? (
        <span className={`${baseClass} ${variant}`} aria-disabled="true">
          {cta}
        </span>
      ) : (
        <Link href={href} className={`${baseClass} ${variant}`}>
          {cta}
        </Link>
      )}
    </article>
  );
}
