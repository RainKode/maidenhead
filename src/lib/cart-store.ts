"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type DeliveryZone,
  type OrderType,
  getDeliveryFee,
} from "@/lib/order-pricing";

export type CartModifier = {
  groupId: string;
  optionId: string;
  label: string;
  priceDelta: number;
};

export type CartLine = {
  lineId: string;
  dishId: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  modifiers: CartModifier[];
  unitPrice: number;
  qty: number;
  notes?: string;
};

export type AddCartLineInput = Omit<CartLine, "lineId">;

type CartState = {
  lines: CartLine[];
  orderType: OrderType;
  deliveryZone: DeliveryZone;
  deliveryAddress: string;
  scheduledFor: string;
  addLine: (line: AddCartLineInput) => void;
  updateQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  setOrderType: (orderType: OrderType) => void;
  setDeliveryZone: (zone: DeliveryZone) => void;
  setDeliveryAddress: (address: string) => void;
  setScheduledFor: (scheduledFor: string) => void;
};

function createLineId(line: AddCartLineInput): string {
  const modifierKey = line.modifiers
    .map((modifier) => `${modifier.groupId}:${modifier.optionId}`)
    .sort()
    .join("|");
  return [line.dishId, line.variantId ?? "base", modifierKey, Date.now().toString(36)]
    .filter(Boolean)
    .join("__");
}

export function getCartSubtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitPrice * line.qty, 0);
}

export function getCartLineCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.qty, 0);
}

export function getCartTotal(lines: CartLine[], orderType: OrderType, zone?: DeliveryZone): number {
  return getCartSubtotal(lines) + getDeliveryFee(orderType, zone);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      orderType: "collection",
      deliveryZone: "0-2",
      deliveryAddress: "",
      scheduledFor: "",
      addLine: (line) =>
        set((state) => ({
          lines: [
            ...state.lines,
            {
              ...line,
              notes: line.notes?.trim() || undefined,
              lineId: createLineId(line),
            },
          ],
        })),
      updateQty: (lineId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((line) => line.lineId !== lineId)
              : state.lines.map((line) =>
                  line.lineId === lineId ? { ...line, qty } : line
                ),
        })),
      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.lineId !== lineId),
        })),
      clear: () =>
        set({
          lines: [],
          orderType: "collection",
          deliveryZone: "0-2",
          deliveryAddress: "",
          scheduledFor: "",
        }),
      setOrderType: (orderType) => set({ orderType }),
      setDeliveryZone: (deliveryZone) => set({ deliveryZone }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setScheduledFor: (scheduledFor) => set({ scheduledFor }),
    }),
    {
      name: "ms-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lines: state.lines,
        orderType: state.orderType,
        deliveryZone: state.deliveryZone,
        deliveryAddress: state.deliveryAddress,
        scheduledFor: state.scheduledFor,
      }),
    }
  )
);

function getPersistHydrated(): boolean {
  return typeof window !== "undefined" && useCartStore.persist?.hasHydrated?.() === true;
}

export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(getPersistHydrated);

  useEffect(() => {
    if (getPersistHydrated()) {
      queueMicrotask(() => setHydrated(true));
    }
    const unsubscribe = useCartStore.persist?.onFinishHydration?.(() => setHydrated(true));
    return () => unsubscribe?.();
  }, []);

  return hydrated;
}