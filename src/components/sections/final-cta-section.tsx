import Link from "next/link";
import { ctaLinks } from "@/lib/content";
import { Reveal, RevealItem, RevealStagger } from "../reveal";

/**
 * Final landing-page call to action band — three pill buttons for the most
 * common visitor intents: view the menu, order online, book a table.
 */
export function FinalCtaSection() {
  return (
    <section className="bg-ink py-16 md:py-20 border-t-[3px] border-ink">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <Reveal>
          <p className="caps-track text-[12px] text-saffron">Maidenhead Spice</p>
          <h2 className="mt-3 font-display text-[28px] md:text-[40px] text-saffron mx-auto max-w-2xl">
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
              className="caps-track inline-flex items-center justify-center border-[3px] border-background px-7 h-11 text-[12px] font-bold text-background hover:bg-background hover:text-ink transition-colors [box-shadow:5px_5px_0_var(--saffron)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              View Menu
            </Link>
          </RevealItem>
          <RevealItem>
            <Link
              href={ctaLinks.order}
              className="caps-track inline-flex items-center justify-center border-[3px] border-ink bg-saffron px-7 h-11 text-[12px] font-bold text-ink hover:bg-saffron/90 transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Order Online
            </Link>
          </RevealItem>
          <RevealItem>
            <Link
              href={ctaLinks.book}
              className="caps-track inline-flex items-center justify-center border-[3px] border-background bg-ink px-7 h-11 text-[12px] font-bold text-background hover:bg-ink/80 transition-colors [box-shadow:5px_5px_0_var(--saffron)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Book a Table
            </Link>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}
