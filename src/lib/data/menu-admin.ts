import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  DishRow,
  DishVariantRow,
  MenuCategoryRow,
  ModifierGroupRow,
  ModifierOptionRow,
} from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Admin-facing shapes (carry ids + availability the public Dish type omits).
// ---------------------------------------------------------------------------

export interface AdminVariant {
  label: string;
  price: number;
}
export interface AdminModifierOption {
  label: string;
  priceDelta: number;
}
export interface AdminModifierGroup {
  label: string;
  type: "single" | "multi";
  required: boolean;
  min: number | null;
  max: number | null;
  options: AdminModifierOption[];
}
export interface AdminDish {
  id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  dietary: string[];
  orderable: boolean;
  available: boolean;
  variants: AdminVariant[];
  modifiers: AdminModifierGroup[];
}
export interface AdminCategory extends MenuCategoryRow {
  dishes: AdminDish[];
}

export interface DishPayload {
  id?: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number | null;
  dietary: string[];
  orderable: boolean;
  available: boolean;
  variants: AdminVariant[];
  modifiers: AdminModifierGroup[];
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function listCategories(): Promise<MenuCategoryRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db.from("menu_categories").select("*").order("sort_order");
  return (data ?? []) as MenuCategoryRow[];
}

export async function getAdminMenu(): Promise<AdminCategory[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const [categories, dishes, variants, groups, options] = await Promise.all([
    db.from("menu_categories").select("*").order("sort_order"),
    db.from("dishes").select("*").order("sort_order"),
    db.from("dish_variants").select("*").order("sort_order"),
    db.from("modifier_groups").select("*").order("sort_order"),
    db.from("modifier_options").select("*").order("sort_order"),
  ]);

  const variantsByDish = groupBy((variants.data ?? []) as DishVariantRow[], (v) => v.dish_id);
  const groupsByDish = groupBy((groups.data ?? []) as ModifierGroupRow[], (g) => g.dish_id);
  const optionsByGroup = groupBy((options.data ?? []) as ModifierOptionRow[], (o) => o.group_id);
  const dishesByCategory = groupBy((dishes.data ?? []) as DishRow[], (d) => d.category_id);

  return ((categories.data ?? []) as MenuCategoryRow[]).map((category) => ({
    ...category,
    dishes: (dishesByCategory.get(category.id) ?? []).map((dish) =>
      toAdminDish(dish, variantsByDish, groupsByDish, optionsByGroup)
    ),
  }));
}

export async function getAdminDish(
  id: string
): Promise<{ dish: AdminDish; categoryId: string } | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data: dishRow } = await db.from("dishes").select("*").eq("id", id).maybeSingle();
  if (!dishRow) return null;
  const dish = dishRow as DishRow;

  const [variants, groups] = await Promise.all([
    db.from("dish_variants").select("*").eq("dish_id", id).order("sort_order"),
    db.from("modifier_groups").select("*").eq("dish_id", id).order("sort_order"),
  ]);
  const groupRows = (groups.data ?? []) as ModifierGroupRow[];
  const options = groupRows.length
    ? await db
        .from("modifier_options")
        .select("*")
        .in(
          "group_id",
          groupRows.map((g) => g.id)
        )
        .order("sort_order")
    : { data: [] as ModifierOptionRow[] };

  const variantsByDish = groupBy((variants.data ?? []) as DishVariantRow[], (v) => v.dish_id);
  const groupsByDish = groupBy(groupRows, (g) => g.dish_id);
  const optionsByGroup = groupBy((options.data ?? []) as ModifierOptionRow[], (o) => o.group_id);

  return {
    dish: toAdminDish(dish, variantsByDish, groupsByDish, optionsByGroup),
    categoryId: dish.category_id,
  };
}

// ---------------------------------------------------------------------------
// Category writes
// ---------------------------------------------------------------------------

