import { NextResponse } from "next/server";
import {
  sendMail,
  isValidEmail,
  isNonEmpty,
  renderBookingStaffEmail,
  renderBookingCustomerEmail,
  type BookingPayload,
} from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Required field validation
  const { name, phone, email, date, time, party } = body;
  if (
    !isNonEmpty(name) ||
    !isNonEmpty(phone) ||
    !isNonEmpty(email) ||
    !isNonEmpty(date) ||
    !isNonEmpty(time) ||
    !isNonEmpty(party)
  ) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }

  const payload: BookingPayload = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    date: date.trim(),
    time: time.trim(),
    party: String(party).trim(),
    notes: isNonEmpty(body.notes) ? body.notes.trim() : undefined,
  };

  const mailTo = process.env.MAIL_TO;
  if (!mailTo) {
    console.error("[booking] MAIL_TO env var is not set");
    return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
  }

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
    return NextResponse.json({ ok: false, error: "Failed to send booking request" }, { status: 500 });
  }
  if (customerResult.status === "rejected") {
    console.error("[booking] customer auto-reply failed", customerResult.reason);
  }

  return NextResponse.json({ ok: true });
}
