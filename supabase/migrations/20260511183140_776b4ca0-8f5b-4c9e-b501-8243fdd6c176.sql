
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  pan text,
  risk_profile text default 'moderate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Mutual Funds (public catalog)
create table public.mutual_funds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  amc text,
  nav numeric(12,4) not null default 0,
  return_1y numeric(6,2) default 0,
  return_3y numeric(6,2) default 0,
  return_5y numeric(6,2) default 0,
  risk_level text default 'moderate',
  expense_ratio numeric(5,2) default 0,
  aum_crore numeric(12,2) default 0,
  created_at timestamptz not null default now()
);
alter table public.mutual_funds enable row level security;
create policy "funds_public_read" on public.mutual_funds for select using (true);

-- Portfolios (holdings)
create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_id uuid not null references public.mutual_funds(id) on delete cascade,
  units numeric(14,4) not null default 0,
  invested_amount numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolios enable row level security;
create policy "portfolios_own_all" on public.portfolios for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SIPs
create table public.sips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_id uuid not null references public.mutual_funds(id) on delete cascade,
  amount numeric(12,2) not null,
  frequency text not null default 'monthly',
  status text not null default 'active',
  next_date date,
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);
alter table public.sips enable row level security;
create policy "sips_own_all" on public.sips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_id uuid not null references public.mutual_funds(id) on delete cascade,
  type text not null,
  amount numeric(14,2) not null,
  units numeric(14,4) not null default 0,
  nav numeric(12,4) not null default 0,
  txn_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
create policy "transactions_own_all" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
