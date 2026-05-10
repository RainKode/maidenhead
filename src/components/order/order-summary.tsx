"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  getCartSubtotal,
  useCartHydrated,
  useCartStore,
  type CartLine,
} from "@/lib/cart-store";
import {
  DELIVERY_MINIMUM,
  formatPrice,
  getDeliveryFee,
} from "@/lib/order-pricing";

export function OrderSummary() {
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const orderType = useCartStore((state) => state.orderType);
  const deliveryZone = useCartStore((state) => state.deliveryZone);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeLine = useCartStore((state) => state.removeLine);
  const subtotal = getCartSubtotal(lines);
  const deliveryFee = getDeliveryFee(orderType, deliveryZone);
  const total = subtotal + deliveryFee;

  if (!hydrated) {
    return (
      <section className="brutal-card p-6 md:p-8">
        <p className="caps-track text-[12px] text-oxblood">Order review</p>
        <div className="mt-5 h-24 animate-pulse bg-muted" />
      </section>
    );
  }

  if (!lines.length) {
    return (
      <section className="brutal-card p-6 text-center md:p-8">
        <p className="caps-track text-[12px] text-oxblood">Order review</p>
        <h2 className="mt-3 font-display text-[26px] text-ink">Your cart is empty</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
          Add dishes from the menu, then come back here to choose collection, delivery or dine-in.
        </p>
        <Link
          href="/menus"
          className="caps-track mt-6 inline-flex h-11 items-center justify-center border-[3px] border-ink bg-ink px-7 text-[12px] font-bold text-background hover:bg-ink/90 [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
        >
          Browse the Menu
        </Link>
      </section>
    );
  }

  return (
    <section className="brutal-card p-6 md:p-8">
      <p className="caps-track text-[12px] text-oxblood">Order review</p>
      <h2 className="mt-3 font-display text-[26px] text-ink">Your dishes</h2>

      <ul className="mt-6 space-y-3">
        {lines.map((line) => (
          <SummaryLine
            key={line.lineId}
            line={line}
            onQtyChange={(qty) => updateQty(line.lineId, qty)}
            onRemove={() => removeLine(line.lineId)}
          />
        ))}
      </ul>

      <div className="mt-6 space-y-2 brutal-divider pt-5 text-[15px] text-ink">
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Delivery</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between gap-4 font-display text-[22px] text-ink">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {orderType === "delivery" && subtotal < DELIVERY_MINIMUM ? (
        <p className="mt-4 text-[13px] text-destructive">
          Delivery orders need a food subtotal of at least {formatPrice(DELIVERY_MINIMUM)}.
        </p>
      ) : null}
    </section>
  );
}

function SummaryLine({
  line,
  onQtyChange,
  onRemove,
}: {
  line: CartLine;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="brutal-card-sm p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[18px] text-ink">{line.name}</p>
          {line.variantLabel ? <p className="mt-1 text-[13px] text-ink/65">{line.variantLabel}</p> : null}
          {line.modifiers.length ? (
            <p className="mt-1 text-[12px] text-ink/60">
              {line.modifiers.map((modifier) => modifier.label).join(", ")}
            </p>
          ) : null}
          {line.notes ? <p className="mt-1 text-[12px] italic text-ink/55">{line.notes}</p> : null}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${line.name}`}
          className="inline-flex size-8 shrink-0 items-center justify-center border-[2px] border-ink text-ink hover:bg-ink hover:text-background transition-colors"
        >
          <Trash2 className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex h-9 items-center border-[3px] border-ink bg-background px-1">
          <button
            type="button"
            onClick={() => onQtyChange(line.qty - 1)}
            aria-label={`Decrease ${line.name}`}
            className="inline-flex size-7 items-center justify-center border-r-[2px] border-ink text-ink hover:bg-ink hover:text-background transition-colors"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center font-display text-[16px] text-ink">{line.qty}</span>
          <button
            type="button"
            onClick={() => onQtyChange(line.qty + 1)}
            aria-label={`Increase ${line.name}`}
            className="inline-flex size-7 items-center justify-center border-l-[2px] border-ink text-ink hover:bg-ink hover:text-background transition-colors"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <span className="font-display text-[18px] text-ink">
          {formatPrice(line.unitPrice * line.qty)}
        </span>
      </div>
    </li>
  );
}