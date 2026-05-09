"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "ms-cookie-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return "accepted";
  }
}
function getServerSnapshot() {
  return "accepted";
}

export function CookieBanner() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  if (stored || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:left-6 md:right-6 md:bottom-6"
    >
      <div className="mx-auto max-w-[960px] rounded-md border border-oxblood-dark/15 bg-cream/95 backdrop-blur-md shadow-lg px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="text-[13px] md:text-[14px] text-ink/85 leading-relaxed">
          We use a few cookies to track usage and remember your preferences.
          See our{" "}
          <Link href="/cookies" className="link-rule text-oxblood font-medium">
            cookie policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 md:ml-auto">
          <button
            type="button"
            onClick={() => dismiss("declined")}
            className="caps-track-tight text-[11px] font-semibold text-oxblood-dark/80 hover:text-oxblood px-3 h-9"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-5 h-9 text-[11px] font-semibold text-cream hover:bg-oxblood transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
