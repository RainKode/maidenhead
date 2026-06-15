import Link from "next/link";
import { EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getReservations } from "@/lib/data/reservations";
import type { ReservationStatus } from "@/lib/supabase/types";
import { setReservationStatus } from "./actions";

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
];

type Search = { searchParams: Promise<{ status?: string }> };

export default async function ReservationsPage({ searchParams }: Search) {
  const { status } = await searchParams;
  const active = status && FILTERS.some((f) => f.value === status) ? status : "all";
  const reservations = await getReservations(
    active === "all" ? {} : { status: active as ReservationStatus }
  );

  return (
    <>
      <PageHeader
        title="Reservations"
        description="Bookings from the website. Confirm or decline — the customer is emailed."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/reservations" : `/admin/reservations?status=${f.value}`}
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

      {reservations.length === 0 ? (
        <EmptyState>No reservations to show.</EmptyState>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="brutal-card-sm flex flex-col gap-4 bg-background p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-display text-[18px] text-ink">{r.name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-[14px] text-ink/75">
                  {r.date} · {r.time} · {r.party_size} {r.party_size === 1 ? "guest" : "guests"}
                </p>
                <p className="mt-1 text-[13px] text-ink/60">
                  <a href={`tel:${r.phone}`} className="link-rule">
                    {r.phone}
                  </a>{" "}
                  ·{" "}
                  <a href={`mailto:${r.email}`} className="link-rule">
                    {r.email}
                  </a>
                </p>
                {r.notes ? <p className="mt-2 text-[13px] italic text-ink/70">“{r.notes}”</p> : null}
              </div>

              <div className="flex shrink-0 flex-col items-start gap-2 sm:flex-row sm:items-center">
                <form action={setReservationStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="confirmed" />
                  <input type="hidden" name="notify" value="on" />
                  <SubmitButton variant="ghost" pendingLabel="…">
                    Confirm
                  </SubmitButton>
                </form>
                <form action={setReservationStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="declined" />
                  <input type="hidden" name="notify" value="on" />
                  <SubmitButton variant="danger" pendingLabel="…">
                    Decline
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
