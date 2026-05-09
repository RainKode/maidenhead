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
    <footer className="bg-cream-deep border-t border-ink/10">
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
              className="sm:col-span-2 caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-medium text-cream hover:bg-oxblood transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 border-t border-ink/10 pt-12">
          <div>
            <h4 className="caps-track text-[11px] text-oxblood mb-4">Visit</h4>
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
            <h4 className="caps-track text-[11px] text-oxblood mb-4">Hours</h4>
            <ul className="space-y-1.5 font-display text-[15px] text-ink/85">
              <li>{hours.summary}</li>
              <li>{hours.dinner}</li>
              <li>{hours.sundayBuffet}</li>
            </ul>
          </div>

          <div>
            <h4 className="caps-track text-[11px] text-oxblood mb-4">
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
                <a href={`mailto:${contact.email}`} className="link-rule">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="caps-track text-[11px] text-oxblood mb-4">
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

        <div className="mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-ink/10 pt-10">
          <div>
            <p className="font-display text-[18px] italic text-oxblood">
              From our tandoor to your table.
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
            <p className="caps-track-tight text-[11px] text-oxblood">
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
                    className="inline-flex size-10 items-center justify-center rounded-full border border-oxblood-dark/30 text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
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
      <span className="caps-track-tight text-[10px] text-ink/60">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink placeholder:italic placeholder:text-ink/40 focus:outline-none focus:border-oxblood"
      />
    </label>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "Facebook") return <FacebookMark />;
  if (name === "TripAdvisor") return <TripAdvisorMark />;
  if (name === "Google") return <GoogleMark />;
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
