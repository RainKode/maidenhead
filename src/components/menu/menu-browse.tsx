"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CategorySection } from "@/components/menu/category-section";
import { DishCustomiser } from "@/components/menu/dish-customiser";
import { cn } from "@/lib/utils";
import type { DietaryTag, Dish, MenuCategory } from "@/lib/menu-data";

const dietaryFilters: DietaryTag[] = ["V", "VG", "GF", "Hot"];

type Props = {
  categories: MenuCategory[];
};

export function MenuBrowse({ categories }: Props) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DietaryTag[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("ms-menu-scroll");
    if (saved) requestAnimationFrame(() => window.scrollTo({ top: Number(saved) }));

    const saveScroll = () => sessionStorage.setItem("ms-menu-scroll", String(window.scrollY));
    window.addEventListener("pagehide", saveScroll);
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      saveScroll();
      window.removeEventListener("pagehide", saveScroll);
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return categories
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) => {
          const searchTarget = [
            dish.name,
            dish.description,
            dish.variants?.map((variant) => variant.label).join(" "),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          const matchesQuery = normalizedQuery.length === 0 || searchTarget.includes(normalizedQuery);
          const matchesFilters = filters.every((filter) => dish.dietary?.includes(filter));
          return matchesQuery && matchesFilters;
        }),
      }))
      .filter((category) => category.dishes.length > 0);
  }, [categories, filters, query]);

  const toggleFilter = (filter: DietaryTag) => {
    setFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  };

  return (
    <div className="space-y-10">
      <div className="sticky top-16 z-30 -mx-6 border-y border-ink/10 bg-cream/95 px-6 py-4 backdrop-blur md:top-[88px] md:-mx-10 md:px-10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,340px)_1fr] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search menu</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/45" strokeWidth={1.5} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search dishes"
                className="h-11 w-full rounded-full border border-ink/15 bg-cream-deep/70 pl-10 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/45 focus:border-oxblood"
              />
            </label>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {dietaryFilters.map((filter) => {
                const selected = filters.includes(filter);
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => toggleFilter(filter)}
                    aria-pressed={selected}
                    className={cn(
                      "caps-track-tight h-9 rounded-full border px-4 text-[11px] font-semibold transition-colors",
                      selected
                        ? "border-oxblood-dark bg-oxblood-dark text-cream"
                        : "border-oxblood-dark/25 text-oxblood-dark hover:border-oxblood-dark"
                    )}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <nav aria-label="Menu categories" className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="caps-track-tight inline-flex h-8 shrink-0 items-center rounded-full border border-ink/15 px-3 text-[10px] font-semibold text-ink/70 transition-colors hover:border-oxblood-dark hover:text-oxblood-dark"
              >
                {category.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            onSelectDish={setSelectedDish}
          />
        ))
      ) : (
        <div className="border border-ink/10 bg-cream-deep px-6 py-12 text-center">
          <p className="caps-track text-[12px] text-oxblood">No matches</p>
          <p className="mt-3 font-display text-[20px] text-ink">Try a different search or filter.</p>
        </div>
      )}

      <DishCustomiser
        dish={selectedDish}
        open={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
        onAdded={(name) => setToast(name)}
      />

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-oxblood-dark px-5 py-3 text-[13px] font-semibold text-cream shadow-lg"
        >
          Added {toast} to order
        </div>
      ) : null}
    </div>
  );
}