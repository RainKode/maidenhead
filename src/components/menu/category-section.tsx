import { DishCard } from "@/components/menu/dish-card";
import type { Dish, MenuCategory } from "@/lib/menu-data";

type Props = {
  category: MenuCategory;
  onSelectDish: (dish: Dish) => void;
};

export function CategorySection({ category, onSelectDish }: Props) {
  return (
    <section id={category.slug} className="scroll-mt-44">
      <div className="mb-5 flex flex-col gap-2 border-b-[3px] border-ink pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="caps-track text-[12px] text-oxblood">Maidenhead Spice</p>
          <h2 className="mt-2 font-display text-[28px] text-ink md:text-[34px]">
            {category.title}
          </h2>
        </div>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink md:text-right">
          {category.blurb}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {category.dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onSelect={() => onSelectDish(dish)} />
        ))}
      </div>
    </section>
  );
}