# Admin Media V1 — Secure Cloudflare R2 Upload

## Arquitectura

El panel solicita una URL presignada a `supabase/functions/r2-media`. La Edge Function valida el JWT y comprueba `admin_users` antes de generar una URL PUT de cinco minutos. El navegador sube el archivo directamente a R2 y luego guarda únicamente la URL pública y metadata en `media` de Supabase.

No se usa Supabase Storage y ninguna credencial R2 entra al frontend.

## Secrets de la Edge Function

Configura como secrets de Supabase:

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME=mrfiesta-evolution-public
R2_PUBLIC_BASE_URL=https://pub-a49268cb19b0442e8336f8bbe0492fbd.r2.dev
```

El archivo `supabase/functions/.env.example` solo documenta nombres y no contiene valores reales.

## CORS

Aplica `docs/R2_CORS_POLICY.json` en Cloudflare Dashboard → R2 → bucket `mrfiesta-evolution-public` → Settings → CORS Policy. Incluye los tres orígenes permitidos, PUT/HEAD, headers de la subida y exposición de ETag.

## Token R2

En Cloudflare Dashboard → R2 → Overview → Manage R2 API Tokens → Create API token, crea un token con permisos **Object Read & Write** limitado únicamente al bucket `mrfiesta-evolution-public`. Copia Access Key ID y Secret Access Key una sola vez y guárdalos como secrets de la Edge Function; nunca en `.env.local` versionado ni en React.

## Flujo y límites

Se aceptan JPEG, PNG, WebP y MP4. Imágenes: 20 MB. Video: 500 MB; sobre 150 MB se muestra una advertencia. La subida usa XMLHttpRequest para progreso real y máximo tres archivos simultáneos. Si la inserción de metadata falla, se intenta limpiar el objeto mediante la misma Edge Function.

## Portada, trailer y orden

Desde la galería se puede marcar una imagen como portada, un video como trailer y mover media con ↑/↓. No se crean thumbnails automáticos ni se implementa uploader de R2 para otros usos.

## Deploy y troubleshooting

Desde el directorio del proyecto, con Supabase CLI autenticado:

```bash
supabase functions deploy r2-media
```

Si la función devuelve 401/403, revisa sesión Auth y que el UUID esté en `admin_users`. Si devuelve error de R2, revisa los secrets y CORS. La subida no inserta un registro en `media` si R2 falla.
