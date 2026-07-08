-- Marketplace Phase 1: listings, images, interests
-- Run manually in Supabase SQL editor. Also create a PRIVATE storage bucket
-- named "marketplace" via Storage dashboard (same as "past-papers").

create table public.marketplace_listings (
  id bigint primary key generated always as identity,
  school_id bigint not null references public.schools(id) on delete cascade,
  seller_type text not null check (seller_type in ('student', 'teacher', 'admin')),
  seller_id bigint not null,
  title text not null,
  description text,
  category text not null check (category in ('textbook', 'stationery', 'uniform', 'equipment', 'misc')),
  subject text,
  grade int,
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair')),
  price numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'sold')),
  supply_guide_item_id bigint, -- FK added in Phase 3 when supply_guide_items exists
  created_at timestamptz not null default now()
);

create index idx_marketplace_listings_school on public.marketplace_listings(school_id);
create index idx_marketplace_listings_status on public.marketplace_listings(school_id, status);

create table public.marketplace_listing_images (
  id bigint primary key generated always as identity,
  listing_id bigint not null references public.marketplace_listings(id) on delete cascade,
  storage_path text not null,
  position int not null default 0
);

create index idx_marketplace_images_listing on public.marketplace_listing_images(listing_id);

create table public.marketplace_interests (
  id bigint primary key generated always as identity,
  listing_id bigint not null references public.marketplace_listings(id) on delete cascade,
  user_type text not null check (user_type in ('student', 'teacher', 'admin')),
  user_id bigint not null,
  created_at timestamptz not null default now(),
  unique (listing_id, user_type, user_id)
);

create index idx_marketplace_interests_listing on public.marketplace_interests(listing_id);

-- RLS: app uses supabaseAdmin (service role) exclusively for all marketplace
-- reads/writes, same pattern as past_papers/resources. Enable RLS with no
-- public policies so the anon key cannot touch these tables directly.
alter table public.marketplace_listings enable row level security;
alter table public.marketplace_listing_images enable row level security;
alter table public.marketplace_interests enable row level security;
