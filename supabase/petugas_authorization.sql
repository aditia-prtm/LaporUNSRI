-- Petugas workspace authorization and atomic status updates.
-- Run this in the Supabase SQL Editor after confirming the existing tables:
-- public.profiles(id, role), public.reports(id, status),
-- public.report_comments(report_id, user_id, message, photo_url).

alter table public.reports enable row level security;
alter table public.report_comments enable row level security;

drop policy if exists "authenticated users read reports" on public.reports;
create policy "authenticated users read reports"
on public.reports
for select
to authenticated
using (true);

drop policy if exists "authenticated users read report comments" on public.report_comments;
create policy "authenticated users read report comments"
on public.report_comments
for select
to authenticated
using (true);

drop policy if exists "petugas can update report status" on public.reports;
create policy "petugas can update report status"
on public.reports
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role::text in ('petugas', 'admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role::text in ('petugas', 'admin')
  )
);

drop policy if exists "authenticated users insert own report comments" on public.report_comments;
create policy "authenticated users insert own report comments"
on public.report_comments
for insert
to authenticated
with check (user_id = (select auth.uid()));

create or replace function public.prevent_unstaffed_report_status_change()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  actor_role text;
begin
  if new.status is distinct from old.status then
    select p.role::text into actor_role
    from public.profiles p
    where p.id = (select auth.uid());

    if actor_role not in ('petugas', 'admin') or actor_role is null then
      raise exception 'Only petugas or admin can change a report status';
    end if;

    if actor_role = 'petugas'
      and (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status') then
      raise exception 'Petugas may only change the report status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_report_status_authorization on public.reports;
create trigger enforce_report_status_authorization
before update of status on public.reports
for each row execute function public.prevent_unstaffed_report_status_change();

create or replace function public.petugas_update_report_status(
  p_report_id uuid,
  p_status text,
  p_message text,
  p_photo_url text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_role text;
  status_type text;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select p.role::text into actor_role
  from public.profiles p
  where p.id = (select auth.uid());

  if actor_role not in ('petugas', 'admin') or actor_role is null then
    raise exception 'Only petugas or admin can change a report status';
  end if;

  if p_status not in ('belum_diproses', 'diproses', 'selesai') then
    raise exception 'Invalid report status';
  end if;
  if nullif(trim(p_message), '') is null or nullif(trim(p_photo_url), '') is null then
    raise exception 'A follow-up note and evidence photo are required';
  end if;

  select format_type(a.atttypid, a.atttypmod) into status_type
  from pg_attribute a
  where a.attrelid = 'public.reports'::regclass
    and a.attname = 'status'
    and not a.attisdropped;
  if status_type is null then
    raise exception 'Report status column was not found';
  end if;

  execute format('update public.reports set status = $1::%s where id = $2', status_type)
  using p_status, p_report_id;
  if not found then
    raise exception 'Report not found or access denied';
  end if;

  insert into public.report_comments (report_id, user_id, message, photo_url)
  values (p_report_id, (select auth.uid()), trim(p_message), trim(p_photo_url));
end;
$$;

revoke all on function public.petugas_update_report_status(uuid, text, text, text) from public, anon;
grant execute on function public.petugas_update_report_status(uuid, text, text, text) to authenticated;
