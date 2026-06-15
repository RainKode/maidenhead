import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ContactMessageRow } from "@/lib/supabase/types";

export interface NewMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Best-effort persistence of a contact submission. Never throws. */
export async function createMessage(input: NewMessage): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    read: false,
  });
  if (error) console.error("[messages] insert failed", error);
}

export async function getMessages(): Promise<ContactMessageRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[messages] list failed", error);
    return [];
  }
  return (data ?? []) as ContactMessageRow[];
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("contact_messages").update({ read }).eq("id", id);
  if (error) console.error("[messages] mark read failed", error);
}

export async function countUnreadMessages(): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return 0;
  const { count } = await db
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false);
  return count ?? 0;
}
