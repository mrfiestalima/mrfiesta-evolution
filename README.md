# MR Fiesta Evolution

Web comercial de MR Fiesta y administrador de contenidos, con React, TypeScript y Vite. GitHub Pages sirve la web, Supabase guarda el contenido y controla el acceso, Cloudflare R2 almacena fotos y videos.

## Desarrollo

```powershell
npm ci
# Copiar .env.example a .env.local y configurar las variables públicas existentes.
npm run dev
```

Web: `http://127.0.0.1:5173/mrfiesta-evolution/`
Panel: `http://127.0.0.1:5173/mrfiesta-evolution/admin/`

El panel requiere un usuario autenticado incluido en `admin_users`. La ruta `admin/?demo` solo existe en desarrollo: permite probar el editor y la vista previa, sin subir, guardar ni publicar.

## Administrar la web

En **Contenido de la web** se pueden editar portada, experiencias, precios, duración, etiquetas, tecnología, Live, textos comerciales, ventajas, preguntas frecuentes, WhatsApp y redes. Las secciones se pueden ocultar; experiencias y tecnologías se pueden agregar, ocultar y ordenar.

La **Biblioteca** permite subir fotos/videos a R2 y reutilizar archivos de celebraciones existentes. Cada sección tiene un selector de archivo. Quitar un archivo de una sección no lo borra de R2. Los archivos tienen URL pública, incluso antes de asignarlos a una sección publicada.

1. Editar contenido o elegir archivos.
2. **Guardar borrador** conserva los cambios sin alterar la página pública.
3. **Previsualizar** abre una vista local de la edición, válida durante una hora en el mismo navegador. No es un enlace público compartible.
4. **Publicar cambios** abre una confirmación; al confirmar se guarda el borrador y se actualiza la versión pública. Los visitantes la reciben en la siguiente apertura o recarga, sin recompilar.

Los cambios concurrentes en otra sesión producen un conflicto explícito, no una sobrescritura silenciosa. Si falla la publicación después de guardar el borrador, este queda conservado para reintentar.

Las celebraciones siguen disponibles en su propia área. Los controles multimedia no envían accidentalmente el formulario; crear una celebración habilita inmediatamente la subida.

## Instalación del backend

Consultar [docs/ADMIN_SITE.md](docs/ADMIN_SITE.md). Se requieren las migraciones existentes de celebraciones/admin y las nuevas de contenido, además de la función `site-media`. Reutiliza las mismas credenciales R2 de `r2-media`. Las claves privadas nunca se incluyen en variables `VITE_*`.

## Validación

```powershell
npm test
npm run lint
npm run build
```

`supabase/tests/site_content_access.sql` comprueba permisos de visitante, usuario no administrador, administrador y conflictos de versiones; usa una transacción que termina en rollback. Ejecutar con un rol autorizado para SET ROLE.

GitHub Actions instala, prueba, valida, compila y despliega `dist` al publicar cambios en `main`.

## Cotización y contenido

`#cotizar` prepara un mensaje con experiencia, fecha, distrito, edad e invitados. El visitante revisa y envía en WhatsApp. La web no almacena esos datos. Todos los botones usan el número publicado desde el panel.

Sin configuración o contenido publicado válido, la web usa `src/data/siteContent.ts`. Se mantienen los cuatro precios originales de la web; no se sincronizan automáticamente con el CRM local. Confirmar el tarifario comercial antes de modificarlo.

La galería muestra celebraciones publicadas, sin presentar los mocks como eventos reales. `public/sitemap.xml` contiene la URL canónica; un robots.txt bajo la subruta del proyecto no controla el dominio.
