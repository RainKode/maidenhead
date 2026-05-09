"use client";

import { useEffect, useRef, useState } from "react";
import { AllWelcomeMark, DoubleRule } from "../ornaments";

/**
 * Hero — mirrors dishoom.com's signature scroll-driven scale-up.
 * Outer container is 150vh tall and the inner panel sticks at top:0 so as
 * the user scrolls the rounded media expands from 0.78 → 1.0 and the
 * border-radius eases from 24px → 0px, finally filling the viewport.
 */
export function HeroSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      // distance scrolled past the top of the wrap, normalised over (height - vh)
      const scrolled = -rect.top;
      const span = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, scrolled / Math.max(1, span)));
      setProgress(p);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ease the value so it feels like Dishoom's curve
  const eased = 1 - Math.pow(1 - progress, 2);
  const scale = 0.78 + 0.22 * eased; // 0.78 → 1.0
  const radius = 28 * (1 - eased); // 28px → 0px
  const overlay = 0.15 + 0.45 * eased; // dim grows as it fills

  return (
    <section className="relative bg-oxblood-dark text-cream">
      <div ref={wrapRef} className="relative h-[160vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[rgb(21,21,21)]">
          <div
            className="absolute inset-0 m-auto h-full w-full overflow-hidden will-change-transform"
            style={{
              transform: `scale(${scale.toFixed(4)})`,
              borderRadius: `${radius.toFixed(2)}px`,
              transition: "transform 60ms linear, border-radius 60ms linear",
            }}
          >
            <video
              src="/videos/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(0,0,0,${(overlay * 0.4).toFixed(3)}) 0%, rgba(0,0,0,${overlay.toFixed(3)}) 100%)`,
              }}
            />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center px-6">
            <blockquote
              className="max-w-3xl text-center font-display italic text-cream leading-[1.25] tracking-[0.01em]"
              style={{
                opacity: 0.4 + 0.6 * eased,
                transform: `translateY(${(1 - eased) * 16}px)`,
                fontSize: "clamp(22px, 3.4vw, 40px)",
              }}
            >
              &ldquo;Embark on a culinary journey inspired by the ancient spice
              route — right here in Maidenhead.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-10 md:-mt-14 flex flex-col items-center gap-6 pb-10 md:pb-16 px-6">
        <AllWelcomeMark />
      </div>

      <div className="relative bg-cream pt-1">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-2 text-oxblood-dark">
          <DoubleRule />
        </div>
      </div>
    </section>
  );
}
