"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { updateOrderStatus } from "@/lib/data/orders";
import type { OrderStatus } from "@/lib/supabase/types";

const ALLOWED: OrderStatus[] = ["new", "preparing", "completed", "cancelled"];

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!id || !ALLOWED.includes(status)) return;

  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
