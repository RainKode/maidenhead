import type { Metadata } from "next";
import { ConfigureNotice } from "@/components/admin/configure-notice";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The admin area is always rendered per-request (session + live data).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Gate the whole area behind a configured backend so nothing crashes pre-setup.
  if (!isSupabaseConfigured()) return <ConfigureNotice />;
  return <>{children}</>;
}
