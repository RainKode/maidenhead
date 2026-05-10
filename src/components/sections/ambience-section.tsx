import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "../reveal";

/**
 * "Ambience" — wide cinematic image with overlaid heading, leading into a
 * short prose block and a CTA toward the gallery.
 */
export function AmbienceSection() {
  return (
    <section id="ambience" className="bg-cream">
        <div className="relative h-[64vh] min-h-[420px] max-h-[640px] w-full overflow-hidden brutal-frame">
        <Parallax distance={120} className="absolute inset-0">
          <div className="relative h-[120%] w-full -mt-[10%]">
            <Image
              src="/images/ambience/IMG-20251030-WA0008.jpg"
              alt="The Maidenhead Spice dining room — bar, chandeliers and warm amber light"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-oxblood-dark/45" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Reveal direction="up" duration={1} distance={40}>
            <h2 className="max-w-3xl text-center font-display italic text-cream text-[26px] md:text-[36px] lg:text-[44px] leading-[1.25]">
              Home is where the heart is — and we have poured ours into every
              corner of this room.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-6 md:px-10 py-16 md:py-20 text-center">
        <Reveal>
          <p className="caps-track text-[12px] text-oxblood mb-4">Ambience</p>
          <p className="font-display text-[19px] md:text-[21px] leading-[1.7] text-ink/85">
            We cannot replicate your home — but we can offer you a warm,
            stunning space for your culinary journey. Come and relax in
            immersive surroundings; take a peek at Maidenhead Spice.
          </p>
          <Link
            href="/gallery"
            className="mt-8 caps-track inline-flex items-center justify-center border-[3px] border-ink px-7 h-11 text-[12px] font-bold text-ink hover:bg-ink hover:text-background transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            View Gallery
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
