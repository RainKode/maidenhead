"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import {
  getCartLineCount,
  getCartSubtotal,
  useCartHydrated,
  useCartStore,
} from "@/lib/cart-store";
import { formatPrice } from "@/lib/order-pricing";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const lineCount = getCartLineCount(lines);
  const subtotal = getCartSubtotal(lines);

  if (!hydrated || lineCount === 0 || pathname?.startsWith("/order")) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-3 rounded-full bg-oxblood-dark px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream shadow-xl transition-colors hover:bg-oxblood"
      >
        <ShoppingBag className="size-4" strokeWidth={1.7} />
        <span>View order</span>
        <span className="font-display text-[17px] tracking-normal">{lineCount}</span>
        <span className="font-display text-[17px] tracking-normal">{formatPrice(subtotal)}</span>
      </button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}