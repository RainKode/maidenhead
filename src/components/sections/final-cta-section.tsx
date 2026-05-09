import Link from "next/link";
import { ctaLinks } from "@/lib/content";
import { Reveal, RevealItem, RevealStagger } from "../reveal";

/**
 * Final landing-page call to action band — three pill buttons for the most
 * common visitor intents: view the menu, order online, book a table.
 */
export function FinalCtaSection() {
  return (
    <section className="bg-cream py-16 md:py-20 border-t border-ink/20">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <Reveal>
          <p className="caps-track text-[12px] text-oxblood">Maidenhead Spice</p>
          <h2 className="mt-3 font-display text-[28px] md:text-[40px] text-ink mx-auto max-w-2xl">
            Hungry yet? We have you covered.
          </h2>
        </Reveal>
        <RevealStagger
          delay={0.15}
          stagger={0.1}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <RevealItem>
            <Link
              href={ctaLinks.menus}
              className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
            >
              View Menu
            </Link>
          </RevealItem>
          <RevealItem>
            <Link
              href={ctaLinks.order}
              className="caps-track inline-flex items-center justify-center rounded-full bg-saffron px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-saffron-dark transition-colors"
            >
              Order Online
            </Link>
          </RevealItem>
          <RevealItem>
            <Link
              href={ctaLinks.book}
              className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
            >
              Book a Table
            </Link>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}
