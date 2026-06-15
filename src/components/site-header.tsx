"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, ctaLinks, contact } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeDrawer = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

  return (
    <header className="sticky top-0 z-50 bg-background border-b-[3px] border-ink">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-16 md:h-[88px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2 md:gap-5">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-ml-2 inline-flex items-center gap-2 p-2 text-ink hover:text-oxblood transition-colors lg:hidden"
          >
            {open ? (
              <X className="size-[22px]" strokeWidth={1.5} />
            ) : (
              <Menu className="size-[22px]" strokeWidth={1.5} />
            )}
            <span className="caps-track-tight hidden sm:inline text-[11px] font-medium">
              {open ? "Close" : "Menu"}
            </span>
          </button>
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "caps-track-tight relative text-[13px] font-bold transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink/70 hover:text-ink"
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 right-0 -bottom-1 h-px bg-oxblood transition-transform duration-300 origin-left",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/"
          aria-label="Maidenhead Spice — home"
          className="font-display text-[18px] md:text-[26px] tracking-[0.18em] text-ink whitespace-nowrap"
        >
          MAIDENHEAD SPICE
        </Link>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          <a
            href={`tel:${contact.phones[0].replace(/\s+/g, "")}`}
            aria-label="Call us"
            className="hidden md:inline-flex items-center gap-2 caps-track-tight text-[11px] font-bold text-ink hover:text-oxblood transition-colors"
          >
            <Phone className="size-4" strokeWidth={1.5} />
            <span>{contact.phones[0]}</span>
          </a>
          <Link
            href={ctaLinks.order}
            className="caps-track hidden sm:inline-flex items-center justify-center border-[3px] border-ink px-4 md:px-5 h-9 md:h-10 text-[11px] font-bold text-ink hover:bg-ink hover:text-background transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            Order
          </Link>
          <Link
            href={ctaLinks.book}
            className="caps-track inline-flex items-center justify-center border-[3px] border-ink bg-saffron px-4 md:px-6 h-9 md:h-10 text-[11px] font-bold text-ink hover:bg-saffron/90 transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            Book
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t-[3px] border-ink transition-[max-height,opacity] duration-300",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="bg-background px-6 py-6 flex flex-col gap-4 [box-shadow:var(--shadow-brutal)]">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={closeDrawer}
              className={cn(
                "font-display text-[20px] tracking-tight font-bold uppercase tracking-[0.08em]",
                isActive(l.href) ? "text-ink" : "text-ink/70"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${contact.phones[0].replace(/\s+/g, "")}`}
            onClick={closeDrawer}
            className="caps-track-tight text-[12px] text-ink/70 mt-2"
          >
            Call · {contact.phones[0]}
          </a>
        </nav>
      </div>
    </header>
  );
}
