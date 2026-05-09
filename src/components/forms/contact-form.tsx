"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-cream border border-oxblood-dark/20 px-6 py-10 text-center">
        <p className="caps-track text-[12px] text-oxblood">Thank you</p>
        <h3 className="mt-3 font-display text-[24px] text-ink">
          Your message is on its way
        </h3>
        <p className="mt-3 text-[15px] text-ink/75">
          We will get back to you within one working day. For urgent enquiries
          please call{" "}
          <a href="tel:01628670670" className="link-rule text-oxblood">
            01628 670670
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-6 h-10 text-[11px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Subject" name="subject" required />
      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">
          Message *
        </span>
        <textarea
          name="message"
          rows={6}
          required
          className="bg-transparent border border-ink/20 px-3 py-2 text-[15px] text-ink focus:outline-none focus:border-oxblood resize-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-12 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      {/* Honeypot — hidden from humans, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
      />
      {error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {error}. Please email{" "}
          <a href="mailto:info@maidenheadspice.co.uk" className="link-rule">
            info@maidenheadspice.co.uk
          </a>{" "}
          instead.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] text-ink/60">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink focus:outline-none focus:border-oxblood"
      />
    </label>
  );
}
