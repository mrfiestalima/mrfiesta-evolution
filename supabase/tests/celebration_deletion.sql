begin;
-- All fixtures and deletions are rolled back. No real celebration is changed.
select set_config('request.jwt.claims', json_build_object('sub',(select user_id from public.admin_users limit 1),'role','authenticated','is_anonymous',false)::text,true);
set local role authenticated;
do $$
declare c uuid; m uuid;
begin
  insert into public.celebrations(slug,child_name,title,published,cover_url,trailer_url)
    values ('delete-test-'||gen_random_uuid(),'Test','Deletion test',true,'https://example.invalid/cover.jpg','https://example.invalid/trailer.mp4') returning id into c;
  insert into public.media(celebration_id,type,url,alt) values(c,'image','https://example.invalid/cover.jpg','Test') returning id into m;
  perform public.detach_celebration_media(m);
  if exists(select 1 from public.celebrations where id=c and cover_url is not null) then raise exception 'Cover reference remains'; end if;
  if not exists(select 1 from public.media where id=m and celebration_id is null) then raise exception 'Detached media lost'; end if;
  perform public.delete_celebration_keep_media(c);
  if exists(select 1 from public.celebrations where id=c) then raise exception 'Celebration remains'; end if;
  if not exists(select 1 from public.media where url='https://example.invalid/trailer.mp4' and celebration_id is null) then raise exception 'Trailer not preserved'; end if;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","is_anonymous":false}',true);
set local role authenticated;
do $$
begin
  begin
    perform public.delete_celebration_keep_media(gen_random_uuid());
    raise exception 'Unexpected non-admin access';
  exception when raise_exception then
    if sqlerrm <> 'ADMIN_REQUIRED' then raise; end if;
  end;
end $$;
reset role;
set local role anon;
do $$
begin
  if exists(select 1 from public.media where celebration_id is null) then raise exception 'Public orphan media visibility'; end if;
end $$;
rollback;
