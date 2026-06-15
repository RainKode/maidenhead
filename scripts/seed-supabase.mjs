// ---------------------------------------------------------------------------
// Seed Supabase with the static baseline menu from src/lib/menu-data.ts.
//
// Usage (Node 24+, which strips TypeScript types natively):
//   node --env-file=.env.local scripts/seed-supabase.mjs
//   node --env-file=.env.local scripts/seed-supabase.mjs --reset
//
// Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the env.
// By default it refuses to run if a menu already exists; pass --reset to wipe
// the existing menu (categories -> dishes -> variants -> modifiers) and reload.
// ---------------------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import { menu } from "../src/lib/menu-data.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const reset = process.argv.includes("--reset");

if (!url || !serviceKey) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Try: node --env-file=.env.local scripts/seed-supabase.mjs"
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function fail(label, error) {
  if (error) {
    console.error(`✗ ${label}:`, error.message ?? error);
    process.exit(1);
  }
}

async function main() {
  const { count, error: countError } = await db
    .from("menu_categories")
    .select("id", { count: "exact", head: true });
  fail("count categories", countError);

  if (count && count > 0) {
    if (!reset) {
      console.error(
        `A menu already exists (${count} categories). Re-run with --reset to wipe and reload.`
      );
      process.exit(1);
    }
    console.log(`Resetting existing menu (${count} categories)…`);
    // ON DELETE CASCADE removes dishes -> variants -> modifier groups/options.
    const { error } = await db
      .from("menu_categories")
      .delete()
      .not("id", "is", null);
    fail("reset menu", error);
  }

  let categoryIndex = 0;
  for (const category of menu) {
    const { data: catRow, error: catError } = await db
      .from("menu_categories")
      .insert({
        slug: category.slug,
        title: category.title,
        blurb: category.blurb,
        sort_order: categoryIndex++,
      })
      .select("id")
      .single();
    fail(`insert category ${category.slug}`, catError);

    let dishIndex = 0;
    for (const dish of category.dishes) {
      const { data: dishRow, error: dishError } = await db
        .from("dishes")
        .insert({
          category_id: catRow.id,
          name: dish.name,
          description: dish.description ?? null,
          base_price: dish.basePrice ?? null,
          dietary: dish.dietary ?? [],
          orderable: dish.orderable ?? true,
          available: true,
          sort_order: dishIndex++,
        })
        .select("id")
        .single();
      fail(`insert dish ${dish.name}`, dishError);

      if (dish.variants?.length) {
        const { error } = await db.from("dish_variants").insert(
          dish.variants.map((v, i) => ({
            dish_id: dishRow.id,
            label: v.label,
            price: v.price,
            sort_order: i,
          }))
        );
        fail(`insert variants for ${dish.name}`, error);
      }

      if (dish.modifiers?.length) {
        let groupIndex = 0;
        for (const group of dish.modifiers) {
          const { data: groupRow, error: groupError } = await db
            .from("modifier_groups")
            .insert({
              dish_id: dishRow.id,
              label: group.label,
              type: group.type,
              required: group.required ?? false,
              min_select: group.min ?? null,
              max_select: group.max ?? null,
              sort_order: groupIndex++,
            })
            .select("id")
            .single();
          fail(`insert modifier group ${group.label}`, groupError);

          const { error: optError } = await db.from("modifier_options").insert(
            group.options.map((o, i) => ({
              group_id: groupRow.id,
              label: o.label,
              price_delta: o.priceDelta,
              sort_order: i,
            }))
          );
          fail(`insert options for ${group.label}`, optError);
        }
      }
    }
    console.log(`✓ ${category.title} (${category.dishes.length} dishes)`);
  }

  console.log("\nSeed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
