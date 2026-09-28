-- Library media survives deletion of its celebration; public RLS still requires
-- a published parent, while admins can see unassigned library files.
alter table public.media alter column celebration_id drop not null;
alter table public.media drop constraint media_celebration_id_fkey;
alter table public.media add constraint media_celebration_id_fkey
  foreign key (celebration_id) references public.celebrations(id) on delete set null;

create function public.delete_celebration_keep_media(target_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare item public.celebrations;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean, false)
    or not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;
  select * into item from public.celebrations where id = target_id for update;
  if not found then raise exception 'CELEBRATION_NOT_FOUND'; end if;
  -- Preserve cover/trailer links even when the old gallery rows were removed.
  insert into public.media(celebration_id,type,url,alt)
  select item.id, asset.kind, asset.url, item.title || ' · ' || asset.label
  from (values ('image', item.cover_url, 'Portada'), ('video', item.trailer_url, 'Video')) asset(kind,url,label)
  where nullif(asset.url,'') is not null
    and not exists (select 1 from public.media m where m.celebration_id=item.id and m.url=asset.url);
  delete from public.celebrations where id=target_id;
end;
$$;
revoke all on function public.delete_celebration_keep_media(uuid) from public, anon;
grant execute on function public.delete_celebration_keep_media(uuid) to authenticated;

create function public.detach_celebration_media(target_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare item public.media;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    or not exists (select 1 from public.admin_users where user_id=auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;
  select * into item from public.media where id=target_id for update;
  if not found then raise exception 'MEDIA_NOT_FOUND'; end if;
  update public.celebrations set
    cover_url=case when cover_url=item.url then null else cover_url end,
    trailer_url=case when trailer_url=item.url then null else trailer_url end
  where id=item.celebration_id;
  update public.media set celebration_id=null where id=target_id;
end;
$$;
revoke all on function public.detach_celebration_media(uuid) from public, anon;
grant execute on function public.detach_celebration_media(uuid) to authenticated;

grant delete on public.site_assets to authenticated;
create policy "Admins delete site assets" on public.site_assets for delete to authenticated
using (coalesce((select auth.jwt()->>'is_anonymous')::boolean,false)=false
  and exists (select 1 from public.admin_users where user_id=(select auth.uid())));

-- Make the existing introductory video a real library item rather than an
-- undeletable item injected into every library response by the frontend.
insert into public.media(celebration_id,type,url,alt)
select null,'video','https://pub-a49268cb19b0442e8336f8bbe0492fbd.r2.dev/hero/evolution.mp4','Video de inicio'
where not exists (select 1 from public.media where url='https://pub-a49268cb19b0442e8336f8bbe0492fbd.r2.dev/hero/evolution.mp4');
