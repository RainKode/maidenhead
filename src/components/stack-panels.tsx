"use client";

import { cn } from "@/lib/utils";

/**
 * Wrap a page section to make it part of a sticky "card stack". Each panel
 * pins at the top of the viewport with an increasing z-index, so the next
 * panel slides up and covers the previous one as you scroll, and uncovers
 * on the way back — the Apple-style page reveal.
 *
 * Each section needs a solid background of its own (`bg-cream`,
 * `bg-oxblood-dark`, etc.) so it actually covers the panel beneath.
 *
 * Usage:
 * ```tsx
 * <StackPanels>
 *   <StackPanel index={0}><HeroSection /></StackPanel>
 *   <StackPanel index={1}><OurStorySection /></StackPanel>
 *   ...
 * </StackPanels>
 * ```
 */
export function StackPanels({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // `isolate` creates a fresh stacking context so panel z-index stays local.
  return <div className={cn("relative isolate", className)}>{children}</div>;
}

export function StackPanel({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  /** 0-based stacking order — later panels sit on top. */
  index: number;
  className?: string;
}) {
  return (
    <div
      className={cn("sticky top-0", className)}
      style={{ zIndex: index + 1 }}
    >
      {children}
    </div>
  );
}

