import { NextResponse } from "next/server";
import { z } from "zod";
import { findDishById, type ModifierGroup } from "@/lib/menu-data";
import {
  DELIVERY_MINIMUM,
  getDeliveryFee,
  pricesMatch,
  type DeliveryZone,
  type OrderType,
} from "@/lib/order-pricing";
import {
  isValidEmail,
  renderOrderEmail,
  sendMail,
  type OrderEmailLine,
  type OrderEmailPayload,
} from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const deliveryZoneSchema = z.enum(["0-2", "2-3", "3-4", "4-5"]);
const orderTypeSchema = z.enum(["collection", "delivery", "dine-in"]);

const modifierSchema = z.object({
  groupId: z.string().min(1),
  optionId: z.string().min(1),
  label: z.string().optional(),
  priceDelta: z.number().optional(),
});

const lineSchema = z.object({
  dishId: z.string().min(1),
  variantId: z.string().optional(),
  modifiers: z.array(modifierSchema).default([]),
  unitPrice: z.number().nonnegative(),
  qty: z.number().int().min(1).max(50),
  notes: z.string().max(220).optional(),
});

const orderSchema = z.object({
  website: z.string().optional(),
  orderType: orderTypeSchema,
  customer: z.object({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    email: z.string().trim().min(1),
  }),
  requestedFor: z.object({
    date: z.string().trim().min(1),
    time: z.string().trim().min(1),
  }),
  delivery: z
    .object({
      addressLine1: z.string().trim().min(1),
      postcode: z.string().trim().min(1),
      zone: deliveryZoneSchema,
    })
    .optional(),
  dineIn: z
    .object({
      partySize: z.number().int().min(1).max(30),
    })
    .optional(),
  notes: z.string().trim().max(400).optional(),
  lines: z.array(lineSchema).min(1),
  totals: z.object({
    subtotal: z.number().nonnegative(),
    deliveryFee: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (hasHoneypot(body)) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  if (!takeRateLimitToken(ip)) {
    return NextResponse.json({ ok: false, error: "Too many order requests" }, { status: 429 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid order details" }, { status: 400 });
  }

  const order = parsed.data;
  if (!isValidEmail(order.customer.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }
  if (order.orderType === "delivery" && !order.delivery) {
    return NextResponse.json({ ok: false, error: "Delivery address is required" }, { status: 400 });
  }
  if (order.orderType === "dine-in" && !order.dineIn) {
    return NextResponse.json({ ok: false, error: "Party size is required" }, { status: 400 });
  }

  const repricedLines: OrderEmailLine[] = [];
  for (const line of order.lines) {
    const result = repriceLine(line);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    repricedLines.push(result.line);
  }

  const subtotal = repricedLines.reduce((total, line) => total + line.unitPrice * line.qty, 0);
  const deliveryFee = getDeliveryFee(order.orderType as OrderType, order.delivery?.zone as DeliveryZone | undefined);
  const total = subtotal + deliveryFee;

  if (order.orderType === "delivery" && subtotal < DELIVERY_MINIMUM) {
    return NextResponse.json({ ok: false, error: "Delivery minimum spend not met" }, { status: 400 });
  }
  if (
    !pricesMatch(subtotal, order.totals.subtotal) ||
    !pricesMatch(deliveryFee, order.totals.deliveryFee) ||
    !pricesMatch(total, order.totals.total)
  ) {
    return NextResponse.json({ ok: false, error: "Order total mismatch" }, { status: 400 });
  }

  const ref = createOrderRef();
  const payload: OrderEmailPayload = {
    ref,
    orderType: order.orderType,
    customer: order.customer,
    requestedFor: order.requestedFor,
    delivery: order.delivery,
    dineIn: order.dineIn,
    notes: order.notes || undefined,
    lines: repricedLines,
    subtotal,
    deliveryFee,
    total,
  };

  const mailTo = process.env.MAIL_TO;
  if (!mailTo) {
    console.error("[order] MAIL_TO env var is not set");
    return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
  }

  const staffTemplate = renderOrderEmail({ order: payload, audience: "staff" });
  const customerTemplate = renderOrderEmail({ order: payload, audience: "customer" });

  const [staffResult, customerResult] = await Promise.allSettled([
    sendMail({
      to: mailTo,
      subject: `New order ${ref} - ${payload.customer.name}`,
      html: staffTemplate.html,
      text: staffTemplate.text,
      replyTo: payload.customer.email,
    }),
    sendMail({
      to: payload.customer.email,
      subject: `Order request received ${ref} - Maidenhead Spice`,
      html: customerTemplate.html,
      text: customerTemplate.text,
    }),
  ]);

  if (staffResult.status === "rejected") {
    console.error("[order] staff email failed", staffResult.reason);
    return NextResponse.json({ ok: false, error: "Failed to send order request" }, { status: 500 });
  }
  if (customerResult.status === "rejected") {
    console.error("[order] customer auto-reply failed", customerResult.reason);
  }

  return NextResponse.json({ ok: true, ref });
}

type ParsedLine = z.infer<typeof lineSchema>;

function repriceLine(line: ParsedLine): { ok: true; line: OrderEmailLine } | { ok: false; error: string } {
  const dish = findDishById(line.dishId);
  if (!dish || dish.orderable === false) return { ok: false, error: "Dish is not available" };

  let basePrice = dish.basePrice;
  let variantLabel: string | undefined;
  if (dish.variants?.length) {
    const variant = dish.variants.find((item) => item.id === line.variantId);
    if (!variant) return { ok: false, error: "Invalid dish option" };
    basePrice = variant.price;
    variantLabel = variant.label;
  }
  if (basePrice === undefined) return { ok: false, error: "Dish price is missing" };

  const modifierResult = validateModifiers(dish.modifiers ?? [], line.modifiers);
  if (!modifierResult.ok) return modifierResult;

  const unitPrice = basePrice + modifierResult.modifiers.reduce((total, modifier) => total + modifier.priceDelta, 0);
  if (!pricesMatch(unitPrice, line.unitPrice)) {
    return { ok: false, error: "Line price mismatch" };
  }

  return {
    ok: true,
    line: {
      name: dish.name,
      variantLabel,
      modifiers: modifierResult.modifiers,
      unitPrice,
      qty: line.qty,
      notes: line.notes?.trim() || undefined,
    },
  };
}

function validateModifiers(
  groups: ModifierGroup[],
  submitted: ParsedLine["modifiers"]
): { ok: true; modifiers: OrderEmailLine["modifiers"] } | { ok: false; error: string } {
  const selectedByGroup = new Map<string, OrderEmailLine["modifiers"]>();
  const seen = new Set<string>();

  for (const modifier of submitted) {
    const group = groups.find((item) => item.id === modifier.groupId);
    if (!group) return { ok: false, error: "Invalid modifier group" };
    const option = group.options.find((item) => item.id === modifier.optionId);
    if (!option) return { ok: false, error: "Invalid modifier option" };

    const key = `${group.id}:${option.id}`;
    if (seen.has(key)) return { ok: false, error: "Duplicate modifier option" };
    seen.add(key);

    const selected = selectedByGroup.get(group.id) ?? [];
    selected.push({ label: option.label, priceDelta: option.priceDelta });
    selectedByGroup.set(group.id, selected);
  }

  for (const group of groups) {
    const selected = selectedByGroup.get(group.id) ?? [];
    const minimum = group.required ? group.min ?? 1 : group.min ?? 0;
    if (selected.length < minimum) return { ok: false, error: `Choose ${group.label}` };
    if (group.type === "single" && selected.length > 1) return { ok: false, error: `Choose one ${group.label}` };
    if (group.max && selected.length > group.max) return { ok: false, error: `Too many ${group.label}` };
  }

  return { ok: true, modifiers: Array.from(selectedByGroup.values()).flat() };
}

function hasHoneypot(body: unknown): boolean {
  return typeof body === "object" && body !== null && "website" in body && Boolean((body as { website?: unknown }).website);
}

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function takeRateLimitToken(ip: string): boolean {
  const now = Date.now();
  const current = rateLimits.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

function createOrderRef(): string {
  return `MS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}