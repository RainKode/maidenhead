import { cn } from "@/lib/utils";

/** Decorative engraved double rule used between Dishoom sections. */
export function DoubleRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[3px] w-full", className)} aria-hidden="true">
      <span className="block h-px bg-current opacity-70" />
      <span className="block h-[3px] bg-current opacity-90" />
      <span className="block h-px bg-current opacity-70" />
    </div>
  );
}

/** Hand-drawn long arrow used in CTAs. */
export function LongArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 12" fill="none" className={cn("h-[10px] w-16", className)} aria-hidden="true">
      <path
        d="M0 6h58M52 1l8 5-8 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "All Welcome" devanagari + english + decorative curl, used in hero. */
export function AllWelcomeMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-cream", className)}>
      <span className="font-display text-[22px] leading-none">सभी का स्वागत</span>
      <svg viewBox="0 0 80 10" className="h-2 w-20 opacity-80" fill="none" aria-hidden="true">
        <path
          d="M2 5 Q 20 -2 40 5 T 78 5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="caps-track text-[11px]">All Welcome · Open 7 Days</span>
    </div>
  );
}
