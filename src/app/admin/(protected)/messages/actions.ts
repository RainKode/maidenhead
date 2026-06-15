"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { markMessageRead } from "@/lib/data/messages";

export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "true";
  if (!id) return;
  await markMessageRead(id, read);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
