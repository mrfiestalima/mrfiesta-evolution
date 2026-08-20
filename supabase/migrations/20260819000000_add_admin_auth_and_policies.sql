create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can verify their own membership" on public.admin_users;
create policy "Admins can verify their own membership"
on public.admin_users for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can read all celebrations" on public.celebrations;
create policy "Admins can read all celebrations"
on public.celebrations for select to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can create celebrations" on public.celebrations;
create policy "Admins can create celebrations"
on public.celebrations for insert to authenticated
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can update celebrations" on public.celebrations;
create policy "Admins can update celebrations"
on public.celebrations for update to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can delete celebrations" on public.celebrations;
create policy "Admins can delete celebrations"
on public.celebrations for delete to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can read all media" on public.media;
create policy "Admins can read all media"
on public.media for select to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can create media" on public.media;
create policy "Admins can create media"
on public.media for insert to authenticated
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can update media" on public.media;
create policy "Admins can update media"
on public.media for update to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can delete media" on public.media;
create policy "Admins can delete media"
on public.media for delete to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
