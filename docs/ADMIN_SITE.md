# Administrador de contenido de toda la web

## Arquitectura

- `site_documents`: dos filas, `draft` y `published`, con documento JSON validado y revisión entera.
- `save_site_document`: función SECURITY INVOKER con revisión esperada; no evita RLS. Un conflicto devuelve CONTENT_CONFLICT.
- `site_assets`: catálogo administrativo de subidas nuevas. La función verifica el archivo en R2 con HEAD antes de marcarlo como disponible.
- `site-media`: Edge Function autenticada que comprueba membresía en admin_users, emite PUT temporal, registra el intento y verifica tamaño y Content-Type al finalizar.
- La biblioteca también permite reutilizar archivos de la tabla media y el video de inicio heredado. El panel bloquea el borrado de archivos de celebraciones referenciados en documentos guardados.

La autorización depende de admin_users, no de metadatos editables por el usuario. El público solo lee published; borradores y catálogo de archivos son exclusivos de administradores no anónimos. No se cambiaron las tablas de Live, invitados, canciones ni CRM.

## Instalación

Aplicar en orden las migraciones existentes y las migraciones `site_content_manager` y `restrict_anonymous_site_admin`. Desplegar `supabase/functions/site-media/index.ts` como `site-media`, con verificación JWT activa. Reutiliza estos secretos del proyecto:

- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME
- R2_PUBLIC_BASE_URL

El bucket requiere CORS para PUT desde los orígenes de la web y localhost documentados en R2_CORS_POLICY.json. El frontend necesita VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY y VITE_MEDIA_BASE_URL. La configuración actual del repositorio apunta a mrfiesta-live; no se utiliza el proyecto inactivo mrfiesta-media.

## Operación y límites

Imágenes JPEG/PNG/WebP hasta 20 MB, videos MP4/WebM hasta 500 MB. Una subida por vez con progreso. No convierte HEIC/MOV ni transcodifica videos. R2 almacena y entrega los archivos originales. Los archivos son accesibles mediante su URL pública aunque todavía no estén asignados a una página publicada.

Un archivo que falla en la verificación queda pendiente y no aparece en la biblioteca. No existe eliminación automática de objetos pendientes ni borrado físico de archivos desde la biblioteca general. Quitar de una sección conserva el archivo para reutilizarlo.

La vista previa guarda un documento temporal en localStorage bajo un identificador aleatorio; solo funciona en ese navegador/origen y expira tras una hora. No elude permisos de Supabase ni cambia la versión publicada.

## Verificación realizada

- Seis pruebas automáticas de validación de contenido, enlaces, teléfonos, IDs y aislamiento de borradores.
- SQL con rollback: visitante solo lee published, no accede a biblioteca ni escribe; usuario no administrador no accede a drafts ni guarda; administrador guarda y una revisión obsoleta es rechazada.
- Subida real de `mrfiesta-prueba-conexion-r2.png`, archivo técnico de 1 píxel, visible en la biblioteca pero no asignado a la versión pública.
- Borrador editado, guardado y recuperado después de recargar. Título original restaurado y guardado.
- Vista previa con título editado, secciones ocultas y número de contacto de prueba. Sin anclas rotas ni publicación de los valores de prueba.
- Revisión del administrador a 390 px, TypeScript y build de producción.

Los asesores de Supabase no reportaron hallazgos para las tablas y función nuevas. Existen avisos anteriores del proyecto Live (funciones SECURITY DEFINER accesibles, search_path de set_updated_at y configuración Auth); no se modificaron dentro de esta entrega. Referencia: https://supabase.com/docs/guides/database/database-linter
