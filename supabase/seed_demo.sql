insert into public.celebrations (slug, child_name, age, title, district, theme, short_description, published, featured)
values ('demo-neon', 'Demo', 10, 'Una noche llena de luz', 'Lima', 'Neón', 'Celebración demo para validar la conexión de contenido.', true, false)
on conflict (slug) do nothing;
