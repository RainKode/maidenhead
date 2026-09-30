import { hours } from "@/lib/content";

/**
 * Table-booking rules shared by the booking form and /api/book, so the slots
 * a guest can pick are exactly the slots the server accepts.
 *
 * Dates are "YYYY-MM-DD" and times "HH:MM", both in restaurant (UK) time —
 * never the visitor's device time zone.
 */

export const RESTAURANT_TIME_ZONE = "Europe/London";
export const MAX_PARTY_SIZE = 12;
/** From this size we ask guests to phone so the table can be planned. */
export const LARGE_PARTY_SIZE = 8;
/** How far ahead the form offers dates. */
export const BOOKING_WINDOW_DAYS = 90;
/** Quick-pick date buttons shown before "More dates". */
export const QUICK_PICK_DAYS = 7;

const SLOT_INTERVAL_MINUTES = 30;
/** Last table is seated this long before each service closes. */
const LAST_SEATING_MINUTES = 30;
/** Same-day slots need at least this much notice. */
export const SAME_DAY_NOTICE_MINUTES = 30;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type Service = { label: "Lunch" | "Dinner"; slots: string[] };

export type RestaurantClock = { date: string; minutes: number };

const clockFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: RESTAURANT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Current date and minutes-past-midnight in Maidenhead. */
export function restaurantNow(at: Date = new Date()): RestaurantClock {
  const parts = Object.fromEntries(
    clockFormatter.formatToParts(at).map((p) => [p.type, p.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

// Calendar maths is done at midday UTC so no DST shift can change the day.
function toUtcNoon(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = toUtcNoon(value);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function addDays(iso: string, days: number): string {
  const d = toUtcNoon(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Bookable services for a date. For today, slots inside the notice period
 * are dropped; pass `now` so client and server agree on "today".
 */
export function servicesForDate(iso: string, now: RestaurantClock): Service[] {
  if (!isIsoDate(iso) || iso < now.date) return [];
  const dayName = DAY_NAMES[toUtcNoon(iso).getUTCDay()];
  const day = hours.weekly.find((d) => d.day === dayName);
  if (!day) return [];

  const earliest = iso === now.date ? now.minutes + SAME_DAY_NOTICE_MINUTES : 0;

  return day.sessions
    .map(([opens, closes]) => {
      const slots: string[] = [];
      const last = toMinutes(closes) - LAST_SEATING_MINUTES;
      for (let t = toMinutes(opens); t <= last; t += SLOT_INTERVAL_MINUTES) {
        if (t >= earliest) slots.push(fromMinutes(t));
      }
      const label: Service["label"] = toMinutes(opens) < 16 * 60 ? "Lunch" : "Dinner";
      return { label, slots };
    })
    .filter((service) => service.slots.length > 0);
}

/** "17:30" → "5.30pm", matching how opening hours are written on the site. */
export function formatSlot(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}.${String(m).padStart(2, "0")}${suffix}`;
}

function formatIso(iso: string, options: Intl.DateTimeFormatOptions): string {
  return toUtcNoon(iso).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
}

/** Parts for a date quick-pick button, e.g. { top: "Today", day: "30", month: "Sep" }. */
export function datePickLabel(iso: string, today: string) {
  const top =
    iso === today
      ? "Today"
      : iso === addDays(today, 1)
        ? "Tomorrow"
        : formatIso(iso, { weekday: "short" });
  return {
    top,
    day: formatIso(iso, { day: "numeric" }),
    month: formatIso(iso, { month: "short" }),
  };
}

/** "Thursday 2 October" */
export function formatLongDate(iso: string): string {
  return formatIso(iso, { weekday: "long", day: "numeric", month: "long" });
}

export type BookingRequest = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 200;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^[+\d\s()-]+$/.test(phone.trim()) && digits.length >= 10 && digits.length <= 15;
}

/**
 * Validate a booking. Returns a message written for the guest, or null when
 * the request is good. Used by the form (per field) and the API (all at once).
 */
export function validateBooking(
  input: Partial<Record<keyof BookingRequest, unknown>>,
  now: RestaurantClock = restaurantNow()
): string | null {
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = text(input.name);
  const phone = text(input.phone);
  const email = text(input.email);
  const date = text(input.date);
  const time = text(input.time);
  const party = Number(input.party);

  if (!name) return "Please tell us your name.";
  if (name.length > 100) return "Please shorten your name.";
  if (!isValidPhone(phone)) return "Please enter a phone number we can call to confirm.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (!Number.isInteger(party) || party < 1 || party > MAX_PARTY_SIZE) {
    return `Please choose a party size between 1 and ${MAX_PARTY_SIZE}.`;
  }
  if (!isIsoDate(date)) return "Please choose a date.";
  if (date < now.date) return "That date has passed — please choose another.";
  if (date > addDays(now.date, BOOKING_WINDOW_DAYS)) {
    return "We take bookings up to three months ahead — please call us for later dates.";
  }
  const slots = servicesForDate(date, now).flatMap((s) => s.slots);
  if (!slots.includes(time)) {
    return "That time is no longer available — please choose another.";
  }
  if (text(input.notes).length > 1000) return "Please shorten your special requests.";
  return null;
}
