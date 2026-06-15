import Link from "next/link";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";
import { countNewOrders, getOrders } from "@/lib/data/orders";
import { countPendingReservations, getReservations } from "@/lib/data/reservations";
import { countUnreadMessages } from "@/lib/data/messages";

function gbp(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export default async function AdminDashboard() {
  const [pendingReservations, newOrders, unreadMessages, reservations, orders] = await Promise.all([
    countPendingReservations(),
    countNewOrders(),
    countUnreadMessages(),
    getReservations(),
    getOrders(),
  ]);

  const recentReservations = reservations.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Pending reservations", value: pendingReservations, href: "/admin/reservations" },
    { label: "New orders", value: newOrders, href: "/admin/orders" },
    { label: "Unread messages", value: unreadMessages, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Today at a glance." />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="brutal-card-sm brutal-interactive p-5">
            <p className="font-display text-[40px] leading-none text-ink">{stat.value}</p>
            <p className="caps-track-tight mt-2 text-[11px] text-ink/60">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] text-ink">Latest reservations</h2>
            <Link href="/admin/reservations" className="caps-track-tight text-[11px] text-oxblood link-rule">
              View all
            </Link>
          </div>
          {recentReservations.length === 0 ? (
            <p className="text-[14px] text-ink/60">No reservations yet.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {recentReservations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[15px] text-ink">{r.name}</p>
                    <p className="text-[12px] text-ink/60">
                      {r.date} · {r.time} · {r.party_size} guests
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] text-ink">Latest orders</h2>
            <Link href="/admin/orders" className="caps-track-tight text-[11px] text-oxblood link-rule">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-[14px] text-ink/60">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[15px] text-ink">
                      {o.ref} · {o.customer_name}
                    </p>
                    <p className="text-[12px] text-ink/60">
                      {o.order_type} · {gbp(Number(o.total))}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
