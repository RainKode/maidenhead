import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Upload a cover image to the public `media` bucket and return its public URL.
 * Returns null on failure or when no file was provided.
 */
export async function uploadMedia(file: File, folder = "covers"): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const db = getSupabaseAdmin();
  if (!db) return null;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await db.storage.from("media").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) {
    console.error("[storage] upload failed", error);
    return null;
  }

  return db.storage.from("media").getPublicUrl(path).data.publicUrl;
}
