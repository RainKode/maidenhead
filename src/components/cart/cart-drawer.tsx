"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import {
  getCartSubtotal,
  useCartStore,
  type CartLine,
} from "@/lib/cart-store";
import { formatPrice } from "@/lib/order-pricing";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartDrawer({ open, onOpenChange }: Props) {
  const lines = useCartStore((state) => state.lines);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeLine = useCartStore((state) => state.removeLine);
  const subtotal = getCartSubtotal(lines);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-ink/55"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[min(420px,100vw)] flex-col bg-cream shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-5">
          <div>
            <p className="caps-track text-[11px] text-oxblood">Your order</p>
            <h2 className="mt-1 font-display text-[24px] text-ink">
              {lines.length ? `${lines.length} ${lines.length === 1 ? "item" : "items"}` : "Cart is empty"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:border-oxblood-dark hover:text-oxblood-dark"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length ? (
            <ul className="space-y-3">
              {lines.map((line) => (
                <CartDrawerLine
                  key={line.lineId}
                  line={line}
                  onQtyChange={(qty) => updateQty(line.lineId, qty)}
                  onRemove={() => removeLine(line.lineId)}
                />
              ))}
            </ul>
          ) : (
            <div className="border border-ink/10 bg-cream-deep px-5 py-8 text-center">
              <p className="font-display text-[20px] text-ink">Nothing in the cart yet.</p>
              <Link
                href="/menus"
                onClick={() => onOpenChange(false)}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-oxblood-dark px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-oxblood"
              >
                Browse the Menu
              </Link>
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 px-5 py-5">
          <div className="flex items-center justify-between font-display text-[20px] text-ink">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/order"
            onClick={() => onOpenChange(false)}
            className={cn(
              "caps-track mt-5 flex h-12 items-center justify-center rounded-full px-6 text-[12px] font-semibold transition-colors",
              lines.length
                ? "bg-oxblood-dark text-cream hover:bg-oxblood"
                : "pointer-events-none bg-ink/10 text-ink/40"
            )}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}

function CartDrawerLine({
  line,
  onQtyChange,
  onRemove,
}: {
  line: CartLine;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="border border-ink/10 bg-cream-deep p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[17px] text-ink">{line.name}</p>
          {line.variantLabel ? (
            <p className="mt-1 text-[13px] text-ink/65">{line.variantLabel}</p>
          ) : null}
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
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink/55 hover:bg-cream hover:text-destructive"
        >
          <Trash2 className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex h-9 items-center border border-ink/15 bg-cream px-1">
          <button
            type="button"
            onClick={() => onQtyChange(line.qty - 1)}
            aria-label={`Decrease ${line.name}`}
            className="inline-flex size-7 items-center justify-center rounded-full text-ink/70 hover:bg-cream-deep"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center font-display text-[16px] text-ink">{line.qty}</span>
          <button
            type="button"
            onClick={() => onQtyChange(line.qty + 1)}
            aria-label={`Increase ${line.name}`}
            className="inline-flex size-7 items-center justify-center rounded-full text-ink/70 hover:bg-cream-deep"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <span className="font-display text-[17px] text-oxblood-dark">
          {formatPrice(line.unitPrice * line.qty)}
        </span>
      </div>
    </li>
  );
}