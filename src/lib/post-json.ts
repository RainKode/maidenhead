export type PostResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * POST JSON to one of our API routes. Never throws: every failure comes back
 * as a message a guest can read. 400 responses carry validation messages
 * written for guests; anything else gets a generic line so server internals
 * never reach the page.
 */
export async function postJson<T = Record<string, unknown>>(
  url: string,
  payload: unknown
): Promise<PostResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      error: "We couldn't reach the restaurant. Please check your connection and try again.",
    };
  }

  const data = (await res.json().catch(() => ({}))) as T & { ok?: boolean; error?: unknown };
  if (res.ok && data.ok !== false) return { ok: true, data };

  if (res.status === 400 && typeof data.error === "string") {
    return { ok: false, error: data.error };
  }
  return { ok: false, error: "Sorry, something went wrong on our side." };
}
