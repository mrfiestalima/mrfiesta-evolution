create table public.site_documents (
  kind text primary key check (kind in ('draft', 'published')),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 262144),
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);
insert into public.site_documents(kind) values ('draft'), ('published');
alter table public.site_documents enable row level security;
revoke all on public.site_documents from anon, authenticated;
grant select on public.site_documents to anon, authenticated;
grant update on public.site_documents to authenticated;
create policy "Published site is readable" on public.site_documents for select to anon, authenticated using (kind = 'published');
create policy "Admins read site drafts" on public.site_documents for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins edit site documents" on public.site_documents for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create table public.site_assets (
  id uuid primary key,
  object_key text unique not null,
  url text not null,
  name text not null,
  type text not null check (type in ('image','video')),
  content_type text not null,
  size bigint not null check (size > 0 and size <= 524288000),
  ready boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.site_assets enable row level security;
revoke all on public.site_assets from anon, authenticated;
grant select, insert, update on public.site_assets to authenticated;
create policy "Admins read site assets" on public.site_assets for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins insert site assets" on public.site_assets for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins update site assets" on public.site_assets for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create function public.save_site_document(target_kind text, payload jsonb, expected_revision integer)
returns setof public.site_documents language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (select 1 from public.admin_users where user_id = (select auth.uid())) then
    raise exception 'ADMIN_REQUIRED';
  end if;
  if target_kind not in ('draft', 'published') or payload->>'version' is distinct from '1' then
    raise exception 'INVALID_CONTENT';
  end if;
  return query update public.site_documents set content = payload, revision = revision + 1, updated_at = now()
    where kind = target_kind and revision = expected_revision returning *;
  if not found then raise exception 'CONTENT_CONFLICT'; end if;
end;
$$;
revoke all on function public.save_site_document(text,jsonb,integer) from public, anon;
grant execute on function public.save_site_document(text,jsonb,integer) to authenticated;
