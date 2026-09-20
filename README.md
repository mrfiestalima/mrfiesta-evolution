# MR Fiesta Evolution

Web comercial de MR Fiesta: Entertainment × Technology para celebraciones en Lima.

## Desarrollo

```bash
npm install
npm run dev
```

## Calidad y build

```bash
npm run lint
npm run build
```

Vite está configurado con `base: '/mrfiesta-evolution/'` para GitHub Pages. El workflow en `.github/workflows/deploy.yml` instala, valida, compila y publica `dist` al hacer push a `main`.

## Contenido

Los media frames son placeholders CSS intencionalmente reemplazables: no se usan fotos de stock para representar eventos de MR Fiesta. El helper de WhatsApp está centralizado en `src/lib/whatsapp.ts`.


## Cotización comercial

La sección `#cotizar` prepara un enlace de WhatsApp con experiencia, fecha, distrito, edad, invitados y detalles. El visitante revisa el mensaje en WhatsApp y decide enviarlo. No se almacenan datos del formulario. El número se administra en `src/lib/whatsapp.ts`.

La galería pública muestra únicamente celebraciones devueltas por el repositorio de publicaciones. Cuando no hay contenido disponible, ofrece una consulta de referencias por WhatsApp; no publica los mocks locales como eventos reales. Las redes sociales deben añadirse únicamente con sus URLs oficiales confirmadas.

## Revisión comercial — septiembre de 2026

- Comprobados: TypeScript, build de producción, formulario con valores opcionales, enlace codificado de WhatsApp, invalidación del mensaje al editar campos, menú móvil y Escape, anclas internas y anchos de 390/1440 px.
- Se conservan los cuatro precios de la web original. El CRM local tiene un catálogo diferente: confirmar el tarifario comercial antes de cambiar importes.
- Para completar la galería se necesitan fotos/videos propios y celebraciones publicadas en el backend configurado. La versión local funciona sin credenciales, mostrando un estado alternativo honesto.
- El panel administrativo y las subidas a R2 están fuera de esta revisión comercial; no se validó acceso autenticado ni publicación de media real.
- `public/sitemap.xml` incluye la URL canónica. GitHub Pages sirve este proyecto bajo una subruta: un `robots.txt` en esa subruta no controla el rastreo del dominio.
