alter table public.celebrations add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.celebrations add constraint celebrations_details_object check (jsonb_typeof(details) = 'object' and octet_length(details::text) <= 32768);
comment on column public.celebrations.details is 'Optional Evolution 2 case-study and SEO fields; existing celebration RLS applies.';
