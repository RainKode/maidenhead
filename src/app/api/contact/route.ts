import { NextResponse } from "next/server";

/**
 * Contact submission stub. v2 will wire to SMTP / Resend.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("[contact]", {
      received: new Date().toISOString(),
      ...data,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
