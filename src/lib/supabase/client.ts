"use client";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for the admin login form. Returns `null` when the
 * public env vars are absent (Supabase not configured yet).
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
