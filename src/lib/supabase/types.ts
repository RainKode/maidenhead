/**
 * Hand-written row types for the Supabase schema (supabase/migrations/0001_init.sql).
 * Kept deliberately small — we type the rows we read/write, not the full Database
 * generic, to avoid a codegen step.
 */

export type ReservationStatus = "pending" | "confirmed" | "declined";
export type OrderStatus = "new" | "preparing" | "completed" | "cancelled";
export type ContentStatus = "draft" | "published";

export interface MenuCategoryRow {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  sort_order: number;
}

export interface DishRow {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  dietary: string[];
  orderable: boolean;
  available: boolean;
  sort_order: number;
}

export interface DishVariantRow {
  id: string;
  dish_id: string;
  label: string;
  price: number;
  sort_order: number;
}

export interface ModifierGroupRow {
  id: string;
  dish_id: string;
  label: string;
  type: "single" | "multi";
  required: boolean;
  min_select: number | null;
  max_select: number | null;
  sort_order: number;
}

export interface ModifierOptionRow {
  id: string;
  group_id: string;
  label: string;
  price_delta: number;
  sort_order: number;
}

export interface ReservationRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party_size: number;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItemJson {
  name: string;
  variantLabel?: string;
  modifiers: { label: string; priceDelta: number }[];
  unitPrice: number;
  qty: number;
  notes?: string;
}

export interface OrderRow {
  id: string;
  ref: string;
  order_type: "collection" | "delivery" | "dine-in";
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  requested_date: string;
  requested_time: string;
  delivery: { addressLine1: string; postcode: string; zone: string } | null;
  dine_in: { partySize: number } | null;
  notes: string | null;
  items: OrderItemJson[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  author: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  ingredients: string[];
  steps: string[];
  prep_time: string | null;
  cook_time: string | null;
  serves: string | null;
  difficulty: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}
