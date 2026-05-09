"use client";

import { useState, useEffect } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const TIMES = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

function isoDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

function friendlyDate(iso: string) {
  const today = isoDate(0);
  const tomorrow = isoDate(1);
  if (iso === today) return "Today";
  if (iso === tomorrow) return "Tomorrow";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setToday(isoDate(0));
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/book", {
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
          We have received your booking request
        </h3>
        <p className="mt-3 text-[15px] text-ink/75">
          A member of the team will confirm your table by phone shortly. If
          your booking is for today, please call{" "}
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
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Date with quick-pick buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="caps-track-tight text-[10px] text-ink/60">Date *</span>
          <div className="flex gap-1.5 mb-1">
            {[0, 1, 2].map((offset) => {
              const iso = today ? isoDate(offset) : "";
              const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : iso ? friendlyDate(iso) : "";
              return (
                <button
                  key={offset}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={`flex-1 h-8 rounded text-[10px] caps-track-tight border transition-colors ${
                    selectedDate === iso && iso
                      ? "bg-oxblood-dark text-cream border-oxblood-dark"
                      : "border-ink/20 text-ink/60 hover:border-oxblood hover:text-oxblood"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <input
            type="date"
            name="date"
            required
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink focus:outline-none focus:border-oxblood"
          />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="caps-track-tight text-[10px] text-ink/60">Time</span>
          <select
            name="time"
            required
            className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink focus:outline-none focus:border-oxblood appearance-none"
          >
            <option value="">Choose…</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-track-tight text-[10px] text-ink/60">Party size</span>
          <select
            name="party"
            required
            className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink focus:outline-none focus:border-oxblood appearance-none"
          >
            <option value="">Choose…</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">
          Special requests (optional)
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="High chair, dietary needs, occasion…"
          className="bg-transparent border border-ink/20 px-3 py-2 text-[15px] text-ink focus:outline-none focus:border-oxblood resize-none"
        />
      </label>

      <p className="text-[12px] text-ink/60">
        We will confirm your booking by phone. Submitting this form does not
        guarantee the table.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-12 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request Booking"}
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
          {error}. Please call us on 01628 670670 instead.
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
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: string;
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
        min={min}
        className="bg-transparent border-0 border-b border-ink/25 px-0 h-10 text-[15px] text-ink focus:outline-none focus:border-oxblood"
      />
    </label>
  );
}
