"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setSubmitting(false);
      return;
    }

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    // Full navigation so the server picks up the new session cookie.
    const redirectTo = searchParams.get("redirect") || "/admin";
    window.location.assign(redirectTo);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full border-[2px] border-ink bg-background px-3 h-11 text-[15px] text-ink focus:border-saffron focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border-[2px] border-ink bg-background px-3 h-11 text-[15px] text-ink focus:border-saffron focus:outline-none"
        />
      </label>

      {error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="caps-track inline-flex h-11 items-center justify-center border-[3px] border-ink bg-saffron px-6 text-[12px] font-bold text-ink transition-colors hover:bg-saffron/90 disabled:opacity-60 [box-shadow:var(--shadow-brutal-sm)]"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
