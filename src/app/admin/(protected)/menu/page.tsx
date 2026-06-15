import Link from "next/link";
import { ButtonLink, EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAdminMenu, type AdminDish } from "@/lib/data/menu-admin";
import { removeCategory, removeDish, toggleAvailability } from "./actions";

function gbp(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

function startingPrice(dish: AdminDish): number | null {
  if (dish.variants.length) return Math.min(...dish.variants.map((v) => v.price));
  return dish.base_price;
}

export default async function AdminMenuPage() {
  const categories = await getAdminMenu();

  return (
    <>
      <PageHeader
        title="Menu"
        description="Manage categories, dishes, prices, variants and options."
        action={<ButtonLink href="/admin/menu/categories/new">New category</ButtonLink>}
      />

      {categories.length === 0 ? (
        <EmptyState>
          No menu yet. Create a category, or seed the baseline menu with{" "}
          <code className="bg-cream-deep px-1">scripts/seed-supabase.mjs</code>.
        </EmptyState>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[2px] border-ink pb-2">
                <div>
                  <h2 className="font-display text-[22px] text-ink">{category.title}</h2>
                  <p className="text-[12px] text-ink/55">
                    {category.dishes.length} {category.dishes.length === 1 ? "dish" : "dishes"} ·
                    /menus#{category.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/menu/dishes/new?category=${category.id}`}
                    className="caps-track-tight border-[2px] border-ink bg-saffron px-3 py-1.5 text-[11px] font-bold text-ink"
                  >
                    + Dish
                  </Link>
                  <Link
                    href={`/admin/menu/categories/${category.id}`}
                    className="caps-track-tight border-[2px] border-ink px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-ink hover:text-background"
                  >
                    Edit
                  </Link>
                  <form action={removeCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <SubmitButton variant="danger" pendingLabel="…">
                      Delete
                    </SubmitButton>
                  </form>
                </div>
              </div>

              {category.dishes.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink/55">No dishes in this category yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-ink/10">
                  {category.dishes.map((dish) => {
                    const starting = startingPrice(dish);
                    return (
                      <li
                        key={dish.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/menu/dishes/${dish.id}`}
                              className="text-[15px] font-bold text-ink link-rule"
                            >
                              {dish.name}
                            </Link>
                            {!dish.available ? <StatusBadge status="draft" /> : null}
                            {dish.orderable === false ? (
                              <span className="brutal-tag">Not orderable</span>
                            ) : null}
                          </div>
                          <p className="text-[12px] text-ink/55">
                            {dish.variants.length
                              ? `${dish.variants.length} variants · from ${gbp(starting)}`
                              : gbp(dish.base_price)}
                            {dish.modifiers.length ? ` · ${dish.modifiers.length} option groups` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <form action={toggleAvailability}>
                            <input type="hidden" name="id" value={dish.id} />
                            <input
                              type="hidden"
                              name="available"
                              value={(!dish.available).toString()}
                            />
                            <SubmitButton variant="ghost" pendingLabel="…">
                              {dish.available ? "Hide" : "Show"}
                            </SubmitButton>
                          </form>
                          <form action={removeDish}>
                            <input type="hidden" name="id" value={dish.id} />
                            <SubmitButton variant="danger" pendingLabel="…">
                              Delete
                            </SubmitButton>
                          </form>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
