# Integración multimedia con Cloudflare R2

## Variable de entorno

La aplicación lee `VITE_MEDIA_BASE_URL` desde el entorno de build. Copia `.env.example` como `.env.local` y reemplaza únicamente el valor:

```env
VITE_MEDIA_BASE_URL=https://TU-DOMINIO-PUBLICO.r2.dev
```

No coloques Access Key ID, Secret Access Key, API Token ni ningún secreto en esta variable o en el frontend. Si la variable no existe, la aplicación conserva el fallback visual del hero.

## Convención de carpetas

Los archivos públicos viven bajo estas carpetas:

```text
hero/
experiences/
technology/
live/
events/
posters/
thumbnails/
```

El primer archivo para subir es `hero/evolution.mp4`. Opcionalmente puedes subir `hero/evolution-poster.webp` para usarlo como poster mientras el video carga.

## Media manifest

`src/data/media.ts` es la única fuente de rutas multimedia de la Home. Cada entrada conserva la ruta lógica y una URL resuelta por `src/lib/media.ts`. Para añadir un asset, agrega una entrada tipada allí y consúmela desde un componente; no concatene URLs dentro de la UI.

## Componente de video

`src/components/MediaVideo.tsx` encapsula `poster`, `autoPlay`, `muted`, `loop`, `playsInline`, `preload` y el fallback. El hero usa `preload="metadata"`, reproducción automática silenciosa y fallback cuando no hay URL configurada o el recurso devuelve error.

## Cómo añadir una imagen

1. Sube el archivo a una carpeta pública de R2, por ejemplo `technology/led-floor.webp`.
2. Añade la ruta al manifest.
3. Usa `mediaUrl()` para resolverla; nunca hardcodees el hostname de R2 en un componente.

## Cambiar de `r2.dev` a un dominio propio

No requiere cambios de componentes. Cambia el valor de `VITE_MEDIA_BASE_URL` en `.env.local` y en los secretos/variables del entorno de build de GitHub Actions por el dominio público, por ejemplo `https://media.mrfiesta.pe`. Mantén las mismas rutas de carpetas.
