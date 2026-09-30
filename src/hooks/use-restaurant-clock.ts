"use client";

import { useSyncExternalStore } from "react";
import { restaurantNow, type RestaurantClock } from "@/lib/booking";

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 30_000);
  return () => window.clearInterval(id);
}

// A string snapshot stays equal between ticks, so React doesn't re-render.
function read() {
  const { date, minutes } = restaurantNow();
  return `${date}|${minutes}`;
}

/**
 * Restaurant (UK) date and time, read in the browser only — pages are
 * prerendered, so a render-time "today" would be the build date. Null on
 * the server and during hydration; ticks every 30s so same-day time slots
 * drop off as they pass.
 */
export function useRestaurantClock(): RestaurantClock | null {
  const snapshot = useSyncExternalStore(subscribe, read, () => "");
  if (!snapshot) return null;
  const [date, minutes] = snapshot.split("|");
  return { date, minutes: Number(minutes) };
}
