import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { BlogPostRow } from "@/lib/supabase/types";

/** Published posts for the public /blog list (newest first). Empty if unconfigured. */
export async function getPublishedPosts(): Promise<BlogPostRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[blog] list failed", error);
    return [];
  }
  return (data ?? []) as BlogPostRow[];
}

/** A single published post by slug (for /blog/[slug]). */
export async function getPublishedPost(slug: string): Promise<BlogPostRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("[blog] get failed", error);
    return null;
  }
  return (data as BlogPostRow) ?? null;
}

// --- Admin (all statuses) ---------------------------------------------------

export async function getAllPosts(): Promise<BlogPostRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[blog] admin list failed", error);
    return [];
  }
  return (data ?? []) as BlogPostRow[];
}

export async function getPostById(id: string): Promise<BlogPostRow | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[blog] get by id failed", error);
    return null;
  }
  return (data as BlogPostRow) ?? null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  author: string;
  status: "draft" | "published";
}

export async function createPost(input: BlogPostInput): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const { error } = await db.from("blog_posts").insert({
    ...input,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };
  return {};
}

export async function updatePost(
  id: string,
  input: BlogPostInput,
  wasPublished: boolean
): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const patch: Record<string, unknown> = { ...input };
  // Set published_at the first time it goes live; clear it when unpublished.
  if (input.status === "published" && !wasPublished) {
    patch.published_at = new Date().toISOString();
  } else if (input.status === "draft") {
    patch.published_at = null;
  }
  const { error } = await db.from("blog_posts").update(patch).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function deletePost(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("blog_posts").delete().eq("id", id);
  if (error) console.error("[blog] delete failed", error);
}
