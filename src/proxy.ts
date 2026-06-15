import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renamed `middleware` -> `proxy`. This refreshes the Supabase
// session cookie and guards the /admin area. Lives in src/ next to app/.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only run on the admin area — the public site needs no session handling.
  matcher: ["/admin/:path*"],
};
