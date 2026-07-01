
-- Roles
create type public.app_role as enum ('admin', 'advisor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles_select_self" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_all" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- LEADS
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text,
  investment_amount numeric default 0,
  goal text,
  message text,
  source text default 'website',
  status text not null default 'new', -- new | contacted | qualified | converted | lost
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.leads enable row level security;

create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

create policy "leads_public_insert" on public.leads for insert to anon, authenticated with check (true);
create policy "leads_admin_select" on public.leads for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));
create policy "leads_admin_update" on public.leads for update to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));
create policy "leads_admin_delete" on public.leads for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- CONSULTATIONS
create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null,
  topic text,
  mode text default 'video', -- video | phone | in_person
  message text,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);
alter table public.consultations enable row level security;

create policy "consultations_public_insert" on public.consultations for insert to anon, authenticated with check (true);
create policy "consultations_admin_all" on public.consultations for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

-- FOLLOW UPS
create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  due_date date not null,
  note text,
  completed boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.follow_ups enable row level security;
create policy "follow_ups_admin_all" on public.follow_ups for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

-- INVESTOR NOTES
create table public.investor_notes (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  content text not null,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.investor_notes enable row level security;
create policy "investor_notes_admin_all" on public.investor_notes for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

-- MEETINGS
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  investor_id uuid references auth.users(id) on delete set null,
  title text not null,
  scheduled_at timestamptz not null,
  duration_min integer not null default 30,
  mode text default 'video',
  link text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);
alter table public.meetings enable row level security;
create policy "meetings_admin_all" on public.meetings for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

-- NOTIFICATIONS
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind text not null default 'info',
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "notifications_own_select" on public.notifications for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "notifications_own_update" on public.notifications for update to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "notifications_admin_insert" on public.notifications for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'advisor'));

create index leads_status_idx on public.leads(status);
create index leads_created_idx on public.leads(created_at desc);
create index follow_ups_due_idx on public.follow_ups(due_date);
create index meetings_when_idx on public.meetings(scheduled_at);
