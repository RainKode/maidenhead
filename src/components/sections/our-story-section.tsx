import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../reveal";


/**
 * "Our Story" — long-form welcome on the landing page. Cream background,
 * large serif heading, two-column body with a portrait photo at right.
 */
export function OurStorySection() {
  return (
    <section id="story" className="bg-cream border-t border-ink/20 py-16 md:py-24">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <p className="caps-track text-center text-[12px] text-oxblood mb-6">
          Our Story
        </p>

        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center font-display text-[28px] md:text-[36px] lg:text-[42px] leading-[1.25] text-ink">
            At Maidenhead Spice, we invite you to discover{" "}
            <span className="text-muted-foreground italic">
              vibrant and authentic Indian flavours
            </span>{" "}
            — your local destination for an extraordinary culinary experience.
          </h2>
        </Reveal>

        <div className="mt-12 md:mt-16 grid gap-10 md:grid-cols-[1fr_minmax(280px,360px)] items-start">
          <Reveal direction="left" delay={120}>
            <div className="space-y-5 text-[17px] md:text-[18px] leading-[1.7] text-ink/90 max-w-[58ch]">
              <p>
                Our story is inspired by the ancient spice route — an exotic
                journey of flavour, culture and tradition. That same journey
                drives us today, here on Bridge Road, to celebrate our rich
                heritage while creating dishes that feel familiar and
                surprising in equal measure.
              </p>
              <p>
                We are not just cooking. We are bringing the authentic story of
                India to your table — slow-cooked curries, fragrant biryanis,
                charcoal-kissed kebabs and the simple joy of sharing a good
                meal with the people you love.
              </p>
              <p className="font-display italic text-[19px] text-ink">
                Embark on a culinary journey inspired by the ancient spice
                route — right here in Maidenhead.
              </p>
              <Link
                href="/about"
                className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-6 h-10 text-[11px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
              >
                Read Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" delay={200}>
            <figure className="relative">
              <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-ink/30">
                <Parallax distance={60} className="absolute inset-0">
                  <Image
                    src="/images/ambience/IMG-20251030-WA0016.jpg"
                    alt="Tufted cream banquette seating with tables set for dinner at Maidenhead Spice"
                    fill
                    sizes="(min-width: 768px) 360px, 100vw"
                    className="object-cover scale-[1.12]"
                  />
                </Parallax>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
