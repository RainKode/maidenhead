import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { RecipeRow } from "@/lib/supabase/types";

/** Published recipes for the public /recipes list (newest first). */
export async function getPublishedRecipes(): Promise<RecipeRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("recipes")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[recipes] list failed", error);
    return [];
  }
  return (data ?? []) as RecipeRow[];
}

export async function getPublishedRecipe(slug: string): Promise<RecipeRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("[recipes] get failed", error);
    return null;
  }
  return (data as RecipeRow) ?? null;
}

// --- Admin (all statuses) ---------------------------------------------------

export async function getAllRecipes(): Promise<RecipeRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("recipes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[recipes] admin list failed", error);
    return [];
  }
  return (data ?? []) as RecipeRow[];
}

export async function getRecipeById(id: string): Promise<RecipeRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("recipes").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[recipes] get by id failed", error);
    return null;
  }
  return (data as RecipeRow) ?? null;
}

export interface RecipeInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  ingredients: string[];
  steps: string[];
  prep_time: string | null;
  cook_time: string | null;
  serves: string | null;
  difficulty: string | null;
  status: "draft" | "published";
}

export async function createRecipe(input: RecipeInput): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const { error } = await db.from("recipes").insert({
    ...input,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };
  return {};
}

export async function updateRecipe(
  id: string,
  input: RecipeInput,
  wasPublished: boolean
): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const patch: Record<string, unknown> = { ...input };
  if (input.status === "published" && !wasPublished) {
    patch.published_at = new Date().toISOString();
  } else if (input.status === "draft") {
    patch.published_at = null;
  }
  const { error } = await db.from("recipes").update(patch).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("recipes").delete().eq("id", id);
  if (error) console.error("[recipes] delete failed", error);
}
