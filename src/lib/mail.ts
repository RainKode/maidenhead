import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

// ---------------------------------------------------------------------------
// Transport (lazy singleton)
// ---------------------------------------------------------------------------

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: requireEnv("SMTP_HOST"),
      port: Number(requireEnv("SMTP_PORT")),
      secure: process.env.SMTP_SECURE !== "false", // default true (port 465)
      auth: {
        user: requireEnv("SMTP_USER"),
        pass: requireEnv("SMTP_PASS"),
      },
    });
  }
  return _transporter;
}

// ---------------------------------------------------------------------------
// Core send helper
// ---------------------------------------------------------------------------

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Maidenhead Spice" <${requireEnv("SMTP_FROM")}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}

// ---------------------------------------------------------------------------
// HTML escaping (safety — never trust user input in email bodies)
// ---------------------------------------------------------------------------

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// Shared email shell (brand colours: oxblood #7B1C2E, cream #FDF6EE)
// ---------------------------------------------------------------------------

function shell(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Maidenhead Spice</title>
</head>
<body style="margin:0;padding:0;background:#FDF6EE;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF6EE;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e8ddd4;">
          <!-- Header -->
          <tr>
            <td style="background:#7B1C2E;padding:24px 32px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#FDF6EE;letter-spacing:0.05em;">
                Maidenhead Spice
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#e8c4b8;letter-spacing:0.1em;text-transform:uppercase;">
                117 Bridge Road · Maidenhead
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e8ddd4;background:#FDF6EE;">
              <p style="margin:0;font-size:11px;color:#888;font-family:Arial,sans-serif;">
                Maidenhead Spice · 117 Bridge Road, Maidenhead, SL6 8NA<br />
                <a href="https://www.maidenheadspice.co.uk" style="color:#7B1C2E;">maidenheadspice.co.uk</a> · 01628 670670
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Staff notification — booking
// ---------------------------------------------------------------------------

export interface BookingPayload {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party: string;
  notes?: string;
}

export function renderBookingStaffEmail(p: BookingPayload): { html: string; text: string } {
  const received = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  const html = shell(`
    <h2 style="margin:0 0 4px;font-size:20px;color:#7B1C2E;">New Booking Request</h2>
    <p style="margin:0 0 24px;font-size:12px;color:#888;font-family:Arial,sans-serif;">Received ${esc(received)}</p>

    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
      ${row("Name", p.name)}
      ${row("Phone", p.phone)}
      ${row("Email", p.email)}
      ${row("Date", p.date)}
      ${row("Time", p.time)}
      ${row("Party size", p.party)}
      ${p.notes ? row("Notes", p.notes) : ""}
    </table>

    <p style="margin:28px 0 0;">
      <a href="mailto:${esc(p.email)}?subject=Re%3A%20Your%20Booking%20Request%20%E2%80%94%20Maidenhead%20Spice"
         style="display:inline-block;background:#7B1C2E;color:#FDF6EE;text-decoration:none;padding:10px 22px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
        Reply to Customer
      </a>
    </p>
  `);

  const text = [
    "NEW BOOKING REQUEST",
    `Received: ${received}`,
    "",
    `Name:       ${p.name}`,
    `Phone:      ${p.phone}`,
    `Email:      ${p.email}`,
    `Date:       ${p.date}`,
    `Time:       ${p.time}`,
    `Party size: ${p.party}`,
    p.notes ? `Notes:      ${p.notes}` : "",
    "",
    "---",
    "Maidenhead Spice · 117 Bridge Road, Maidenhead",
  ].join("\n");

  return { html, text };
}

// ---------------------------------------------------------------------------
// Customer auto-reply — booking
// ---------------------------------------------------------------------------

export function renderBookingCustomerEmail(p: BookingPayload): { html: string; text: string } {
  const html = shell(`
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${esc(p.name)},</p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
      Thanks for choosing Maidenhead Spice — your booking request for
      <strong>${esc(p.party)} ${Number(p.party) === 1 ? "guest" : "guests"}</strong>
      on <strong>${esc(p.date)}</strong> at <strong>${esc(p.time)}</strong>
      has landed safely with us.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
      One of the team will give you a quick call shortly to confirm the table.
      If you don't hear from us within a couple of hours (or your booking is
      for today), give us a ring on
      <a href="tel:01628670670" style="color:#7B1C2E;">01628 670670</a>
      and we'll sort it on the spot.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 32px;">
      Looking forward to feeding you well.
    </p>
    <p style="font-size:14px;color:#555;margin:0;">
      — The team at Maidenhead Spice<br />
      <span style="font-size:12px;color:#888;">117 Bridge Road, Maidenhead · maidenheadspice.co.uk</span>
    </p>
  `);

  const text = [
    `Hi ${p.name},`,
    "",
    `Thanks for choosing Maidenhead Spice — your booking request for ${p.party} ${Number(p.party) === 1 ? "guest" : "guests"} on ${p.date} at ${p.time} has landed safely with us.`,
    "",
    "One of the team will give you a quick call shortly to confirm the table. If you don't hear from us within a couple of hours (or your booking is for today), give us a ring on 01628 670670 and we'll sort it on the spot.",
    "",
    "Looking forward to feeding you well.",
    "",
    "— The team at Maidenhead Spice",
    "117 Bridge Road, Maidenhead · maidenheadspice.co.uk",
  ].join("\n");

  return { html, text };
}

// ---------------------------------------------------------------------------
// Staff notification — contact
// ---------------------------------------------------------------------------

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function renderContactStaffEmail(p: ContactPayload): { html: string; text: string } {
  const received = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  const html = shell(`
    <h2 style="margin:0 0 4px;font-size:20px;color:#7B1C2E;">New Contact Message</h2>
    <p style="margin:0 0 24px;font-size:12px;color:#888;font-family:Arial,sans-serif;">Received ${esc(received)}</p>

    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
      ${row("Name", p.name)}
      ${row("Email", p.email)}
      ${row("Subject", p.subject)}
    </table>

    <div style="margin-top:20px;padding:16px;background:#FDF6EE;border-left:3px solid #7B1C2E;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;">
      ${esc(p.message).replace(/\n/g, "<br />")}
    </div>

    <p style="margin:28px 0 0;">
      <a href="mailto:${esc(p.email)}?subject=Re%3A%20${encodeURIComponent(p.subject)}"
         style="display:inline-block;background:#7B1C2E;color:#FDF6EE;text-decoration:none;padding:10px 22px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
        Reply to Customer
      </a>
    </p>
  `);

  const text = [
    "NEW CONTACT MESSAGE",
    `Received: ${received}`,
    "",
    `Name:    ${p.name}`,
    `Email:   ${p.email}`,
    `Subject: ${p.subject}`,
    "",
    "Message:",
    p.message,
    "",
    "---",
    "Maidenhead Spice · 117 Bridge Road, Maidenhead",
  ].join("\n");

  return { html, text };
}

// ---------------------------------------------------------------------------
// Customer auto-reply — contact
// ---------------------------------------------------------------------------

export function renderContactCustomerEmail(p: ContactPayload): { html: string; text: string } {
  const html = shell(`
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${esc(p.name)},</p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
      Thanks for getting in touch. We've got your note about
      "<strong>${esc(p.subject)}</strong>" and someone from the team will
      reply within one working day.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 32px;">
      For anything urgent, the kitchen phone is
      <a href="tel:01628670670" style="color:#7B1C2E;">01628 670670</a>
      — always quicker than email when the pans are on.
    </p>
    <p style="font-size:14px;color:#555;margin:0;">
      Warmly,<br />
      — The team at Maidenhead Spice
    </p>
  `);

  const text = [
    `Hi ${p.name},`,
    "",
    `Thanks for getting in touch. We've got your note about "${p.subject}" and someone from the team will reply within one working day.`,
    "",
    "For anything urgent, the kitchen phone is 01628 670670 — always quicker than email when the pans are on.",
    "",
    "Warmly,",
    "— The team at Maidenhead Spice",
  ].join("\n");

  return { html, text };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;color:#888;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0eae4;">${esc(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0eae4;">${esc(value)}</td>
    </tr>`;
}

// ---------------------------------------------------------------------------
// Validation helpers (used by route handlers)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
