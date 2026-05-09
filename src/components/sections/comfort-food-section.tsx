import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../reveal";


/**
 * "Authentic Indian Comfort Food" — eyebrow + display heading, two columns
 * of body copy, accompanied by a triptych of food photography.
 */
export function ComfortFoodSection() {
  return (
    <section className="bg-cream border-t border-ink/20 py-16 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <p className="caps-track text-center text-[12px] text-oxblood mb-3">
            Authentic Indian comfort food
          </p>
          <h2 className="text-center font-display text-[30px] md:text-[42px] lg:text-[52px] leading-[1.15] text-ink mx-auto max-w-2xl">
            A neighbourhood feast, every night of the week
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-12 items-start">
          <Reveal direction="left" className="md:col-span-7">
            <div className="grid gap-5 text-[17px] leading-[1.7] text-ink/90 md:columns-2 md:gap-10 [&>p]:break-inside-avoid">
              <p className="font-display italic text-[20px] md:text-[22px] text-ink">
                At Maidenhead Spice, we cook the food we grew up loving.
              </p>
              <p>
                Begin with crisp onion bhajis or smoky tandoori chaat. Move on
                to a slow-cooked Lamb Rogan Josh, a fragrant Chicken Tikka
                Biryani, or our house Maidenhead Spice Curry — a quiet
                favourite among regulars.
              </p>
              <p>
                Vegetarians eat well here. Paneer Makhani, Tarka Daal, Aloo
                Gobi, Saag Paneer — proper home-cooking at the kind of pace
                that lets the spices speak.
              </p>
              <p>
                Order in plenty of breads — fluffy naans, flaky parathas, a
                stack of buttery rotis — and a few sides to share. Sunday is
                buffet day; bring the family and stay a while.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right" delay={120} className="md:col-span-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <FoodTile
                src="/images/ambience/IMG-20251030-WA0070.jpg"
                alt="Tandoori platter with salad and a glass of wine"
                caption="Tandoori platter"
                tall
              />
              <div className="grid gap-3 md:gap-4">
                <FoodTile
                  src="/images/ambience/IMG-20251030-WA0055.jpg"
                  alt="Chargrilled chicken tikka in a steel serving bowl"
                  caption="Chicken tikka"
                />
                <FoodTile
                  src="/images/ambience/IMG-20251030-WA0010.jpg"
                  alt="Sizzling tandoori platters fresh from the kitchen"
                  caption="Tandoori grills"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/menus"
            className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-medium text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
          >
            View menus
          </Link>
          <Link
            href="/book"
            className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-medium text-cream hover:bg-oxblood transition-colors"
          >
            Book a table
          </Link>
        </div>
      </div>
    </section>
  );
}

function FoodTile({
  src,
  alt,
  caption,
  tall,
}: {
  src: string;
  alt: string;
  caption: string;
  tall?: boolean;
}) {
  return (
    <figure className="relative">
      <div
        className={`relative ${tall ? "aspect-[3/5]" : "aspect-[4/3]"} overflow-hidden ring-1 ring-ink/30`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 caps-track-tight text-[10px] text-ink/60">
        Above · {caption}
      </figcaption>
    </figure>
  );
}
