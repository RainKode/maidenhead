import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../reveal";


/**
 * Offers teaser on the landing page — features the Sunday buffet headline
 * with secondary callouts to free delivery and party catering.
 */
export function OffersSection() {
  return (
    <section className="relative bg-oxblood-dark text-cream overflow-hidden border-y border-ink/40">
      <div aria-hidden className="absolute inset-0 bg-grain opacity-40" />

      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10 py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <Reveal direction="left" className="order-2 md:order-1">
          <div>
            <p className="caps-track text-[12px] text-saffron mb-4">
              Offers at Maidenhead Spice
            </p>
            <h2 className="font-display text-[34px] md:text-[48px] lg:text-[56px] leading-[1.05] uppercase tracking-[0.02em] text-cream">
              Great food, <span className="text-saffron italic normal-case">great</span> value
            </h2>
            <ul className="mt-6 space-y-4 text-[17px] leading-[1.7] text-cream/90 max-w-[52ch]">
              <li>
                <span className="caps-track-tight text-[11px] text-saffron block">
                  Sunday Buffet
                </span>
                Adult £19.95 · Child (under 10) £12.95 · 12.00pm – 3.00pm.
              </li>
              <li>
                <span className="caps-track-tight text-[11px] text-saffron block">
                  Free Delivery
                </span>
                Within two miles on orders over £20. Tiered charges further
                afield.
              </li>
              <li>
                <span className="caps-track-tight text-[11px] text-saffron block">
                  Book Your Party
                </span>
                Birthdays, weddings, office gatherings — leave the cooking to us.
              </li>
            </ul>
            <Link
              href="/offers"
              className="mt-8 caps-track inline-flex items-center justify-center rounded-full bg-saffron px-7 h-11 text-[12px] font-medium text-oxblood-dark hover:bg-saffron-dark transition-colors"
            >
              See All Offers
            </Link>
          </div>
        </Reveal>

        <Reveal direction="right" delay={150} className="order-1 md:order-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-saffron/30">
              <Parallax distance={70} className="absolute inset-0">
                <Image
                  src="/images/ambience/IMG-20251030-WA0016.jpg"
                  alt="Three curries laid out for a sharing feast at Maidenhead Spice"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover scale-[1.12]"
                />
              </Parallax>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-3 -left-3 -bottom-3 -right-3 border border-saffron/40"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
