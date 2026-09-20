-- Run in a SQL session with permission to SET ROLE. All writes are rolled back.
begin;
set local role anon;
do $$ begin
  if (select count(*) from public.site_documents where kind = 'draft') <> 0 then raise exception 'Anonymous draft leak'; end if;
  if (select count(*) from public.site_documents where kind = 'published') <> 1 then raise exception 'Published content unavailable'; end if;
  if has_table_privilege(current_user, 'public.site_documents', 'UPDATE') then raise exception 'Anonymous write grant'; end if;
  if has_table_privilege(current_user, 'public.site_assets', 'SELECT') then raise exception 'Anonymous library access'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.site_documents where kind = 'draft') <> 0 then raise exception 'Non-admin draft leak'; end if;
  if (select count(*) from public.site_assets) <> 0 then raise exception 'Non-admin library leak'; end if;
  begin
    perform * from public.save_site_document('draft','{"version":1}'::jsonb,0);
    raise exception 'Non-admin saved content';
  exception when others then
    if sqlerrm <> 'ADMIN_REQUIRED' then raise; end if;
  end;
end $$;
reset role;
do $$ begin
  perform set_config('request.jwt.claim.sub',(select user_id::text from public.admin_users limit 1),true);
end $$;
set local role authenticated;
do $$ declare previous_revision integer; begin
  select revision into previous_revision from public.site_documents where kind='draft';
  if previous_revision is null then raise exception 'Admin cannot read draft'; end if;
  perform * from public.save_site_document('draft','{"version":1,"test":"rollback-only"}'::jsonb,previous_revision);
  begin
    perform * from public.save_site_document('draft','{"version":1}'::jsonb,previous_revision);
    raise exception 'Stale edit overwrote draft';
  exception when others then
    if sqlerrm <> 'CONTENT_CONFLICT' then raise; end if;
  end;
end $$;
rollback;
select 'site_content_access: PASS' as result;
