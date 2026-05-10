type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: "cream" | "oxblood";
};

/**
 * Shared page-level hero band. Mirrors the typographic rhythm of the
 * landing-page sections: small caps eyebrow → display heading → italic
 * subtitle → engraved double rule.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "cream",
}: PageHeroProps) {
  const isOx = variant === "oxblood";
  return (
    <section
      className={
        isOx
          ? "bg-ink text-background py-20 md:py-28 border-b-[3px] border-saffron"
          : "bg-background text-ink py-20 md:py-28 border-b-[3px] border-ink"
      }
    >
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        {eyebrow ? (
          <p
            className={
              isOx
                ? "caps-track text-[12px] text-saffron"
                : "caps-track text-[12px] text-oxblood"
            }
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={
            "mt-4 font-display text-[34px] md:text-[52px] lg:text-[60px] leading-[1.05] uppercase tracking-[0.03em] " +
            (isOx ? "text-background" : "text-ink")
          }
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={
              "mt-6 mx-auto max-w-2xl font-body italic text-[18px] md:text-[20px] " +
              (isOx ? "text-background/85" : "text-ink/80")
            }
          >
            {subtitle}
          </p>
        ) : null}
        <div className="brutal-divider mx-auto mt-10" />
      </div>
    </section>
  );
}
