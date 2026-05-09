"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const distanceFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Reveal-on-scroll wrapper powered by Motion's `whileInView`. Fades and
 * slides the child into place the first time it intersects the viewport.
 * Respects `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 28,
  once = true,
  amount = 0.2,
  className,
}: {
  children: React.ReactNode;
  direction?: Direction;
  /** Accepts seconds, or legacy milliseconds (any value > 5 is treated as ms). */
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? { x: 0, y: 0 } : distanceFor(direction, distance);
  const delaySec = delay > 5 ? delay / 1000 : delay;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delaySec,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers direct children as they scroll into view. Pair
 * with `<RevealItem>` for individual items.
 */
export function RevealStagger({
  children,
  delay = 0,
  stagger = 0.12,
  amount = 0.2,
  once = true,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduce ? 0 : delay,
        staggerChildren: reduce ? 0 : stagger,
      },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  distance = 24,
  duration = 0.7,
  className,
}: {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  className?: string;
}) {
  const offset = distanceFor(direction, distance);
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: [0.22, 1, 0.36, 1] } as Transition,
    },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/**
 * Vertical parallax wrapper. Translates the child by `distance` pixels as
 * the surrounding element scrolls through the viewport.
 */
export function Parallax({
  children,
  distance = 80,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [distance, -distance]
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scale-in-on-scroll wrapper — child grows slightly and fades as it enters
 * the viewport. Nice for hero photography.
 */
export function ScaleIn({
  children,
  from = 0.92,
  duration = 0.9,
  className,
}: {
  children: React.ReactNode;
  from?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: reduce ? 1 : from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: reduce ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
