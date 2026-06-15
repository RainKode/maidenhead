# Restaurant Management System — Setup

This site has a full management backend (menu, reservations, orders, blog & recipes)
powered by **Supabase**, with an admin panel at **`/admin`**.

**The public website works without Supabase** — until you connect it, the menu comes
from the built-in static data and bookings/orders/contact just send email (as before).
Connecting Supabase turns on the database and the admin panel.

## 1. Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key (**secret**) |

Email already uses the existing `SMTP_*` and `MAIL_TO` variables — unchanged.

## 2. Create the database

In the Supabase dashboard → **SQL Editor**, run these files **in order**:

1. `supabase/migrations/0001_init.sql` — tables
2. `supabase/migrations/0002_rls.sql` — security policies + the `media` storage bucket

## 3. Seed the menu

This copies the current static menu (9 categories, all dishes, variants and options)
into the database so you can start editing it:

```bash
node --env-file=.env.local scripts/seed-supabase.mjs
# re-run with --reset to wipe and reload the menu from the static baseline
```

## 4. Create your admin login

Supabase dashboard → **Authentication → Users → Add user**. Set an email + password
and tick **Auto Confirm User**. There is no public sign-up — this is the single owner
account. Sign in at **`/admin/login`**.

## What you can do in the admin panel

- **Menu** — add/edit/remove categories and dishes, change prices, descriptions,
  dietary tags, availability, **variants** (e.g. Chicken/Lamb pricing) and
  **option groups** (spice level, extras). Edits show on `/menus` immediately.
- **Reservations** — see every booking; **Confirm** or **Decline** (the customer is
  emailed automatically).
- **Orders** — every online order with a status workflow (new → preparing → completed).
- **Journal & Recipes** — write, upload a cover image, and publish posts/recipes that
  appear on `/blog` and `/recipes`.
- **Messages** — contact-form inbox.

## How it works (for developers)

- Reads go through `src/lib/data/*`, which fall back to `src/lib/menu-data.ts` when
  Supabase isn't configured.
- Public form submissions (`/api/book`, `/api/order`, `/api/contact`) persist to the
  database **best-effort** and still send email even if the DB is unavailable.
- Admin mutations are Server Actions that re-check the session and use the
  service-role client. `src/proxy.ts` (Next.js 16's middleware) guards `/admin`.
