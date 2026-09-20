alter policy "Admins read site drafts" on public.site_documents
using (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
;
alter policy "Admins edit site documents" on public.site_documents
using (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
;
alter policy "Admins read site assets" on public.site_assets
using (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
;
alter policy "Admins insert site assets" on public.site_assets
with check (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
;
alter policy "Admins update site assets" on public.site_assets
using (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (coalesce((select auth.jwt()->>'is_anonymous')::boolean, false) = false and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
;
