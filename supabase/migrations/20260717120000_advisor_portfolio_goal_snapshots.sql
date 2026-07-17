-- Professional advisor portfolio extensions.
-- These tables replace dashboard mock data for goal planning and portfolio history.

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default 'target',
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null default 0,
  monthly_sip numeric(12,2) not null default 0,
  target_year integer not null,
  status text not null default 'on_track',
  color text not null default '#1E5BAF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

drop policy if exists "goals_own_all" on public.goals;
create policy "goals_own_all" on public.goals
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists goals_touch on public.goals;
create trigger goals_touch before update on public.goals
  for each row execute function public.touch_updated_at();

create index if not exists goals_user_idx on public.goals(user_id);
create index if not exists goals_target_year_idx on public.goals(user_id, target_year);

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  snapshot_date date not null,
  invested_amount numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  xirr numeric(6,2),
  created_at timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

alter table public.portfolio_snapshots enable row level security;

drop policy if exists "portfolio_snapshots_own_all" on public.portfolio_snapshots;
create policy "portfolio_snapshots_own_all" on public.portfolio_snapshots
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists portfolio_snapshots_user_date_idx
  on public.portfolio_snapshots(user_id, snapshot_date desc);

create table if not exists public.market_news_cache (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  title text not null,
  source text,
  url text,
  image_url text,
  summary text,
  published_at timestamptz,
  region text not null default 'IN',
  topic text not null default 'mutual_funds',
  created_at timestamptz not null default now()
);

alter table public.market_news_cache enable row level security;

drop policy if exists "market_news_public_read" on public.market_news_cache;
create policy "market_news_public_read" on public.market_news_cache
  for select using (true);

drop policy if exists "market_news_admin_all" on public.market_news_cache;
create policy "market_news_admin_all" on public.market_news_cache
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

create index if not exists market_news_cache_topic_date_idx
  on public.market_news_cache(topic, region, published_at desc nulls last);
