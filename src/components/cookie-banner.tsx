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
      <div className="mx-auto max-w-[960px] brutal-card bg-background px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
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
            className="caps-track inline-flex h-9 items-center justify-center border-[3px] border-ink bg-background px-5 text-[11px] font-bold text-ink hover:bg-ink hover:text-background [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="caps-track inline-flex h-9 items-center justify-center border-[3px] border-ink bg-ink px-5 text-[11px] font-bold text-background hover:bg-ink/85 [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
