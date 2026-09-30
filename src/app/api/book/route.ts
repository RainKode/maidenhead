import { NextResponse } from "next/server";
import {
  sendMail,
  isNonEmpty,
  renderBookingStaffEmail,
  renderBookingCustomerEmail,
  type BookingPayload,
} from "@/lib/mail";
import { createReservation } from "@/lib/data/reservations";
import { restaurantNow, validateBooking } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A slot that was on screen when the guest picked it stays valid for a
// little while, so a slow form-filler isn't bounced at submit.
const SLOT_GRACE_MS = 15 * 60_000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — bots fill this; humans don't see it
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  // Same rules the form applies — errors here are shown to the guest as-is.
  const invalid = validateBooking(body, restaurantNow(new Date(Date.now() - SLOT_GRACE_MS)));
  if (invalid) {
    return NextResponse.json({ ok: false, error: invalid }, { status: 400 });
  }

  const payload: BookingPayload = {
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim(),
    date: String(body.date).trim(),
    time: String(body.time).trim(),
    party: String(Number(body.party)),
    notes: isNonEmpty(body.notes) ? body.notes.trim() : undefined,
  };

  const mailTo = process.env.MAIL_TO;
  if (!mailTo) {
    console.error("[booking] MAIL_TO env var is not set");
    return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
  }

  // Persist the booking (best-effort — never blocks the request email).
  await createReservation({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    date: payload.date,
    time: payload.time,
    party_size: Number.parseInt(payload.party, 10) || 1,
    notes: payload.notes,
  });

  const staffTemplate = renderBookingStaffEmail(payload);
  const customerTemplate = renderBookingCustomerEmail(payload);

  const [staffResult, customerResult] = await Promise.allSettled([
    sendMail({
      to: mailTo,
      subject: `New booking request — ${payload.name} · ${payload.date} ${payload.time}`,
      html: staffTemplate.html,
      text: staffTemplate.text,
      replyTo: payload.email,
    }),
    sendMail({
      to: payload.email,
      subject: "We've got your table request — Maidenhead Spice",
      html: customerTemplate.html,
      text: customerTemplate.text,
    }),
  ]);

  if (staffResult.status === "rejected") {
    console.error("[booking] staff email failed", staffResult.reason);
    const detail =
      staffResult.reason instanceof Error
        ? staffResult.reason.message
        : String(staffResult.reason);
    return NextResponse.json(
      { ok: false, error: "Failed to send booking request", detail },
      { status: 500 }
    );
  }
  if (customerResult.status === "rejected") {
    console.error("[booking] customer auto-reply failed", customerResult.reason);
  }

  return NextResponse.json({ ok: true });
}
