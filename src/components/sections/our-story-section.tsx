import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../reveal";


/**
 * "Our Story" — long-form welcome on the landing page. Cream background,
 * large serif heading, two-column body with a portrait photo at right.
 */
export function OurStorySection() {
  return (
    <section id="story" className="bg-background border-t-[3px] border-ink py-16 md:py-24">
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
            <div className="space-y-5 text-[17px] md:text-[17px] leading-[1.65] text-ink max-w-[58ch]">
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
              <p className="font-display italic text-[19px] text-saffron">
                Embark on a culinary journey inspired by the ancient spice
                route — right here in Maidenhead.
              </p>
              <Link
                href="/about"
                className="caps-track inline-flex items-center justify-center border-[3px] border-ink px-6 h-10 text-[11px] font-bold text-ink hover:bg-ink hover:text-background transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                Read Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" delay={200}>
            <figure className="relative brutal-frame">
              <div className="relative aspect-[3/4] overflow-hidden">
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
