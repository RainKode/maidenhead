import { Plus } from "lucide-react";
import { dietaryKey, getDishStartingPrice, type Dish } from "@/lib/menu-data";
import { formatPrice } from "@/lib/order-pricing";

type Props = {
  dish: Dish;
  onSelect: () => void;
};

export function DishCard({ dish, onSelect }: Props) {
  const startingPrice = getDishStartingPrice(dish);
  const hasVariants = Boolean(dish.variants?.length);
  const orderable = dish.orderable !== false && startingPrice !== null;
  const priceLabel = startingPrice === null
    ? "Call us"
    : `${hasVariants ? "from " : ""}${formatPrice(startingPrice)}`;

  return (
    <article className="brutal-card brutal-interactive p-5">
      <button
        type="button"
        onClick={orderable ? onSelect : undefined}
        disabled={!orderable}
        className="flex h-full w-full flex-col text-left disabled:cursor-default"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3 className="font-display text-[22px] leading-tight text-ink">
              {dish.name}
            </h3>
            {dish.dietary?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {dish.dietary.map((tag) => (
                  <span
                    key={tag}
                    title={dietaryKey[tag]}
                    className="brutal-tag bg-background"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <span className="shrink-0 font-display text-[20px] text-ink bg-saffron px-2 py-1 border-[2px] border-ink [box-shadow:3px_3px_0_var(--ink)]">
            {priceLabel}
          </span>
        </div>

        {dish.description ? (
          <p className="mt-3 text-[15px] leading-[1.55] text-ink">
            {dish.description}
          </p>
        ) : null}

        {orderable ? (
          <span className="mt-5 inline-flex h-8 w-fit items-center gap-2 border-[2px] border-ink bg-ink text-background px-3 text-[11px] font-bold uppercase tracking-[0.1em] [box-shadow:3px_3px_0_var(--ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-transform">
            <Plus className="size-3.5" strokeWidth={2} />
            Add
          </span>
        ) : (
          <span className="mt-5 text-[13px] italic text-ink/60">Please call for buffet details.</span>
        )}
      </button>
    </article>
  );
}