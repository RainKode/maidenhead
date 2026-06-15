"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  updateRecipe,
} from "@/lib/data/recipes";
import { uploadMedia } from "@/lib/data/storage";
import { slugify } from "@/lib/slug";

export type SaveState = { error?: string };

function toLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveRecipe(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const status: "draft" | "published" =
    formData.get("status") === "published" ? "published" : "draft";

  const file = formData.get("cover_file");
  let coverImage = String(formData.get("cover_image") ?? "").trim() || null;
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadMedia(file, "recipes");
    if (uploaded) coverImage = uploaded;
  }

  const input = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    cover_image: coverImage,
    ingredients: toLines(formData.get("ingredients")),
    steps: toLines(formData.get("steps")),
    prep_time: String(formData.get("prep_time") ?? "").trim() || null,
    cook_time: String(formData.get("cook_time") ?? "").trim() || null,
    serves: String(formData.get("serves") ?? "").trim() || null,
    difficulty: String(formData.get("difficulty") ?? "").trim() || null,
    status,
  };

  if (id) {
    const existing = await getRecipeById(id);
    const result = await updateRecipe(id, input, existing?.status === "published");
    if (result.error) return { error: result.error };
  } else {
    const result = await createRecipe(input);
    if (result.error) return { error: result.error };
  }

  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
  redirect("/admin/recipes");
}

export async function removeRecipe(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteRecipe(id);
  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
}
