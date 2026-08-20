# Admin V1 — Auth + Celebration Publishing

## Arquitectura

El panel es un entry point separado generado en `admin/index.html`. En GitHub Pages se abre directamente en `/mrfiesta-evolution/admin/`, sin convertir la Home en una SPA con nuevas rutas.

La UI vive en `src/admin/`; las consultas administrativas están en `src/data/adminCelebrationsRepository.ts`. El panel no sube archivos: la zona de media queda preparada para el siguiente ticket de R2.

## Auth y permisos

El acceso usa Supabase Auth con email y contraseña. No hay registro público ni OAuth. Tras iniciar sesión, el panel consulta `admin_users`; autenticarse no es suficiente para entrar.

La migración activa RLS en `admin_users`, `celebrations` y `media`. Solo usuarios cuyo `auth.uid()` exista en `admin_users` pueden listar todo, crear, editar, publicar, despublicar o gestionar metadata de media. No se implementa eliminación definitiva.

## Crear el primer administrador

1. En Supabase abre **Authentication → Users → Add user**.
2. Crea el usuario con email y contraseña.
3. Copia su UUID.
4. Abre **SQL Editor** y reemplaza `REEMPLAZAR-CON-UUID` en `supabase/grant_admin_example.sql`.
5. Ejecuta ese `INSERT`.

Nunca guardes el email, contraseña, UUID real ni claves privadas en Git.

## Migración

Ejecuta manualmente `supabase/migrations/20260819000000_add_admin_auth_and_policies.sql` después de la migración inicial de celebraciones. No se ejecuta automáticamente desde la aplicación.

## Flujo

Entra a `/mrfiesta-evolution/admin/`, inicia sesión, crea una celebración y usa **GUARDAR BORRADOR** o **PUBLICAR CELEBRACIÓN**. Publicar cambia `published` a `true` y la Home pública la obtiene en su siguiente consulta sin rebuild. **PASAR A BORRADOR** vuelve a `published = false`; no existe botón de borrado definitivo.
