import "server-only";
import {
  menu as staticMenu,
  type DietaryTag,
  type Dish,
  type MenuCategory,
  type ModifierGroup,
} from "@/lib/menu-data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  DishRow,
  DishVariantRow,
  MenuCategoryRow,
  ModifierGroupRow,
  ModifierOptionRow,
} from "@/lib/supabase/types";

/**
 * Single read path for the menu. When Supabase is configured AND seeded it
 * assembles the live menu from the database; otherwise it returns the static
 * baseline from menu-data.ts so the public site keeps working.
 *
 * `includeUnavailable` is used by the admin so it can manage hidden dishes.
 */
export async function getMenu(
  { includeUnavailable = false }: { includeUnavailable?: boolean } = {}
): Promise<MenuCategory[]> {
  const db = getSupabaseAdmin();
  if (!db) return staticMenu;

  try {
    const [categories, dishes, variants, groups, options] = await Promise.all([
      db.from("menu_categories").select("*").order("sort_order"),
      db.from("dishes").select("*").order("sort_order"),
      db.from("dish_variants").select("*").order("sort_order"),
      db.from("modifier_groups").select("*").order("sort_order"),
      db.from("modifier_options").select("*").order("sort_order"),
    ]);

    const error =
      categories.error || dishes.error || variants.error || groups.error || options.error;
    if (error) throw error;
    if (!categories.data?.length) return staticMenu; // configured but not seeded yet

    return assembleMenu(
      {
        categories: categories.data as MenuCategoryRow[],
        dishes: (dishes.data ?? []) as DishRow[],
        variants: (variants.data ?? []) as DishVariantRow[],
        groups: (groups.data ?? []) as ModifierGroupRow[],
        options: (options.data ?? []) as ModifierOptionRow[],
      },
      { includeUnavailable }
    );
  } catch (err) {
    console.error("[menu] Supabase read failed, falling back to static menu", err);
    return staticMenu;
  }
}

/** Find a dish across the (available) menu — used by the order reprice route. */
export async function findDishById(dishId: string): Promise<Dish | undefined> {
  const map = await getDishMap();
  return map.get(dishId);
}

/** Flat id -> Dish lookup over the available menu, built once per request. */
export async function getDishMap(): Promise<Map<string, Dish>> {
  const categories = await getMenu();
  const map = new Map<string, Dish>();
  for (const category of categories) {
    for (const dish of category.dishes) map.set(dish.id, dish);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Assembly: flat rows -> nested MenuCategory[] matching the static shape.
// ---------------------------------------------------------------------------

function assembleMenu(
  data: {
    categories: MenuCategoryRow[];
    dishes: DishRow[];
    variants: DishVariantRow[];
    groups: ModifierGroupRow[];
    options: ModifierOptionRow[];
  },
  { includeUnavailable }: { includeUnavailable: boolean }
): MenuCategory[] {
  const optionsByGroup = groupBy(data.options, (o) => o.group_id);
  const groupsByDish = groupBy(data.groups, (g) => g.dish_id);
  const variantsByDish = groupBy(data.variants, (v) => v.dish_id);
  const dishesByCategory = groupBy(data.dishes, (d) => d.category_id);

  return data.categories.map((category) => ({
    slug: category.slug,
    title: category.title,
    blurb: category.blurb,
    dishes: (dishesByCategory.get(category.id) ?? [])
      .filter((dish) => includeUnavailable || dish.available)
      .map((dish) => toDish(dish, variantsByDish, groupsByDish, optionsByGroup)),
  }));
}

function toDish(
  dish: DishRow,
  variantsByDish: Map<string, DishVariantRow[]>,
  groupsByDish: Map<string, ModifierGroupRow[]>,
  optionsByGroup: Map<string, ModifierOptionRow[]>
): Dish {
  const variants = (variantsByDish.get(dish.id) ?? []).map((v) => ({
    id: v.id,
    label: v.label,
    price: Number(v.price),
  }));

  const modifiers: ModifierGroup[] = (groupsByDish.get(dish.id) ?? []).map((group) => ({
    id: group.id,
    label: group.label,
    type: group.type,
    required: group.required,
    min: group.min_select ?? undefined,
    max: group.max_select ?? undefined,
    options: (optionsByGroup.get(group.id) ?? []).map((o) => ({
      id: o.id,
      label: o.label,
      priceDelta: Number(o.price_delta),
    })),
  }));

  return {
    id: dish.id,
    name: dish.name,
    description: dish.description ?? undefined,
    basePrice: dish.base_price === null ? undefined : Number(dish.base_price),
    variants: variants.length ? variants : undefined,
    modifiers: modifiers.length ? modifiers : undefined,
    dietary: (dish.dietary as DietaryTag[]) ?? undefined,
    orderable: dish.orderable,
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
