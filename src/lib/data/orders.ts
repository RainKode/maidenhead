import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OrderEmailPayload } from "@/lib/mail";
import type { OrderRow, OrderStatus } from "@/lib/supabase/types";

/**
 * Best-effort persistence of a confirmed order. Never throws — the kitchen
 * email is the source of truth.
 */
export async function createOrder(order: OrderEmailPayload): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("orders").insert({
    ref: order.ref,
    order_type: order.orderType,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    requested_date: order.requestedFor.date,
    requested_time: order.requestedFor.time,
    delivery: order.delivery ?? null,
    dine_in: order.dineIn ?? null,
    notes: order.notes ?? null,
    items: order.lines,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    status: "new",
  });
  if (error) console.error("[orders] insert failed", error);
}

export async function getOrders(
  filter: { status?: OrderStatus } = {}
): Promise<OrderRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  let query = db.from("orders").select("*").order("created_at", { ascending: false });
  if (filter.status) query = query.eq("status", filter.status);
  const { data, error } = await query;
  if (error) {
    console.error("[orders] list failed", error);
    return [];
  }
  return (data ?? []) as OrderRow[];
}

export async function getOrderById(id: string): Promise<OrderRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[orders] get failed", error);
    return null;
  }
  return (data as OrderRow) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("orders").update({ status }).eq("id", id);
  if (error) console.error("[orders] status update failed", error);
}

export async function countNewOrders(): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return 0;
  const { count } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  return count ?? 0;
}
