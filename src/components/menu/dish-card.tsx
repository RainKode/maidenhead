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
    <article className="group border border-ink/10 bg-cream-deep p-5 transition-colors hover:border-oxblood-dark/35">
      <button
        type="button"
        onClick={orderable ? onSelect : undefined}
        disabled={!orderable}
        className="flex h-full w-full flex-col text-left disabled:cursor-default"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3 className="font-display text-[19px] leading-tight text-ink">
              {dish.name}
            </h3>
            {dish.dietary?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {dish.dietary.map((tag) => (
                  <span
                    key={tag}
                    title={dietaryKey[tag]}
                    className="caps-track-tight rounded-sm border border-oxblood/35 px-1.5 py-0.5 text-[9px] font-semibold text-oxblood"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <span className="shrink-0 font-display text-[18px] text-oxblood-dark">
            {priceLabel}
          </span>
        </div>

        {dish.description ? (
          <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
            {dish.description}
          </p>
        ) : null}

        {orderable ? (
          <span className="mt-5 inline-flex h-9 w-fit items-center gap-2 rounded-full border border-oxblood-dark/30 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-oxblood-dark transition-colors group-hover:bg-oxblood-dark group-hover:text-cream">
            <Plus className="size-3.5" strokeWidth={1.75} />
            Add
          </span>
        ) : (
          <span className="mt-5 text-[13px] italic text-ink/60">Please call for buffet details.</span>
        )}
      </button>
    </article>
  );
}