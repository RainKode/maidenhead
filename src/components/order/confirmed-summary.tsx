"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, type OrderType } from "@/lib/order-pricing";
import type { CartLine } from "@/lib/cart-store";

type LastOrder = {
  ref: string;
  orderType: OrderType;
  requestedFor: { date: string; time: string };
  lineCount: number;
  total: number;
  lines: CartLine[];
};

export function ConfirmedSummary({ refFromQuery }: { refFromQuery?: string }) {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const raw = localStorage.getItem("ms-last-order");
      if (!raw) return;
      try {
        setOrder(JSON.parse(raw) as LastOrder);
      } catch {
        setOrder(null);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const ref = refFromQuery ?? order?.ref;

  return (
    <div className="mx-auto max-w-[760px] border border-ink/10 bg-cream-deep px-6 py-10 text-center md:px-10">
      <p className="caps-track text-[12px] text-oxblood">Thank you</p>
      <h1 className="mt-3 font-display text-[32px] text-ink md:text-[40px]">
        We have received your order request
      </h1>
      {ref ? (
        <p className="mt-4 font-display text-[20px] text-oxblood-dark">
          Reference {ref}
        </p>
      ) : null}
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink/75">
        The kitchen will call shortly to confirm timing and payment. For anything urgent, phone 01628 670670.
      </p>

      {order ? (
        <div className="mt-8 border border-ink/10 bg-cream p-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <div>
              <p className="caps-track-tight text-[10px] text-ink/55">Order type</p>
              <p className="font-display text-[18px] capitalize text-ink">{order.orderType.replace("-", " ")}</p>
            </div>
            <div className="text-right">
              <p className="caps-track-tight text-[10px] text-ink/55">Requested for</p>
              <p className="font-display text-[18px] text-ink">
                {order.requestedFor.date} at {order.requestedFor.time}
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {order.lines.map((line) => (
              <li key={line.lineId} className="flex justify-between gap-4 text-[14px] text-ink/75">
                <span>
                  {line.qty} x {line.name}
                  {line.variantLabel ? ` (${line.variantLabel})` : ""}
                </span>
                <span>{formatPrice(line.unitPrice * line.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-ink/10 pt-4 font-display text-[20px] text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/menus"
          className="caps-track inline-flex h-11 items-center justify-center rounded-full border border-oxblood-dark px-7 text-[12px] font-semibold text-oxblood-dark transition-colors hover:bg-oxblood-dark hover:text-cream"
        >
          Browse Menu
        </Link>
        <a
          href="tel:01628670670"
          className="caps-track inline-flex h-11 items-center justify-center rounded-full bg-oxblood-dark px-7 text-[12px] font-semibold text-cream transition-colors hover:bg-oxblood"
        >
          Call Kitchen
        </a>
      </div>
    </div>
  );
}