import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { GoogleReviewsWidget } from "@/components/google-reviews-widget";
import { socials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What our guests are saying about Maidenhead Spice on Google and TripAdvisor.",
};

export default function ReviewsPage() {
  const google = socials.find((s) => s.label === "Google")!;
  const tripadvisor = socials.find((s) => s.label === "TripAdvisor")!;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Treasured guests"
          title="Reviews"
          subtitle="Real words from real guests — pulled live from Google."
        />

        {/* ── Rating summary + CTAs ───────────────────────────────────────── */}
        <section className="bg-cream border-b border-ink/10 py-12 md:py-16">
          <div className="mx-auto max-w-[700px] px-6 md:px-10 text-center">
            <div className="inline-flex items-center gap-1.5 text-saffron-dark">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star
                  key={k}
                  className="size-5 fill-saffron-dark stroke-saffron-dark"
                />
              ))}
            </div>
            <p className="mt-3 font-display text-[32px] md:text-[40px] leading-none text-ink">
              Rated 4.8 on Google
            </p>
            <p className="mt-3 text-[15px] text-ink/65 font-display italic">
              We are grateful for every kind word. If you have dined with us,
              please consider leaving a review — it means the world to us.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={google.href}
                target="_blank"
                rel="noreferrer"
                className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
              >
                Leave a Google review
              </Link>
              <Link
                href={tripadvisor.href}
                target="_blank"
                rel="noreferrer"
                className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
              >
                Leave a TripAdvisor review
              </Link>
            </div>
          </div>
        </section>

        {/* ── Live Google Reviews widget ──────────────────────────────────── */}
        <section className="bg-cream-deep py-14 md:py-20">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            {/* Decorative rule */}
            <div className="flex items-center gap-4 mb-10 max-w-[480px] mx-auto">
              <span className="flex-1 h-px bg-ink/15" />
              <span className="caps-track text-[11px] text-ink/45 shrink-0">
                Live from Google
              </span>
              <span className="flex-1 h-px bg-ink/15" />
            </div>

            {/* Widget — rendered inside a thin brand border */}
            <div className="border border-ink/10 bg-cream p-4 md:p-6">
              <GoogleReviewsWidget />
            </div>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
