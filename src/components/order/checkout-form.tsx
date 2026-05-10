"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCartLineCount,
  getCartSubtotal,
  useCartHydrated,
  useCartStore,
} from "@/lib/cart-store";
import {
  DELIVERY_MINIMUM,
  deliveryZones,
  formatPrice,
  getDeliveryFee,
  type DeliveryZone,
  type OrderType,
} from "@/lib/order-pricing";
import { cn } from "@/lib/utils";
import { TimeSlotPicker, orderTimeSlots } from "@/components/order/time-slot-picker";

type Status = "idle" | "submitting" | "error";

const orderTypes: { id: OrderType; label: string }[] = [
  { id: "collection", label: "Collection" },
  { id: "delivery", label: "Delivery" },
  { id: "dine-in", label: "Dine-in" },
];

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);
  const orderType = useCartStore((state) => state.orderType);
  const deliveryZone = useCartStore((state) => state.deliveryZone);
  const setOrderType = useCartStore((state) => state.setOrderType);
  const setDeliveryZone = useCartStore((state) => state.setDeliveryZone);
  const setDeliveryAddress = useCartStore((state) => state.setDeliveryAddress);
  const setScheduledFor = useCartStore((state) => state.setScheduledFor);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const subtotal = getCartSubtotal(lines);
  const deliveryFee = getDeliveryFee(orderType, deliveryZone);
  const total = subtotal + deliveryFee;
  const lineCount = getCartLineCount(lines);
  const deliveryBlocked = orderType === "delivery" && subtotal < DELIVERY_MINIMUM;

  useEffect(() => {
    setDate(todayIso());
    setTime(orderTimeSlots[0] ?? "");
  }, []);

  const submitLabel = useMemo(() => {
    if (status === "submitting") return "Sending order...";
    if (!lineCount) return "Add dishes first";
    if (deliveryBlocked) return `Delivery min ${formatPrice(DELIVERY_MINIMUM)}`;
    return `Send order request - ${formatPrice(total)}`;
  }, [deliveryBlocked, lineCount, status, total]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!hydrated || !lines.length) {
      setError("Add at least one dish before checking out.");
      return;
    }
    if (deliveryBlocked) {
      setError(`Delivery orders need a food subtotal of at least ${formatPrice(DELIVERY_MINIMUM)}.`);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
    const postcode = String(formData.get("postcode") ?? "").trim();
    setScheduledFor(`${date} ${time}`);
    if (orderType === "delivery") setDeliveryAddress(`${addressLine1}, ${postcode}`.trim());

    const payload = {
      website: String(formData.get("website") ?? ""),
      orderType,
      customer: {
        name: String(formData.get("name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
      },
      requestedFor: { date, time },
      delivery:
        orderType === "delivery"
          ? { addressLine1, postcode, zone: deliveryZone }
          : undefined,
      dineIn:
        orderType === "dine-in"
          ? { partySize: Number(formData.get("partySize") ?? 0) }
          : undefined,
      notes: String(formData.get("notes") ?? "").trim(),
      lines: lines.map((line) => ({
        dishId: line.dishId,
        variantId: line.variantId,
        modifiers: line.modifiers,
        unitPrice: line.unitPrice,
        qty: line.qty,
        notes: line.notes,
      })),
      totals: { subtotal, deliveryFee, total },
    };

    setStatus("submitting");
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; ref?: string; error?: string };
      if (!response.ok || !result.ok || !result.ref) {
        throw new Error(result.error ?? "Order request failed");
      }

      localStorage.setItem(
        "ms-last-order",
        JSON.stringify({
          ref: result.ref,
          orderType,
          requestedFor: { date, time },
          lineCount,
          total,
          lines,
        })
      );
      clear();
      router.push(`/order/confirmed?ref=${encodeURIComponent(result.ref)}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    }
  };

  return (
    <section className="brutal-card p-6 md:p-8">
      <p className="caps-track text-[12px] text-oxblood">Checkout</p>
      <h2 className="mt-3 font-display text-[26px] text-ink">Request your order</h2>

      <form onSubmit={onSubmit} className="mt-6 grid gap-5">
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Order type">
          {orderTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setOrderType(type.id)}
              aria-pressed={orderType === type.id}
              className={cn(
                "caps-track-tight h-11 border-[2px] px-2 text-[10px] font-bold transition-colors sm:text-[11px]",
                orderType === type.id
                  ? "border-ink bg-ink text-background"
                  : "border-ink/30 text-ink/70 hover:border-ink"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" required />
          <Field label="Phone" name="phone" type="tel" required />
        </div>
        <Field label="Email" name="email" type="email" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="caps-track-tight text-[10px] text-ink/60">Date</span>
            <input
              type="date"
              name="date"
              required
              min={todayIso()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-10 border-0 border-b-[3px] border-ink bg-transparent px-0 text-[15px] text-ink outline-none focus:border-saffron"
            />
          </label>
          <TimeSlotPicker name="time" value={time} onChange={setTime} required />
        </div>

        {orderType === "delivery" ? (
          <div className="grid gap-4 border-y-[3px] border-ink py-5">
            <Field label="Address line 1" name="addressLine1" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Postcode" name="postcode" required />
              <label className="flex flex-col gap-1.5">
                <span className="caps-track-tight text-[10px] text-ink/60">Distance</span>
                <select
                  name="deliveryZone"
                  value={deliveryZone}
                  onChange={(event) => setDeliveryZone(event.target.value as DeliveryZone)}
                  className="h-10 appearance-none border-0 border-b-[3px] border-ink bg-transparent px-0 text-[15px] text-ink outline-none focus:border-saffron"
                >
                  {deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.label} - {formatPrice(zone.fee)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : null}

        {orderType === "dine-in" ? (
          <label className="flex flex-col gap-1.5 border-y-[3px] border-ink py-5">
            <span className="caps-track-tight text-[10px] font-bold text-ink uppercase tracking-[0.08em]">Party size</span>
            <select
              name="partySize"
              required
              className="h-10 appearance-none border-0 border-b-[3px] border-ink bg-transparent px-0 text-[15px] text-ink outline-none focus:border-saffron"
            >
              <option value="">Choose...</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="caps-track-tight text-[10px] font-bold text-ink uppercase tracking-[0.08em]">Order notes</span>
          <textarea
            name="notes"
            rows={3}
            maxLength={400}
            className="resize-none border-[3px] border-ink bg-transparent px-3 py-2 text-[15px] text-ink outline-none focus:outline-[3px] focus:outline-saffron [box-shadow:var(--shadow-brutal-sm)]"
          />
        </label>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 opacity-0"
        />

        <p className="text-[12px] leading-relaxed text-ink/60">
          No payment is taken online. The kitchen will call to confirm your order and timing.
        </p>

        <button
          type="submit"
          disabled={status === "submitting" || !lineCount || deliveryBlocked}
          className="caps-track inline-flex h-12 items-center justify-center border-[3px] border-ink bg-saffron px-7 text-[12px] font-bold text-ink [box-shadow:var(--shadow-brutal-sm)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitLabel}
        </button>

        {error ? (
          <p role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] font-bold text-ink uppercase tracking-[0.08em]">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="h-10 border-0 border-b-[3px] border-ink bg-transparent px-0 text-[15px] text-ink outline-none focus:border-saffron"
      />
    </label>
  );
}