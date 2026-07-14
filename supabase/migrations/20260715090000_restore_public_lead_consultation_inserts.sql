alter table public.leads enable row level security;
alter table public.consultations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'leads_public_insert'
  ) then
    create policy "leads_public_insert"
      on public.leads
      for insert
      to anon, authenticated
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'consultations'
      and policyname = 'consultations_public_insert'
  ) then
    create policy "consultations_public_insert"
      on public.consultations
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;
