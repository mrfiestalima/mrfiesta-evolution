# Supabase Foundation — Celebrations V1

## Qué contiene

- `celebrations`: información editorial de cada celebración.
- `media`: URLs y metadatos de imágenes/videos alojados en Cloudflare R2.
- Una celebración puede tener muchos registros de media; al eliminarla, su media se elimina en cascada.

## Seguridad

RLS está activado en ambas tablas. Visitantes anónimos solo pueden leer celebraciones con `published = true` y media asociada a celebraciones publicadas. No existen políticas públicas de escritura.

## Variables

En `.env.local` agrega:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

No uses `service_role`, contraseñas ni claves privadas en el frontend. `.env.local` está excluido de Git.

## Migración y demo

Ejecuta `supabase/migrations/20260818000000_create_celebrations.sql` en el SQL Editor de Supabase. El archivo `supabase/seed_demo.sql` es opcional y se ejecuta manualmente para insertar una celebración claramente marcada como demo; no se ejecuta automáticamente.

Para comprobar RLS, crea o modifica una celebración con `published = false` y consulta la Home con la publishable key: no debe aparecer. Al cambiarla a `true`, sí debe ser legible.

La Home conserva los mocks locales cuando Supabase no está configurado, está caído o devuelve un error.
