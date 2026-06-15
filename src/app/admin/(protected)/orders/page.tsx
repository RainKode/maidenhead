import Link from "next/link";
import { EmptyState, PageHeader, SelectField, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getOrders } from "@/lib/data/orders";
import type { OrderStatus } from "@/lib/supabase/types";
import { setOrderStatus } from "./actions";

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "preparing", label: "Preparing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "preparing", label: "Preparing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function gbp(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

type Search = { searchParams: Promise<{ status?: string }> };

export default async function OrdersPage({ searchParams }: Search) {
  const { status } = await searchParams;
  const active = status && FILTERS.some((f) => f.value === status) ? status : "all";
  const orders = await getOrders(active === "all" ? {} : { status: active as OrderStatus });

  return (
    <>
      <PageHeader title="Orders" description="Online orders from the website." />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/orders" : `/admin/orders?status=${f.value}`}
            className={`caps-track-tight border-[2px] px-3 py-1.5 text-[11px] font-bold transition-colors ${
              active === f.value
                ? "border-ink bg-ink text-background"
                : "border-ink/30 text-ink/70 hover:border-ink"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState>No orders to show.</EmptyState>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="brutal-card-sm bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-[18px] text-ink">{o.ref}</p>
                    <StatusBadge status={o.status} />
                    <span className="brutal-tag">{o.order_type}</span>
                  </div>
                  <p className="mt-1 text-[14px] text-ink/75">
                    {o.customer_name} ·{" "}
                    <a href={`tel:${o.customer_phone}`} className="link-rule">
                      {o.customer_phone}
                    </a>
                  </p>
                  <p className="text-[13px] text-ink/60">
                    For {o.requested_date} at {o.requested_time}
                  </p>
                  {o.delivery ? (
                    <p className="text-[13px] text-ink/60">
                      Deliver to {o.delivery.addressLine1}, {o.delivery.postcode}
                    </p>
                  ) : null}
                  {o.dine_in ? (
                    <p className="text-[13px] text-ink/60">Dine-in · party of {o.dine_in.partySize}</p>
                  ) : null}
                </div>
                <p className="font-display text-[22px] text-ink">{gbp(Number(o.total))}</p>
              </div>

              <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {o.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-3 py-2 text-[14px]">
                    <span className="text-ink">
                      <strong>{item.qty}×</strong> {item.name}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""}
                      {item.modifiers.length ? (
                        <span className="text-ink/60">
                          {" "}
                          — {item.modifiers.map((m) => m.label).join(", ")}
                        </span>
                      ) : null}
                      {item.notes ? <span className="block text-[12px] italic text-ink/55">{item.notes}</span> : null}
                    </span>
                    <span className="whitespace-nowrap text-ink/70">
                      {gbp(Number(item.unitPrice) * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <p className="text-[13px] text-ink/60">
                  Subtotal {gbp(Number(o.subtotal))} · Delivery {gbp(Number(o.delivery_fee))}
                </p>
                <form action={setOrderStatus} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <div className="w-44">
                    <SelectField
                      label="Update status"
                      name="status"
                      defaultValue={o.status}
                      options={STATUS_OPTIONS}
                    />
                  </div>
                  <SubmitButton variant="ghost" pendingLabel="…">
                    Save
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
