"use client";

import Link from "next/link";
import { contact, hours, legalLinks, navLinks, siteInfo, socials } from "@/lib/content";

/**
 * Newsletter + footer. Cream-deep background, centred newsletter, three
 * columns of nav/contact, social row with proper Facebook / TripAdvisor /
 * Google icons, and a policy line.
 */
export function NewsletterFooter() {
  return (
    <footer className="bg-background border-t-[3px] border-ink">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-20">
        <div className="text-center max-w-xl mx-auto">
          <p className="caps-track text-[12px] text-oxblood">Stay in touch</p>
          <h3 className="mt-3 font-display text-[24px] md:text-[30px] text-ink">
            Subscribe for offers & news
          </h3>
          <p className="mt-3 text-[15px] italic font-display text-ink/75">
            First-dibs on Sunday buffet specials, seasonal menus and the
            occasional recipe — straight to your inbox.
          </p>

          <form
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="First name" name="first" />
            <Field label="Email address" name="email" type="email" />
            <p className="sm:col-span-2 text-[12px] text-ink/60 italic">
              I consent to receive occasional emails about offers and events,
              in line with the Maidenhead Spice{" "}
              <Link href="/privacy" className="link-rule text-oxblood">
                privacy policy
              </Link>
              .
            </p>
            <button
              type="submit"
              className="sm:col-span-2 caps-track inline-flex items-center justify-center border-[3px] border-ink bg-saffron px-7 h-11 text-[12px] font-bold text-ink hover:bg-saffron/90 [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 border-t-[3px] border-ink pt-12">
          <div>
            <h4 className="caps-track text-[11px] font-bold text-ink mb-4">Visit</h4>
            <address className="not-italic font-display text-[16px] text-ink/85 leading-relaxed">
              {contact.addressLine1}
              <br />
              {contact.addressLine2}
              <br />
              {contact.postcode}
            </address>
            <Link
              href="/contact"
              className="mt-4 inline-block caps-track-tight text-[11px] text-oxblood link-rule"
            >
              Get directions
            </Link>
          </div>

          <div>
            <h4 className="caps-track text-[11px] font-bold text-ink mb-4">Hours</h4>
            <ul className="space-y-1.5 font-display text-[15px] text-ink/85">
              <li>{hours.summary}</li>
              <li>{hours.dinner}</li>
              <li>{hours.sundayBuffet}</li>
            </ul>
          </div>

          <div>
            <h4 className="caps-track text-[11px] font-bold text-ink mb-4">
              Get in touch
            </h4>
            <ul className="space-y-2 font-display text-[16px] text-ink/85">
              {contact.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s+/g, "")}`}
                    className="link-rule"
                  >
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link-rule"
                >
                  WhatsApp · {contact.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="link-rule">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="caps-track text-[11px] font-bold text-ink mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-display text-[16px] text-ink/85 link-rule"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t-[3px] border-ink pt-10">
          <div>
            <p className="font-display text-[18px] italic text-ink">
              From our Kitchen to your table.
            </p>
            <p className="mt-2 text-[12px] text-ink/60">
              {siteInfo.name} © {new Date().getFullYear()}. All rights reserved.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-ink/60 link-rule"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <p className="caps-track-tight text-[11px] font-bold text-ink">
              Find us online
            </p>
            <ul className="flex items-center gap-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-10 items-center justify-center border-[2px] border-ink text-ink hover:bg-ink hover:text-background transition-colors"
                  >
                    <SocialIcon name={s.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] font-bold text-ink uppercase tracking-[0.08em]">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="bg-transparent border-0 border-b-[3px] border-ink px-0 h-10 text-[15px] text-ink placeholder:italic placeholder:text-ink/40 focus:outline-none focus:border-saffron"
      />
    </label>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "Facebook") return <FacebookMark />;
  if (name === "TripAdvisor") return <TripAdvisorMark />;
  if (name === "Google") return <GoogleMark />;
  if (name === "Instagram") return <InstagramMark />;
  if (name === "TikTok") return <TikTokMark />;
  if (name === "X") return <XMark />;
  if (name === "Threads") return <ThreadsMark />;
  return null;
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7.5h2.55l.38-2.95H13.5V8.7c0-.85.24-1.43 1.46-1.43h1.56V4.62a21 21 0 0 0-2.27-.12c-2.25 0-3.78 1.37-3.78 3.89v2.16H8v2.95h2.47V21h3.03Z" />
    </svg>
  );
}

function TripAdvisorMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="12" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="14" r="1.4" fill="currentColor" />
      <circle cx="15" cy="14" r="1.4" fill="currentColor" />
      <path
        d="M5 9h14M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.3 3-7.1z" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.4c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.5C4.7 19.7 8.1 22 12 22z" />
      <path d="M6.4 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.5.3-2.1V7.4H3.1C2.4 8.7 2 10.3 2 12s.4 3.3 1.1 4.6l3.3-2.5z" />
      <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.4l3.3 2.5C7.2 7.6 9.4 5.9 12 5.9z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.78a2.59 2.59 0 0 1-2.59 2.59 2.59 2.59 0 1 1 .8-5.05V9.9a5.8 5.8 0 1 0 4.99 5.74V9.01a7.46 7.46 0 0 0 4.36 1.4V7.2a4.28 4.28 0 0 1-3.3-1.38Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.4Z" />
    </svg>
  );
}

function ThreadsMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M12.19 24h-.01c-3.58-.02-6.33-1.2-8.18-3.51C2.35 18.44 1.5 15.59 1.47 12.01v-.02c.03-3.58.88-6.43 2.53-8.48C5.85 1.2 8.6.02 12.18 0h.01c2.75.02 5.04.73 6.83 2.1 1.68 1.29 2.86 3.13 3.5 5.47l-2.03.57c-1.1-3.96-3.9-5.99-8.3-6.02-2.91.02-5.11.94-6.54 2.72C4.31 6.5 3.62 8.91 3.59 12c.03 3.09.72 5.5 2.06 7.16 1.43 1.79 3.63 2.7 6.54 2.72 2.62-.02 4.36-.63 5.8-2.05 1.65-1.61 1.62-3.59 1.09-4.8-.31-.7-.87-1.3-1.63-1.75-.2 1.36-.62 2.45-1.29 3.27-.88 1.1-2.14 1.71-3.73 1.79-1.2.07-2.36-.21-3.26-.8-1.06-.69-1.68-1.74-1.75-2.96-.07-1.19.41-2.29 1.33-3.08.88-.76 2.12-1.21 3.58-1.29.78-.05 1.79-.02 3.02.14-.13-.74-.38-1.33-.75-1.76-.51-.59-1.31-.88-2.36-.89h-.03c-.84 0-1.99.23-2.72 1.32l-1.7-1.14c.97-1.45 2.56-2.23 4.42-2.23h.04c3.12.02 4.97 1.94 5.15 5.3l.3.13c1.39.65 2.4 1.64 2.94 2.84.74 1.69.81 4.44-1.42 6.62-1.71 1.67-3.78 2.44-6.69 2.46Zm-1.69-9.5c-.05 1.04.62 1.65 1.59 1.71.96.05 1.65-.63 1.71-1.59l.02-1.37a9.76 9.76 0 0 0-2.02-.21c-.84.05-1.25.4-1.3 1.45Z" />
    </svg>
  );
}
