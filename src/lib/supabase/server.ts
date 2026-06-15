import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Anon (RLS-respecting) Supabase client bound to the request cookies.
 * Used for auth (login session) and public reads in server components.
 *
 * Returns `null` when Supabase is not configured, so callers can fall back.
 */
export async function createSupabaseServerClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In Server Components cookies are read-only — ignore writes there.
        // Session refresh happens in proxy.ts; sign in/out happen in Route
        // Handlers / Server Actions where setting cookies is allowed.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* called from a Server Component render — safe to ignore */
        }
      },
    },
  });
}

/** The currently authenticated admin user, or null. */
export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
