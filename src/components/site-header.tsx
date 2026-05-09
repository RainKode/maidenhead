"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, ctaLinks, contact } from "@/lib/content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "bg-cream/95 backdrop-blur-md border-b border-oxblood-dark/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-cream border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-16 md:h-[88px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2 md:gap-5">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-ml-2 inline-flex items-center gap-2 p-2 text-oxblood-dark hover:text-oxblood transition-colors lg:hidden"
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
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "caps-track-tight relative text-[11px] font-semibold transition-colors",
                    active
                      ? "text-oxblood"
                      : "text-oxblood-dark/85 hover:text-oxblood"
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
          className="font-display text-[18px] md:text-[26px] tracking-[0.18em] text-oxblood-dark whitespace-nowrap"
        >
          MAIDENHEAD SPICE
        </Link>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          <a
            href={`tel:${contact.phones[0].replace(/\s+/g, "")}`}
            aria-label="Call us"
            className="hidden md:inline-flex items-center gap-2 caps-track-tight text-[11px] font-semibold text-oxblood-dark hover:text-oxblood transition-colors"
          >
            <Phone className="size-4" strokeWidth={1.5} />
            <span>{contact.phones[0]}</span>
          </a>
          <Link
            href={ctaLinks.order}
            className="caps-track hidden sm:inline-flex items-center justify-center rounded-full border border-oxblood-dark px-4 md:px-5 h-9 md:h-10 text-[11px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
          >
            Order
          </Link>
          <Link
            href={ctaLinks.book}
            className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-4 md:px-6 h-9 md:h-10 text-[11px] font-semibold text-cream hover:bg-oxblood transition-colors"
          >
            Book
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-oxblood-dark/10 transition-[max-height,opacity] duration-300",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="bg-cream px-6 py-6 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={closeDrawer}
              className={cn(
                "font-display text-[20px] tracking-tight",
                isActive(l.href) ? "text-oxblood" : "text-ink/85"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${contact.phones[0].replace(/\s+/g, "")}`}
            onClick={closeDrawer}
            className="caps-track-tight text-[12px] text-oxblood-dark mt-2"
          >
            Call · {contact.phones[0]}
          </a>
        </nav>
      </div>
    </header>
  );
}
