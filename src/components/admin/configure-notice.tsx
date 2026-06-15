/**
 * Shown across the whole /admin area when Supabase isn't configured yet, so the
 * panel never crashes before the owner adds their keys.
 */
export function ConfigureNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="brutal-card max-w-xl p-8">
        <p className="caps-track text-[12px] text-oxblood">Maidenhead Spice · Admin</p>
        <h1 className="mt-3 font-display text-[28px] text-ink">Connect Supabase to continue</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
          The admin panel needs a Supabase backend. The public website keeps working in the
          meantime (menu, bookings and orders all run on the static data and email).
        </p>
        <ol className="mt-5 space-y-3 text-[15px] text-ink/80">
          <li>
            <strong className="text-ink">1.</strong> Create a Supabase project and add{" "}
            <code className="bg-cream-deep px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="bg-cream-deep px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
            <code className="bg-cream-deep px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
            <code className="bg-cream-deep px-1">.env.local</code>.
          </li>
          <li>
            <strong className="text-ink">2.</strong> Run the SQL in{" "}
            <code className="bg-cream-deep px-1">supabase/migrations/</code> (in order).
          </li>
          <li>
            <strong className="text-ink">3.</strong> Seed the menu:{" "}
            <code className="bg-cream-deep px-1">
              node --env-file=.env.local scripts/seed-supabase.mjs
            </code>
          </li>
          <li>
            <strong className="text-ink">4.</strong> Create your admin user in Supabase
            (Authentication → Users), then refresh this page.
          </li>
        </ol>
      </div>
    </main>
  );
}
