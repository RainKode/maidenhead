"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createPost, deletePost, getPostById, updatePost } from "@/lib/data/blog";
import { uploadMedia } from "@/lib/data/storage";
import { slugify } from "@/lib/slug";

export type SaveState = { error?: string };

export async function savePost(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const status: "draft" | "published" =
    formData.get("status") === "published" ? "published" : "draft";
  const author = String(formData.get("author") ?? "").trim() || "Maidenhead Spice";
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  // Cover: a freshly uploaded file wins, else the kept/typed URL.
  const file = formData.get("cover_file");
  let coverImage = String(formData.get("cover_image") ?? "").trim() || null;
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadMedia(file, "blog");
    if (uploaded) coverImage = uploaded;
  }

  const input = { slug, title, excerpt, body, cover_image: coverImage, author, status };

  if (id) {
    const existing = await getPostById(id);
    const result = await updatePost(id, input, existing?.status === "published");
    if (result.error) return { error: result.error };
  } else {
    const result = await createPost(input);
    if (result.error) return { error: result.error };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deletePost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
