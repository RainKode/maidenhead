"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createCategory,
  deleteCategory,
  deleteDish,
  saveDish,
  setDishAvailability,
  updateCategory,
  type DishPayload,
} from "@/lib/data/menu-admin";
import { slugify } from "@/lib/slug";

export type SaveState = { error?: string };

function revalidateMenu() {
  revalidatePath("/admin/menu");
  revalidatePath("/menus");
}

// --- Categories -------------------------------------------------------------

export async function saveCategory(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const blurb = String(formData.get("blurb") ?? "").trim();

  const result = id
    ? await updateCategory(id, { slug, title, blurb })
    : await createCategory({ slug, title, blurb });
  if (result.error) return { error: result.error };

  revalidateMenu();
  redirect("/admin/menu");
}

export async function removeCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteCategory(id);
  revalidateMenu();
}

// --- Dishes -----------------------------------------------------------------

const dishSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, "Choose a category"),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().nullable(),
  basePrice: z.number().nonnegative().nullable(),
  dietary: z.array(z.string()),
  orderable: z.boolean(),
  available: z.boolean(),
  variants: z.array(z.object({ label: z.string().trim().min(1), price: z.number().nonnegative() })),
  modifiers: z.array(
    z.object({
      label: z.string().trim().min(1),
      type: z.enum(["single", "multi"]),
      required: z.boolean(),
      min: z.number().int().nonnegative().nullable(),
      max: z.number().int().nonnegative().nullable(),
      options: z.array(
        z.object({ label: z.string().trim().min(1), priceDelta: z.number() })
      ),
    })
  ),
});

export async function saveDishAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    return { error: "Invalid form data." };
  }

  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the dish details." };
  }

  const dish = parsed.data;
  if (dish.basePrice === null && dish.variants.length === 0) {
    return { error: "Set a base price or add at least one variant." };
  }

  const result = await saveDish(dish as DishPayload);
  if (result.error) return { error: result.error };

  revalidateMenu();
  redirect("/admin/menu");
}

export async function removeDish(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteDish(id);
  revalidateMenu();
}

export async function toggleAvailability(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const available = formData.get("available") === "true";
  if (!id) return;
  await setDishAvailability(id, available);
  revalidateMenu();
}
