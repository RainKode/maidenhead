"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/order-pricing";
import type { Dish, ModifierGroup, ModifierOption } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

type Props = {
  dish: Dish | null;
  open: boolean;
  onClose: () => void;
  onAdded: (name: string) => void;
};

type SelectedModifiers = Record<string, string[]>;

function getDefaultModifiers(dish: Dish | null): SelectedModifiers {
  if (!dish?.modifiers) return {};
  return Object.fromEntries(
    dish.modifiers.map((group) => [
      group.id,
      group.required && group.type === "single" ? [group.options[0]?.id].filter(Boolean) : [],
    ])
  );
}

export function DishCustomiser({ dish, open, onClose, onAdded }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addLine = useCartStore((state) => state.addLine);
  const [variantId, setVariantId] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>({});
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setVariantId(dish?.variants?.[0]?.id ?? "");
      setSelectedModifiers(getDefaultModifiers(dish));
      setQty(1);
      setNotes("");
    });
  }, [dish]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const selectedVariant = useMemo(
    () => dish?.variants?.find((variant) => variant.id === variantId),
    [dish, variantId]
  );

  const chosenModifiers = useMemo(() => {
    if (!dish?.modifiers) return [];
    return dish.modifiers.flatMap((group) =>
      (selectedModifiers[group.id] ?? []).flatMap((optionId) => {
        const option = group.options.find((item) => item.id === optionId);
        return option ? [{ group, option }] : [];
      })
    );
  }, [dish, selectedModifiers]);

  if (!dish) {
    return <dialog ref={dialogRef} className="hidden" />;
  }

  const basePrice = selectedVariant?.price ?? dish.basePrice ?? 0;
  const modifierTotal = chosenModifiers.reduce((total, item) => total + item.option.priceDelta, 0);
  const unitPrice = basePrice + modifierTotal;
  const lineTotal = unitPrice * qty;

  const toggleModifier = (group: ModifierGroup, option: ModifierOption) => {
    setSelectedModifiers((current) => {
      const selected = current[group.id] ?? [];
      if (group.type === "single") return { ...current, [group.id]: [option.id] };
      if (selected.includes(option.id)) {
        return { ...current, [group.id]: selected.filter((id) => id !== option.id) };
      }
      if (group.max && selected.length >= group.max) return current;
      return { ...current, [group.id]: [...selected, option.id] };
    });
  };

  const handleSubmit = () => {
    addLine({
      dishId: dish.id,
      name: dish.name,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant?.label,
      modifiers: chosenModifiers.map(({ group, option }) => ({
        groupId: group.id,
        optionId: option.id,
        label: option.label,
        priceDelta: option.priceDelta,
      })),
      unitPrice,
      qty,
      notes,
    });
    onAdded(dish.name);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(720px,calc(100vw-24px))] max-h-[calc(100vh-24px)] overflow-y-auto bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/65"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/10 bg-cream px-5 py-4 md:px-7">
        <div>
          <p className="caps-track text-[11px] text-oxblood">Customise dish</p>
          <h2 className="mt-1 font-display text-[24px] text-ink">{dish.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:border-oxblood-dark hover:text-oxblood-dark"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid gap-7 px-5 py-6 md:px-7">
        {dish.description ? (
          <p className="text-[15px] leading-relaxed text-ink/75">{dish.description}</p>
        ) : null}

        {dish.variants?.length ? (
          <fieldset>
            <legend className="caps-track-tight text-[11px] font-semibold text-oxblood-dark">
              Choose option
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dish.variants.map((variant) => (
                <label
                  key={variant.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 transition-colors",
                    variantId === variant.id
                      ? "border-oxblood-dark bg-cream-deep"
                      : "border-ink/12 hover:border-oxblood-dark/40"
                  )}
                >
                  <span className="flex items-center gap-3 text-[14px] font-semibold text-ink">
                    <input
                      type="radio"
                      name="dish-variant"
                      checked={variantId === variant.id}
                      onChange={() => setVariantId(variant.id)}
                      className="accent-oxblood-dark"
                    />
                    {variant.label}
                  </span>
                  <span className="font-display text-[15px] text-oxblood-dark">
                    {formatPrice(variant.price)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {dish.modifiers?.map((group) => (
          <fieldset key={group.id}>
            <legend className="caps-track-tight text-[11px] font-semibold text-oxblood-dark">
              {group.label}
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.options.map((option) => {
                const selected = selectedModifiers[group.id]?.includes(option.id) ?? false;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 transition-colors",
                      selected
                        ? "border-oxblood-dark bg-cream-deep"
                        : "border-ink/12 hover:border-oxblood-dark/40"
                    )}
                  >
                    <span className="flex items-center gap-3 text-[14px] font-semibold text-ink">
                      <input
                        type={group.type === "single" ? "radio" : "checkbox"}
                        name={group.id}
                        checked={selected}
                        onChange={() => toggleModifier(group, option)}
                        className="accent-oxblood-dark"
                      />
                      {option.label}
                    </span>
                    {option.priceDelta > 0 ? (
                      <span className="font-display text-[15px] text-oxblood-dark">
                        +{formatPrice(option.priceDelta)}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <div>
            <span className="caps-track-tight text-[11px] font-semibold text-oxblood-dark">
              Quantity
            </span>
            <div className="mt-3 flex h-11 w-36 items-center justify-between border border-ink/15 bg-cream-deep px-2">
              <button
                type="button"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
                className="inline-flex size-8 items-center justify-center rounded-full text-ink/70 hover:bg-cream"
              >
                <Minus className="size-4" />
              </button>
              <span className="font-display text-[18px] text-ink">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((value) => Math.min(20, value + 1))}
                aria-label="Increase quantity"
                className="inline-flex size-8 items-center justify-center rounded-full text-ink/70 hover:bg-cream"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="caps-track-tight text-[11px] font-semibold text-oxblood-dark">
              Special instructions
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              maxLength={220}
              className="resize-none border border-ink/15 bg-cream-deep px-3 py-2 text-[14px] text-ink outline-none focus:border-oxblood"
            />
          </label>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-ink/10 bg-cream px-5 py-4 md:px-7">
        <button
          type="button"
          onClick={handleSubmit}
          className="caps-track flex h-12 w-full items-center justify-center rounded-full bg-oxblood-dark px-6 text-[12px] font-semibold text-cream transition-colors hover:bg-oxblood"
        >
          Add to order - {formatPrice(lineTotal)}
        </button>
      </div>
    </dialog>
  );
}