-- ===========================================================================
-- Maidenhead Spice — Row Level Security (run after 0001_init.sql)
--
-- Model: all WRITES and all ADMIN reads go through the server using the
-- service-role key (which bypasses RLS entirely). Therefore the only policies
-- we add are PUBLIC READ policies for the data the website shows to visitors.
-- Everything else stays locked to anon/authenticated by default.
-- ===========================================================================

-- Enable RLS on every table.
alter table public.menu_categories  enable row level security;
alter table public.dishes           enable row level security;
alter table public.dish_variants    enable row level security;
alter table public.modifier_groups  enable row level security;
alter table public.modifier_options enable row level security;
alter table public.reservations     enable row level security;
alter table public.orders           enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.recipes          enable row level security;
alter table public.contact_messages enable row level security;

-- --- Public read: menu ------------------------------------------------------
drop policy if exists "public read categories" on public.menu_categories;
create policy "public read categories" on public.menu_categories
  for select using (true);

drop policy if exists "public read available dishes" on public.dishes;
create policy "public read available dishes" on public.dishes
  for select using (available = true);

drop policy if exists "public read variants" on public.dish_variants;
create policy "public read variants" on public.dish_variants
  for select using (
    exists (select 1 from public.dishes d where d.id = dish_id and d.available = true)
  );

drop policy if exists "public read modifier groups" on public.modifier_groups;
create policy "public read modifier groups" on public.modifier_groups
  for select using (
    exists (select 1 from public.dishes d where d.id = dish_id and d.available = true)
  );

drop policy if exists "public read modifier options" on public.modifier_options;
create policy "public read modifier options" on public.modifier_options
  for select using (
    exists (
      select 1
      from public.modifier_groups g
      join public.dishes d on d.id = g.dish_id
      where g.id = group_id and d.available = true
    )
  );

-- --- Public read: published content ----------------------------------------
drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts
  for select using (status = 'published');

drop policy if exists "public read published recipes" on public.recipes;
create policy "public read published recipes" on public.recipes
  for select using (status = 'published');

-- reservations / orders / contact_messages: no anon policies.
-- They are written server-side via the service-role client and never read by
-- the public, so RLS denies all anon access by default — which is what we want.

-- ===========================================================================
-- Storage bucket for blog/recipe cover images (public read).
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
