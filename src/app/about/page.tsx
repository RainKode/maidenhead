import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { DoubleRule } from "@/components/ornaments";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Inspired by the ancient spice route, Maidenhead Spice brings authentic Indian flavours to Bridge Road — slow-cooked, generously spiced, served with warmth.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Namaste & Welcome"
          title="About Us"
          subtitle="A neighbourhood Indian restaurant in the heart of Maidenhead, serving the food we grew up loving."
        />

        <section className="bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-[760px] px-6 md:px-10 text-center">
            <p className="caps-track text-[12px] text-oxblood mb-4">About Us</p>
            <h2 className="font-display text-[28px] md:text-[36px] leading-[1.25] text-ink">
              Our passion is to be your{" "}
              <span className="italic text-oxblood">finest</span> Indian
              restaurant in Maidenhead.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink/85">
              <p>
                We are dedicated to creating a memorable dining experience by
                blending authentic, traditional flavours with a modern
                culinary style. Our team is here to provide warm, friendly
                service in a stunning, immersive setting for our entire
                community to enjoy.
              </p>
              <p>
                Whether you are popping in for the Sunday buffet, ordering a
                quiet weeknight curry or hosting a celebration with us — we
                are glad you are here.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-oxblood-dark text-cream py-20 md:py-28">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-12 md:grid-cols-[1fr_minmax(280px,360px)] items-center">
            <div className="text-center md:text-left">
              <p className="caps-track text-[12px] text-saffron mb-4">
                Our Story
              </p>
              <h2 className="font-display text-[30px] md:text-[44px] leading-[1.1] text-cream">
                A journey along the{" "}
                <span className="italic text-saffron">spice route</span>.
              </h2>
              <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-cream/85 max-w-[55ch]">
                <p>
                  Our story is inspired by the ancient spice route — an exotic
                  journey of flavour, culture and tradition. Our passion is to
                  bring this culinary adventure to Maidenhead.
                </p>
                <p>
                  This drives us to celebrate our rich heritage while creating
                  unique, innovative dishes. We are not just cooking — we are
                  bringing the authentic story of India to your table.
                </p>
                <p className="font-display italic text-[19px] text-saffron/95">
                  Every plate carries a little of where we came from, and a
                  lot of where we are now.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                <Link
                  href="/menus"
                  className="caps-track inline-flex items-center justify-center rounded-full bg-saffron px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-saffron-dark transition-colors"
                >
                  View the Menu
                </Link>
                <Link
                  href="/book"
                  className="caps-track inline-flex items-center justify-center rounded-full border border-cream/70 px-7 h-11 text-[12px] font-semibold text-cream hover:bg-cream hover:text-oxblood-dark transition-colors"
                >
                  Book a Table
                </Link>
              </div>
            </div>

            <figure className="relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/ambience/IMG-20251030-WA0025.jpg"
                  alt="Private dining booth with striped wall panelling at Maidenhead Spice"
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -top-3 -left-3 -bottom-3 -right-3 border border-saffron/40"
              />
            </figure>
          </div>
        </section>

        <section className="bg-cream py-16">
          <div className="mx-auto max-w-[600px] px-6 text-oxblood/70">
            <DoubleRule />
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
