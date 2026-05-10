import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../reveal";


/**
 * Offers teaser on the landing page — features the Sunday buffet headline
 * with secondary callouts to free delivery and party catering.
 */
export function OffersSection() {
  return (
    <section className="relative bg-ink text-background overflow-hidden border-y-[3px] border-ink">
      <div aria-hidden className="absolute inset-0 bg-grain opacity-40" />

      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10 py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <Reveal direction="left" className="order-2 md:order-1">
          <div>
            <p className="caps-track text-[12px] text-saffron mb-4">
              Offers at Maidenhead Spice
            </p>
            <h2 className="font-display text-[34px] md:text-[48px] lg:text-[56px] leading-[1.05] uppercase tracking-[0.02em] text-background">
              Great food, <span className="text-saffron italic normal-case">great</span> value
            </h2>
            <ul className="mt-6 flex flex-col gap-6 max-w-[52ch]">
              <li className="brutal-card p-5">
                <span className="brutal-tag bg-saffron">
                  Sunday Buffet
                </span>
                <p className="mt-3 text-[17px] leading-[1.65] text-ink">
                  Adult £14.95 · Child (under 10) £9.95 · 12.00pm – 2.00pm.
                </p>
              </li>
              <li className="brutal-card p-5">
                <span className="brutal-tag bg-saffron">
                  Free Delivery
                </span>
                <p className="mt-3 text-[17px] leading-[1.65] text-ink">
                  Within two miles on orders over £20. Tiered charges further afield.
                </p>
              </li>
              <li className="brutal-card p-5">
                <span className="brutal-tag bg-saffron">
                  Book Your Party
                </span>
                <p className="mt-3 text-[17px] leading-[1.65] text-ink">
                  Birthdays, weddings, office gatherings — leave the cooking to us.
                </p>
              </li>
            </ul>
            <Link
              href="/offers"
              className="mt-8 caps-track inline-flex items-center justify-center border-[3px] border-ink bg-saffron px-7 h-11 text-[12px] font-bold text-ink hover:bg-saffron/90 transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              See All Offers
            </Link>
          </div>
        </Reveal>

        <Reveal direction="right" delay={150} className="order-1 md:order-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden brutal-frame">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
