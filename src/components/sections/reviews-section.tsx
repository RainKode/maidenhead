import Link from "next/link";
import { Reveal } from "../reveal";
import { reviews } from "@/lib/reviews";
import { Star } from "lucide-react";

/**
 * Infinite auto-scrolling marquee of guest reviews. Duplicates the list
 * so the strip loops seamlessly. Pauses on hover via pure CSS.
 */
export function ReviewsSection() {
  const strip = [...reviews, ...reviews];

  return (
    <section className="bg-[#f1f1f6] py-16 md:py-20 border-y-[3px] border-ink overflow-hidden">
      {/* Heading */}
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center mb-12">
        <Reveal>
          <p className="caps-track text-[12px] text-oxblood">Treasured guests</p>
          <h2 className="mt-3 font-display text-[28px] md:text-[40px] text-ink">
            Kind words from Maidenhead
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-[15px] md:text-[16px] text-ink/75 italic font-display">
            What our regulars and first-time visitors have been saying —
            collected from Google and TripAdvisor.
          </p>
        </Reveal>
      </div>

      {/* Scrolling track */}
      <div className="marquee-track relative">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{ background: "linear-gradient(to right, var(--cream-deep), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{ background: "linear-gradient(to left, var(--cream-deep), transparent)" }}
        />

        <ul className="animate-marquee flex gap-6 w-max">
          {strip.map((r, i) => (
            <li key={i} className="w-[320px] shrink-0">
              <article className="h-full brutal-card px-6 py-7 flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star
                      key={k}
                      className="size-[13px] fill-saffron stroke-saffron"
                    />
                  ))}
                </div>
                <p className="font-display italic text-[16px] leading-[1.65] text-ink/90">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center justify-between text-[11px]">
                <span className="caps-track-tight font-bold text-ink">{r.author}</span>
                  <span className="caps-track text-[10px] text-oxblood">{r.source}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/reviews"
          className="caps-track inline-flex items-center justify-center border-[3px] border-ink px-7 h-11 text-[12px] font-bold text-ink hover:bg-ink hover:text-background transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          Read all reviews
        </Link>
      </div>
    </section>
  );
}
