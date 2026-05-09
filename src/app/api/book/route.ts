import { NextResponse } from "next/server";

/**
 * Booking submission stub. v1 logs the payload server-side and returns 200
 * so the form UX is end-to-end testable. v2 will wire up SMTP / Resend and
 * email the team at info@maidenheadspice.com.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Server-side log only; never echo PII to the client response.
    console.log("[booking]", {
      received: new Date().toISOString(),
      ...data,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[booking] failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
