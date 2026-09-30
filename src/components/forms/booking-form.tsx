"use client";

import { useCallback, useId, useState } from "react";
import { CalendarDays, ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { contact } from "@/lib/content";
import { postJson } from "@/lib/post-json";
import {
  BOOKING_WINDOW_DAYS,
  LARGE_PARTY_SIZE,
  MAX_PARTY_SIZE,
  QUICK_PICK_DAYS,
  addDays,
  datePickLabel,
  formatLongDate,
  formatSlot,
  isValidEmail,
  isValidPhone,
  servicesForDate,
} from "@/lib/booking";
import { useRestaurantClock } from "@/hooks/use-restaurant-clock";
// Type only — the PDF code itself is loaded on demand from the confirmation card.
import type { BookingPdfDetails } from "@/lib/booking-pdf";

type FieldName = "date" | "time" | "name" | "phone" | "email";
type Errors = Partial<Record<FieldName, string>>;
type Confirmed = BookingPdfDetails & { isToday: boolean };
type PdfState = "idle" | "working" | "error";

const PHONE = contact.phones[0];
const PHONE_HREF = `tel:${PHONE.replace(/\s+/g, "")}`;
const FIELD_ORDER: FieldName[] = ["date", "time", "name", "phone", "email"];
/** Phones scroll through all quick picks; from md up they share one row. */
const DESKTOP_QUICK_PICK_DAYS = 5;

const labelClass = "caps-track-tight text-[11px] font-bold text-ink";
const lineInputClass =
  "h-11 w-full bg-transparent border-0 border-b-[3px] border-ink px-0 text-[16px] text-ink placeholder:text-ink/35 focus:outline-none focus:border-saffron aria-[invalid=true]:border-destructive";
const chipBase =
  "border-[2px] transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-saffron";
const chipOn = "border-ink bg-ink text-background";
const chipOff = "border-ink/25 bg-background text-ink/80 hover:border-ink hover:text-ink";

export function BookingForm() {
  const uid = useId();
  const clock = useRestaurantClock();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [party, setParty] = useState("2");
  const [showMoreDates, setShowMoreDates] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  // Stable, so re-renders of the confirmation card don't scroll it again.
  const scrollIntoViewOnMount = useCallback((el: HTMLDivElement | null) => {
    el?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);

  const today = clock?.date ?? "";
  const quickDates = today
    ? Array.from({ length: QUICK_PICK_DAYS }, (_, i) => addDays(today, i))
    : [];
  const dateIsQuickPick = quickDates.includes(date);
  const services = clock && date ? servicesForDate(date, clock) : [];
  // A slot can expire while the form is open (same-day bookings).
  const selectedTime = services.some((s) => s.slots.includes(time)) ? time : "";
  const partySize = Number(party);

  const clearError = (field: FieldName) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const pickDate = (iso: string) => {
    setDate(iso);
    clearError("date");
    setSubmitError(null);
  };

  const pickTime = (slot: string) => {
    setTime(slot);
    clearError("time");
    setSubmitError(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    // Read everything from the form now — React clears `currentTarget`
    // once this handler awaits.
    const form = e.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const name = field("name");
    const phone = field("phone");
    const email = field("email");

    const next: Errors = {};
    if (!date) next.date = "Please choose a date.";
    else if (!selectedTime) {
      next.time = services.length
        ? "Please choose a time."
        : "There are no times left on this date — please choose another.";
    }
    if (!name) next.name = "Please tell us your name.";
    if (!isValidPhone(phone)) next.phone = "Please enter a phone number we can call to confirm.";
    if (!isValidEmail(email)) next.email = "Please enter a valid email address.";

    setErrors(next);
    setSubmitError(null);
    const firstInvalid = FIELD_ORDER.find((f) => next[f]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await postJson("/api/book", {
      name,
      phone,
      email,
      date,
      time: selectedTime,
      party: partySize,
      notes: field("notes"),
      website: field("website"),
    });
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setPdfState("idle");
    setConfirmed({
      name,
      phone,
      email,
      date,
      time: selectedTime,
      party: partySize,
      notes: field("notes") || undefined,
      requestedAt: Date.now(),
      isToday: date === today,
    });
  };

  const downloadPdf = async () => {
    if (!confirmed || pdfState === "working") return;
    setPdfState("working");
    try {
      const { downloadBookingPdf } = await import("@/lib/booking-pdf");
      await downloadBookingPdf(confirmed);
      setPdfState("idle");
    } catch (err) {
      console.error("[booking] PDF failed", err);
      setPdfState("error");
    }
  };

  const startOver = () => {
    setConfirmed(null);
    setDate("");
    setTime("");
    setParty("2");
    setShowMoreDates(false);
    setErrors({});
  };

  if (confirmed) {
    return (
      <div
        role="status"
        ref={scrollIntoViewOnMount}
        className="brutal-card scroll-mt-24 md:scroll-mt-32 px-6 py-10 text-center"
      >
        <p className="caps-track text-[12px] text-oxblood">Request received</p>
        <h3 className="mt-3 font-display text-[26px] md:text-[30px] leading-tight text-ink">
          Thank you, {confirmed.name.split(/\s+/)[0]}
        </h3>
        <dl className="mx-auto mt-6 max-w-sm border-[3px] border-ink text-left [box-shadow:var(--shadow-brutal-sm)]">
          {[
            ["Date", formatLongDate(confirmed.date)],
            ["Time", formatSlot(confirmed.time)],
            ["Guests", `${confirmed.party} ${confirmed.party === 1 ? "guest" : "guests"}`],
          ].map(([term, value]) => (
            <div
              key={term}
              className="flex items-baseline justify-between gap-4 border-b-2 border-ink/10 px-4 py-3 last:border-b-0"
            >
              <dt className="caps-track-tight text-[11px] font-bold text-ink/60">{term}</dt>
              <dd className="font-display text-[17px] text-ink text-right">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink/75">
          We will call you on <span className="whitespace-nowrap text-ink">{confirmed.phone}</span>{" "}
          to confirm your table. It is not booked until we do.
        </p>
        {confirmed.isToday ? (
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/75">
            Coming in today? For a quicker answer, call us on{" "}
            <a href={PHONE_HREF} className="link-rule whitespace-nowrap text-oxblood">
              {PHONE}
            </a>
            .
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={downloadPdf}
            disabled={pdfState === "working"}
            className="caps-track inline-flex w-full max-w-[260px] sm:w-auto items-center justify-center gap-2 border-[3px] border-ink bg-saffron px-6 h-11 text-[11px] font-bold text-ink hover:bg-saffron/90 transition-all [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] disabled:cursor-wait disabled:opacity-60"
          >
            <Download aria-hidden className="size-4" strokeWidth={2} />
            {pdfState === "working" ? "Preparing…" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={startOver}
            className="caps-track inline-flex w-full max-w-[260px] sm:w-auto items-center justify-center border-[3px] border-ink px-6 h-11 text-[11px] font-bold text-ink hover:bg-ink hover:text-background transition-colors [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            Make another booking
          </button>
        </div>
        {pdfState === "error" ? (
          <p role="alert" className="mt-4 text-[13px] font-bold text-destructive">
            Sorry, the PDF could not be created. A screenshot of this page works too.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onChange={(e) => {
        const field = e.target instanceof HTMLInputElement ? e.target.name : "";
        if (FIELD_ORDER.includes(field as FieldName)) clearError(field as FieldName);
      }}
      noValidate
      className="relative grid gap-10"
    >
      <fieldset className="grid gap-7 min-w-0">
        <StepLegend step={1} title="Your table" />

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Party size</span>
          <span className="relative">
            <select
              name="party"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className={cn(lineInputClass, "appearance-none pr-8 cursor-pointer")}
            >
              {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              strokeWidth={2}
              className="pointer-events-none absolute right-0 top-1/2 size-5 -translate-y-1/2 text-ink"
            />
          </span>
          {partySize >= LARGE_PARTY_SIZE ? (
            <span className="mt-1 text-[13px] leading-relaxed text-ink/70">
              For {LARGE_PARTY_SIZE} or more, it helps to call us on{" "}
              <a href={PHONE_HREF} className="link-rule whitespace-nowrap text-oxblood">
                {PHONE}
              </a>{" "}
              so we can plan the table — or send the request and we will ring you.
            </span>
          ) : null}
        </label>

        <div role="group" aria-labelledby={`${uid}-date`} className="min-w-0">
          <span id={`${uid}-date`} className={labelClass}>
            Date *
          </span>
          <div className="-mx-6 md:-mx-10 mt-2.5 overflow-x-auto overscroll-x-contain snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max md:w-full gap-2 px-6 md:px-10 pb-1">
              {quickDates.length
                ? quickDates.map((iso, i) => {
                    const label = datePickLabel(iso, today);
                    const on = date === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        data-field={i === 0 ? "date" : undefined}
                        aria-pressed={on}
                        aria-label={formatLongDate(iso)}
                        onClick={() => pickDate(iso)}
                        className={cn(
                          chipBase,
                          "flex h-[76px] w-[72px] md:w-auto md:min-w-0 md:flex-1 shrink-0 snap-start flex-col items-center justify-center gap-1",
                          // Wider screens show fewer quick picks so each fits its label.
                          i >= DESKTOP_QUICK_PICK_DAYS && "md:hidden",
                          on ? chipOn : chipOff
                        )}
                      >
                        <span className="uppercase tracking-[0.04em] text-[10px] font-bold leading-none">
                          {label.top}
                        </span>
                        <span className="font-display text-[22px] leading-none">{label.day}</span>
                        <span className="caps-track-tight text-[10px] leading-none opacity-75">
                          {label.month}
                        </span>
                      </button>
                    );
                  })
                : Array.from({ length: QUICK_PICK_DAYS }, (_, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className={cn(
                        "h-[76px] w-[72px] md:w-auto md:flex-1 shrink-0 border-[2px] border-ink/15",
                        i >= DESKTOP_QUICK_PICK_DAYS && "md:hidden"
                      )}
                    />
                  ))}
              <button
                type="button"
                aria-expanded={showMoreDates}
                aria-controls={`${uid}-more-dates`}
                onClick={() => setShowMoreDates((v) => !v)}
                className={cn(
                  chipBase,
                  "flex h-[76px] w-[72px] md:w-auto md:min-w-0 md:flex-1 shrink-0 snap-start flex-col items-center justify-center gap-1.5",
                  date && !dateIsQuickPick ? chipOn : chipOff
                )}
              >
                <CalendarDays aria-hidden className="size-5" strokeWidth={1.75} />
                <span className="caps-track-tight text-[10px] font-bold leading-none">More</span>
              </button>
            </div>
          </div>
          {showMoreDates && today ? (
            <label id={`${uid}-more-dates`} className="mt-4 flex flex-col gap-1.5">
              <span className="text-[13px] text-ink/70">Pick any date up to three months ahead</span>
              <input
                type="date"
                min={today}
                max={addDays(today, BOOKING_WINDOW_DAYS)}
                value={date}
                onChange={(e) => pickDate(e.target.value)}
                className={cn(lineInputClass, "sm:max-w-[240px]")}
              />
            </label>
          ) : null}
          <FieldError id={`${uid}-date-error`} message={errors.date} />
        </div>

        <div role="group" aria-labelledby={`${uid}-time`} className="min-w-0">
          <span id={`${uid}-time`} className={labelClass}>
            Time *
          </span>
          {!date ? (
            <p className="mt-2.5 border-[2px] border-dashed border-ink/25 px-4 py-4 text-[14px] text-ink/60">
              Choose a date to see available times.
            </p>
          ) : services.length === 0 ? (
            <p className="mt-2.5 border-[2px] border-ink/25 bg-background px-4 py-4 text-[14px] leading-relaxed text-ink/80">
              {date === today
                ? "Online booking has closed for today."
                : "There are no times available on this date."}{" "}
              Please choose another date, or call{" "}
              <a href={PHONE_HREF} className="link-rule whitespace-nowrap text-oxblood">
                {PHONE}
              </a>{" "}
              and we will do our best to fit you in.
            </p>
          ) : (
            <div className="mt-2.5 grid gap-4">
              {services.map((service, s) => (
                <div key={service.label}>
                  {services.length > 1 ? (
                    <p className="mb-2 font-display text-[15px] italic text-ink/70">{service.label}</p>
                  ) : null}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {service.slots.map((slot, i) => {
                      const on = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          data-field={s === 0 && i === 0 ? "time" : undefined}
                          aria-pressed={on}
                          onClick={() => pickTime(slot)}
                          className={cn(chipBase, "h-11 text-[14px] font-bold", on ? chipOn : chipOff)}
                        >
                          {formatSlot(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <FieldError id={`${uid}-time-error`} message={errors.time} />
        </div>
      </fieldset>

      <fieldset className="grid gap-6 min-w-0">
        <StepLegend step={2} title="Your details" />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Name"
            name="name"
            autoComplete="name"
            error={errors.name}
            errorId={`${uid}-name-error`}
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            error={errors.phone}
            errorId={`${uid}-phone-error`}
          />
        </div>
        <TextField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.email}
          errorId={`${uid}-email-error`}
        />
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Special requests (optional)</span>
          <textarea
            name="notes"
            rows={3}
            maxLength={1000}
            placeholder="High chair, dietary needs, occasion…"
            className="bg-background border-[3px] border-ink px-3 py-2.5 text-[16px] text-ink placeholder:text-ink/40 focus:outline-none focus:outline-[3px] focus:outline-offset-2 focus:outline-saffron resize-none [box-shadow:var(--shadow-brutal-sm)]"
          />
        </label>
      </fieldset>

      <div className="grid gap-4">
        {date && selectedTime ? (
          <p className="font-display text-[18px] text-ink">
            Table for {partySize} · {formatLongDate(date)} · {formatSlot(selectedTime)}
          </p>
        ) : null}
        <p className="text-[13px] leading-relaxed text-ink/65">
          We will confirm your booking by phone. Submitting this form does not
          guarantee the table.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="caps-track inline-flex items-center justify-center border-[3px] border-ink bg-saffron px-7 h-[52px] text-[12px] font-bold text-ink hover:bg-saffron/90 transition-all [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:none] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request Booking"}
        </button>

        {submitError ? (
          <div
            role="alert"
            className="border-[3px] border-destructive bg-background px-4 py-3 text-[14px] leading-relaxed"
          >
            <p className="font-bold text-destructive">{submitError}</p>
            <p className="mt-1 text-ink/75">
              Your details are still here, so you can try again — or call us on{" "}
              <a href={PHONE_HREF} className="link-rule whitespace-nowrap text-oxblood">
                {PHONE}
              </a>{" "}
              and we will book you in.
            </p>
          </div>
        ) : null}
      </div>

      {/* Honeypot — hidden from humans, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
    </form>
  );
}

function StepLegend({ step, title }: { step: number; title: string }) {
  return (
    // A legend isn't a grid item, so the fieldset's gap doesn't reach it.
    <legend className="mb-6 p-0">
      <span className="caps-track block text-[11px] text-oxblood">Step {step} of 2</span>
      <span className="mt-1 block font-display text-[22px] leading-tight text-ink">{title}</span>
    </legend>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[13px] font-bold text-destructive">
      {message}
    </p>
  );
}

function TextField({
  label,
  name,
  type = "text",
  inputMode,
  autoComplete,
  error,
  errorId,
}: {
  label: string;
  name: FieldName;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  error?: string;
  errorId: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label} *</span>
      <input
        type={type}
        name={name}
        required
        inputMode={inputMode}
        autoComplete={autoComplete}
        data-field={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={lineInputClass}
      />
      <FieldError id={errorId} message={error} />
    </label>
  );
}
