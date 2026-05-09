import { NextResponse } from "next/server";
import {
  sendMail,
  isValidEmail,
  isNonEmpty,
  renderContactStaffEmail,
  renderContactCustomerEmail,
  type ContactPayload,
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
  const { name, email, subject, message } = body;
  if (
    !isNonEmpty(name) ||
    !isNonEmpty(email) ||
    !isNonEmpty(subject) ||
    !isNonEmpty(message)
  ) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }

  const payload: ContactPayload = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  const mailTo = process.env.MAIL_TO;
  if (!mailTo) {
    console.error("[contact] MAIL_TO env var is not set");
    return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
  }

  const staffTemplate = renderContactStaffEmail(payload);
  const customerTemplate = renderContactCustomerEmail(payload);

  const [staffResult, customerResult] = await Promise.allSettled([
    sendMail({
      to: mailTo,
      subject: `New message: ${payload.subject} — ${payload.name}`,
      html: staffTemplate.html,
      text: staffTemplate.text,
      replyTo: payload.email,
    }),
    sendMail({
      to: payload.email,
      subject: "Message received — Maidenhead Spice",
      html: customerTemplate.html,
      text: customerTemplate.text,
    }),
  ]);

  if (staffResult.status === "rejected") {
    console.error("[contact] staff email failed", staffResult.reason);
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 500 });
  }
  if (customerResult.status === "rejected") {
    console.error("[contact] customer auto-reply failed", customerResult.reason);
  }

  return NextResponse.json({ ok: true });
}
