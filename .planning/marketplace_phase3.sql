-- Marketplace Phase 3: Supply Guide (admin-curated per-grade/subject item lists)
-- Run manually in Supabase SQL editor.

create table public.supply_guide_items (
  id bigint primary key generated always as identity,
  school_id bigint not null references public.schools(id) on delete cascade,
  grade int not null,
  subject text,
  item_name text not null,
  product_code text, -- short code sellers can enter to link a listing, e.g. "ENG10-GRAM"
  isbn text,
  edition text,
  publisher text,
  brand text,
  avg_price numeric(10,2),
  retailers jsonb not null default '[]', -- [{ "name": "Takealot", "url": "..." }, ...]
  created_at timestamptz not null default now()
);

create index idx_supply_guide_items_school_grade on public.supply_guide_items(school_id, grade);
create unique index idx_supply_guide_items_code on public.supply_guide_items(school_id, product_code) where product_code is not null;

alter table public.supply_guide_items enable row level security;
-- No policies — accessed exclusively via supabaseAdmin (service role).

-- Formal link from a marketplace listing to a supply guide item (Phase 1
-- created marketplace_listings.supply_guide_item_id as a plain bigint column
-- with no FK yet, since this table didn't exist at the time). Add the FK now:
alter table public.marketplace_listings
  add constraint marketplace_listings_supply_guide_item_id_fkey
  foreign key (supply_guide_item_id) references public.supply_guide_items(id) on delete set null;

-- Per-student "I already have this" removals, drives the Supply Guide
-- shopping-list view (remove subjects/items the student already owns).
create table public.student_supply_removals (
  id bigint primary key generated always as identity,
  student_id bigint not null references public.students(id) on delete cascade,
  supply_guide_item_id bigint not null references public.supply_guide_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, supply_guide_item_id)
);

create index idx_student_supply_removals_student on public.student_supply_removals(student_id);

alter table public.student_supply_removals enable row level security;
-- No policies — accessed exclusively via supabaseAdmin (service role).
