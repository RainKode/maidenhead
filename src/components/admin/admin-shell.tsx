"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Reservations", href: "/admin/reservations" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Journal", href: "/admin/blog" },
  { label: "Recipes", href: "/admin/recipes" },
  { label: "Messages", href: "/admin/messages" },
];

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-cream md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="border-ink bg-background md:sticky md:top-0 md:h-screen md:border-r-[3px]">
        <div className="border-b-[3px] border-ink px-5 py-5">
          <Link href="/admin" className="font-display text-[18px] tracking-[0.12em] text-ink">
            MAIDENHEAD SPICE
          </Link>
          <p className="caps-track-tight mt-1 text-[10px] text-oxblood">Admin Panel</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col md:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "caps-track-tight whitespace-nowrap border-[2px] px-3 py-2 text-[12px] font-bold transition-colors",
                isActive(item.href)
                  ? "border-ink bg-ink text-background"
                  : "border-transparent text-ink/70 hover:border-ink hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t-[3px] border-ink p-4 md:block">
          <p className="truncate text-[12px] text-ink/60" title={userEmail}>
            {userEmail}
          </p>
          <form action={signOut} className="mt-2">
            <button
              type="submit"
              className="caps-track-tight text-[11px] font-bold text-oxblood link-rule"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-4 flex justify-end md:hidden">
          <form action={signOut}>
            <button
              type="submit"
              className="caps-track-tight text-[11px] font-bold text-oxblood link-rule"
            >
              Sign out · {userEmail}
            </button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
