import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../reveal";
type Card = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
};

const CARDS: Card[] = [
  {
    title: "Menu",
    subtitle: "Starters, tandoor, biryani and beyond",
    href: "/menus",
    image: "/images/ambience/IMG-20251030-WA0045.jpg",
    imageAlt: "Curry in a balti dish served with bread and red wine",
  },
  {
    title: "Book a Table",
    subtitle: "Lunch, dinner and our Sunday buffet",
    href: "/book",
    image: "/images/ambience/IMG-20251030-WA0060.jpg",
    imageAlt: "The Maidenhead Spice dining room with Cobra-branded bar in the foreground",
  },
  {
    title: "Order Online",
    subtitle: "Free delivery within two miles",
    href: "/order",
    image: "/images/ambience/IMG-20251030-WA0030.jpg",
    imageAlt: "Spiced chicken jalfrezi with peppers and onions",
  },
];

/**
 * Three giant image cards — Menu / Book a Table / Order Online — the
 * primary action trio on the landing page.
 */
export function MenuBookOrderSection() {
  return (
    <section id="menus" className="bg-background border-t-[3px] border-ink py-16 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 text-center">
        <Reveal>
          <p className="caps-track text-[12px] text-oxblood mb-3">
            View menus, book tables, or order online
          </p>
          <h2 className="font-display text-[28px] md:text-[42px] lg:text-[52px] leading-[1.15] tracking-[0.04em] uppercase text-ink mx-auto max-w-3xl">
            Three ways to enjoy Maidenhead Spice
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 md:mt-16 max-w-[1240px] px-6 md:px-10 grid gap-8 md:gap-10 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 90}>
            <PromoCard {...c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PromoCard({ title, subtitle, href, image, imageAlt }: Card) {
  return (
    <Link
      href={href}
      className="brutal-card brutal-interactive group relative block aspect-[4/5] overflow-hidden"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/20 group-hover:bg-ink/30 transition-colors"
      />

      <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
        <div className="relative bg-background border-[3px] border-ink px-6 py-7 md:px-8 md:py-9 text-center [box-shadow:var(--shadow-brutal)]">
          <h3 className="caps-track font-display text-[16px] md:text-[18px] text-ink font-bold">
            {title}
          </h3>
          <p className="mt-2 italic font-display text-[15px] md:text-[16px] text-ink/80">
            {subtitle}
          </p>
          <div className="mt-4 flex justify-end">
            <span className="brutal-tag bg-saffron">Explore</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
