export type OrderType = "collection" | "delivery" | "dine-in";
export type DeliveryZone = "0-2" | "2-3" | "3-4" | "4-5";

export const DELIVERY_MINIMUM = 20;

export const deliveryZones: { id: DeliveryZone; label: string; fee: number }[] = [
  { id: "0-2", label: "Within 2 miles", fee: 0 },
  { id: "2-3", label: "2 to 3 miles", fee: 3 },
  { id: "3-4", label: "3 to 4 miles", fee: 4 },
  { id: "4-5", label: "4 to 5 miles", fee: 5 },
];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function toPence(amount: number): number {
  return Math.round(amount * 100);
}

export function pricesMatch(left: number, right: number): boolean {
  return toPence(left) === toPence(right);
}

export function getDeliveryFee(orderType: OrderType, zone?: DeliveryZone): number {
  if (orderType !== "delivery") return 0;
  return deliveryZones.find((item) => item.id === zone)?.fee ?? 0;
}