export async function createCategory(input: {
  slug: string;
  title: string;
  blurb: string;
}): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const { count } = await db
    .from("menu_categories")
    .select("id", { count: "exact", head: true });
  const { error } = await db
    .from("menu_categories")
    .insert({ ...input, sort_order: count ?? 0 });
  return error ? { error: error.message } : {};
}

export async function updateCategory(
  id: string,
  input: { slug: string; title: string; blurb: string }
): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };
  const { error } = await db.from("menu_categories").update(input).eq("id", id);
  return error ? { error: error.message } : {};
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from("menu_categories").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Dish writes
// ---------------------------------------------------------------------------

export async function setDishAvailability(id: string, available: boolean): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from("dishes").update({ available }).eq("id", id);
}

export async function deleteDish(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from("dishes").delete().eq("id", id);
}

export async function saveDish(payload: DishPayload): Promise<{ error?: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "Supabase not configured" };

  const dishFields = {
    category_id: payload.categoryId,
    name: payload.name,
    description: payload.description,
    base_price: payload.basePrice,
    dietary: payload.dietary,
    orderable: payload.orderable,
    available: payload.available,
  };

  let dishId = payload.id;

  if (dishId) {
    const { error } = await db.from("dishes").update(dishFields).eq("id", dishId);
    if (error) return { error: error.message };
    // Replace children wholesale (cascade removes options under groups).
    await db.from("dish_variants").delete().eq("dish_id", dishId);
    await db.from("modifier_groups").delete().eq("dish_id", dishId);
  } else {
    const { count } = await db
      .from("dishes")
      .select("id", { count: "exact", head: true })
      .eq("category_id", payload.categoryId);
    const { data, error } = await db
      .from("dishes")
      .insert({ ...dishFields, sort_order: count ?? 0 })
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Could not create dish" };
    dishId = data.id as string;
  }

  if (payload.variants.length) {
    const { error } = await db.from("dish_variants").insert(
      payload.variants.map((v, i) => ({
        dish_id: dishId,
        label: v.label,
        price: v.price,
        sort_order: i,
      }))
    );
    if (error) return { error: error.message };
  }

  for (const [i, group] of payload.modifiers.entries()) {
    const { data: groupRow, error: groupError } = await db
      .from("modifier_groups")
      .insert({
        dish_id: dishId,
        label: group.label,
        type: group.type,
        required: group.required,
        min_select: group.min,
        max_select: group.max,
        sort_order: i,
      })
      .select("id")
      .single();
    if (groupError || !groupRow) return { error: groupError?.message ?? "Could not save options" };

    if (group.options.length) {
      const { error: optError } = await db.from("modifier_options").insert(
        group.options.map((o, j) => ({
          group_id: groupRow.id,
          label: o.label,
          price_delta: o.priceDelta,
          sort_order: j,
        }))
      );
      if (optError) return { error: optError.message };
    }
  }

  return {};
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toAdminDish(
  dish: DishRow,
  variantsByDish: Map<string, DishVariantRow[]>,
  groupsByDish: Map<string, ModifierGroupRow[]>,
  optionsByGroup: Map<string, ModifierOptionRow[]>
): AdminDish {
  return {
    id: dish.id,
    name: dish.name,
    description: dish.description,
    base_price: dish.base_price === null ? null : Number(dish.base_price),
    dietary: dish.dietary ?? [],
    orderable: dish.orderable,
    available: dish.available,
    variants: (variantsByDish.get(dish.id) ?? []).map((v) => ({
      label: v.label,
      price: Number(v.price),
    })),
    modifiers: (groupsByDish.get(dish.id) ?? []).map((g) => ({
      label: g.label,
      type: g.type,
      required: g.required,
      min: g.min_select,
      max: g.max_select,
      options: (optionsByGroup.get(g.id) ?? []).map((o) => ({
        label: o.label,
        priceDelta: Number(o.price_delta),
      })),
    })),
  };
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}
