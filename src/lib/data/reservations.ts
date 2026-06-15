import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ReservationRow, ReservationStatus } from "@/lib/supabase/types";

export interface NewReservation {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party_size: number;
  notes?: string;
}

/**
 * Best-effort persistence of a public booking. Never throws — the booking email
 * is the source of truth, so a DB hiccup must not fail the customer request.
 */
export async function createReservation(input: NewReservation): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("reservations").insert({
    name: input.name,
    phone: input.phone,
    email: input.email,
    date: input.date,
    time: input.time,
    party_size: input.party_size,
    notes: input.notes ?? null,
    status: "pending",
  });
  if (error) console.error("[reservations] insert failed", error);
}

export async function getReservations(
  filter: { status?: ReservationStatus } = {}
): Promise<ReservationRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  let query = db.from("reservations").select("*").order("date", { ascending: true });
  if (filter.status) query = query.eq("status", filter.status);
  const { data, error } = await query;
  if (error) {
    console.error("[reservations] list failed", error);
    return [];
  }
  return (data ?? []) as ReservationRow[];
}

export async function getReservationById(id: string): Promise<ReservationRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("reservations").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[reservations] get failed", error);
    return null;
  }
  return (data as ReservationRow) ?? null;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<ReservationRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    console.error("[reservations] status update failed", error);
    return null;
  }
  return data as ReservationRow;
}

export async function countPendingReservations(): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return 0;
  const { count } = await db
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
