-- ===========================================================================
-- Maidenhead Spice — schema (run first)
-- Menu (categories -> dishes -> variants / modifier groups -> options),
-- reservations, orders, blog posts, recipes, contact messages.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- --- shared updated_at trigger ---------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- MENU
-- ===========================================================================

create table if not exists public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  blurb       text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.dishes (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.menu_categories(id) on delete cascade,
  name         text not null,
  description  text,
  base_price   numeric(10,2),
  dietary      text[] not null default '{}',
  orderable    boolean not null default true,
  available    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists dishes_category_idx on public.dishes(category_id);

create table if not exists public.dish_variants (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references public.dishes(id) on delete cascade,
  label       text not null,
  price       numeric(10,2) not null,
  sort_order  integer not null default 0
);
create index if not exists dish_variants_dish_idx on public.dish_variants(dish_id);

create table if not exists public.modifier_groups (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references public.dishes(id) on delete cascade,
  label       text not null,
  type        text not null default 'single' check (type in ('single','multi')),
  required    boolean not null default false,
  min_select  integer,
  max_select  integer,
  sort_order  integer not null default 0
);
create index if not exists modifier_groups_dish_idx on public.modifier_groups(dish_id);

create table if not exists public.modifier_options (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.modifier_groups(id) on delete cascade,
  label       text not null,
  price_delta numeric(10,2) not null default 0,
  sort_order  integer not null default 0
);
create index if not exists modifier_options_group_idx on public.modifier_options(group_id);

-- ===========================================================================
-- RESERVATIONS
-- ===========================================================================

create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text not null,
  date        date not null,
  time        text not null,
  party_size  integer not null,
  notes       text,
  status      text not null default 'pending' check (status in ('pending','confirmed','declined')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists reservations_date_idx on public.reservations(date);
create index if not exists reservations_status_idx on public.reservations(status);

-- ===========================================================================
-- ORDERS
-- ===========================================================================

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null,
  order_type      text not null check (order_type in ('collection','delivery','dine-in')),
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text not null,
  requested_date  text not null,
  requested_time  text not null,
  delivery        jsonb,
  dine_in         jsonb,
  notes           text,
  items           jsonb not null default '[]',
  subtotal        numeric(10,2) not null default 0,
  delivery_fee    numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  status          text not null default 'new' check (status in ('new','preparing','completed','cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ===========================================================================
-- CONTENT — blog posts & recipes
-- ===========================================================================

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',
  cover_image  text,
  author       text not null default 'Maidenhead Spice',
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists blog_posts_status_idx on public.blog_posts(status, published_at desc);

create table if not exists public.recipes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',
  cover_image  text,
  ingredients  text[] not null default '{}',
  steps        text[] not null default '{}',
  prep_time    text,
  cook_time    text,
  serves       text,
  difficulty   text,
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists recipes_status_idx on public.recipes(status, published_at desc);

-- ===========================================================================
-- CONTACT MESSAGES
-- ===========================================================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists contact_messages_read_idx on public.contact_messages(read, created_at desc);

-- --- updated_at triggers ----------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'menu_categories','dishes','reservations','orders','blog_posts','recipes'
  ] loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t, t);
  end loop;
end$$;
