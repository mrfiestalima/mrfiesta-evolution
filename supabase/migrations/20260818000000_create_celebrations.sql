create extension if not exists pgcrypto;

create table if not exists public.celebrations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  child_name text not null,
  age integer,
  title text not null,
  event_date date,
  district text,
  venue text,
  theme text,
  short_description text,
  long_description text,
  cover_url text,
  trailer_url text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  celebration_id uuid not null references public.celebrations(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  url text not null,
  thumbnail_url text,
  alt text,
  width integer,
  height integer,
  duration_seconds integer,
  sort_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists celebrations_published_idx on public.celebrations (published);
create index if not exists celebrations_event_date_idx on public.celebrations (event_date);
create index if not exists media_celebration_id_idx on public.media (celebration_id);
create index if not exists media_sort_order_idx on public.media (sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists celebrations_set_updated_at on public.celebrations;
create trigger celebrations_set_updated_at
before update on public.celebrations
for each row execute function public.set_updated_at();

alter table public.celebrations enable row level security;
alter table public.media enable row level security;

drop policy if exists "Published celebrations are publicly readable" on public.celebrations;
create policy "Published celebrations are publicly readable"
on public.celebrations for select to anon, authenticated
using (published = true);

drop policy if exists "Media for published celebrations is publicly readable" on public.media;
create policy "Media for published celebrations is publicly readable"
on public.media for select to anon, authenticated
using (exists (
  select 1 from public.celebrations
  where celebrations.id = media.celebration_id
    and celebrations.published = true
));
