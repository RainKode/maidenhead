import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";

/**
 * Guard for admin server components and server actions. Re-checks the session
 * server-side (never relying on the proxy alone) and redirects to the login
 * page when there is no authenticated user. Returns the user otherwise.
 */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
