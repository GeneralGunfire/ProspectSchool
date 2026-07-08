-- Marketplace Phase 2: Wanted section
-- Run manually in Supabase SQL editor.

create table public.marketplace_wanted (
  id bigint primary key generated always as identity,
  school_id bigint not null references public.schools(id) on delete cascade,
  requester_type text not null check (requester_type in ('student', 'teacher', 'admin')),
  requester_id bigint not null,
  title text not null,
  subject text,
  grade int,
  budget numeric(10,2),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index idx_marketplace_wanted_school on public.marketplace_wanted(school_id, status);

alter table public.marketplace_wanted enable row level security;
-- No policies — accessed exclusively via supabaseAdmin (service role), same as
-- marketplace_listings / marketplace_interests.
