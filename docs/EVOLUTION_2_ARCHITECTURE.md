# MR Fiesta Evolution 2

## Arquitectura

Se conserva React 19, TypeScript, Vite, Supabase, R2, el administrador y la identidad visual existente. No se agregó un router, un servidor permanente ni dependencias de ejecución. `App.tsx` resuelve la ruta pública y refresca datos; `HomePage.tsx` conserva los componentes de la home. `pages/LandingPage.tsx` renderiza páginas de servicios, experiencias, tecnología, eventos, guía y corporativos. Los enlaces usan rutas normales, no hash routing. Los hashes se reservan para secciones de la home.

`components/EvolutionSections.tsx` contiene estadísticas, tipos de celebración, BeforeAfterSlider, testimonios, RecommendationWizard y PartyBuilder. Los videos secundarios tienen controles; las galerías de eventos se cargan al abrir el modal. El modal tiene un chunk independiente. El video de cabecera sigue integrado como fondo, sin recuadro, y cuenta con un botón de pausa y respeto por movimiento reducido.

## Datos y compatibilidad

`SiteContent.version` permanece en 1 para preservar los documentos existentes. `upgradeContent` incorpora el módulo opcional `evolution` y los dos nuevos formatos a documentos anteriores, sin reescribir la base de datos ni quitar campos existentes. Una vez que el documento tiene `evolution`, las decisiones del editor (incluidas eliminaciones y desactivaciones) se respetan. Los precios iniciales son valores editables del CMS.

`evolution` contiene `stats`, `testimonials`, `beforeAfter`, `addons`, `ageGuides`, `corporateClients`, `landings`, `showRecommendation` y `showBuilder`. Las listas tienen IDs estables, orden de array y `enabled`. Estadísticas, reseñas, comparaciones y clientes comienzan vacíos. Nunca se generan cifras o testimonios. Las relaciones de recursos se comprueban tanto en cliente como en la función `site-media`, incluyendo contenido deshabilitado y borradores.

`validateContent` y `validateEvolution` comprueban tamaños, slugs únicos, HTTPS, tipos, precios y configuración. El documento no puede superar 256 KB. No se acepta HTML del editor: React escapa los textos. El JSON incrustado durante prerender escapa `<` para impedir cierres de script.

## Supabase

Se reutilizan `site_documents` (draft/published con revisión y bloqueo optimista), `site_assets`, `celebrations`, `media` y `admin_users`. La única migración nueva agrega `celebrations.details jsonb`, por defecto `{}`, limitado a objeto de 32 KB. No elimina datos ni cambia políticas RLS. Los campos opcionales contienen reto, solución, resultado, servicios, tipo, invitados, espacio, experiencia relacionada, testimonial y SEO.

La función `site-media` conserva su autenticación explícita y autorización contra administradores. La biblioteca no permite borrar recursos referenciados. Eliminar una celebración sigue conservando sus archivos. Nunca se incluye una clave de servicio en el cliente ni en los artefactos estáticos.

## Rutas

- `/`: home.
- `/eventos/` y `/eventos/{slug}/`: índice y casos publicados.
- `/experiencias/{slug}/`: ficha, precio, incluidos y casos asociados.
- `/tecnologia/{slug}/`: montaje, requisitos y eventos asociados.
- Landings iniciales: `/chicoteca-lima/`, `/chicoteca-led-lima/`, `/fiestas-infantiles-lima/`, `/fiestas-preadolescentes-lima/`, `/fiestas-adolescentes-lima/`, `/fiestas-15-anos-lima/`, `/fiestas-adultos-lima/`, `/eventos-colegios-lima/`, `/eventos-corporativos-lima/`, `/pista-led-lima/`, `/karaoke-fiestas-lima/`, `/just-dance-fiestas-lima/`, `/fiestas-en-departamentos-lima/`, `/mr-fiesta-live/`, `/fiestas-por-edades/`.
- `/admin/`: entrada separada y autenticada, noindex/nofollow.

No se generan páginas masivas por distrito o edad. El slug del CMS es relativo, sin barras, acentos ni espacios. `lib/routes.ts` centraliza las rutas públicas y excluye elementos deshabilitados y eventos en borrador.

## SEO y prerender

`npm run build` compila TypeScript, construye el cliente, construye una entrada SSR temporal y ejecuta `scripts/prerender.mjs`. El script lee el documento publicado y todos los eventos publicados mediante la API pública con RLS, pagina los resultados y genera un `index.html` en cada ruta. Una falla de lectura detiene el build para evitar publicar un sitemap incompleto. En CI se exigen las variables de Supabase.

`entry-server.tsx` utiliza `renderToString`. El navegador hidrata ese HTML; el contenido principal y sus enlaces ya existen sin ejecutar JavaScript. El JSON inicial de la home no contiene galerías completas. La página de un evento sí incluye su galería. Un error transitorio al refrescar conserva el contenido inicial.

`lib/seo.ts` produce título, descripción, canonical, Open Graph, Twitter y JSON-LD por página. Tipos: LocalBusiness sin dirección inventada, Service, BreadcrumbList, FAQPage y Article para casos reales (no se anuncian como eventos futuros). No se emiten estrellas ni valoraciones inventadas. Se generan `sitemap.xml`, `robots.txt`, `.nojekyll` y una página 404 noindex. `scripts/verify-static.mjs` comprueba cada archivo, H1 único, canonical, JSON, exclusión de borradores y reglas del admin.

**Publicación desde CMS:** guardar/publicar cambia el contenido dinámico. Para crear o retirar rutas estáticas y actualizar el HTML indexable y sitemap, ejecutar **Actions → Deploy to GitHub Pages → Run workflow → main**. El admin enlaza esa pantalla. El despliegue en cada push a main ya está automatizado. No se guarda un token de GitHub en el navegador ni se simula que publicar contenido haya regenerado Pages. Si se desea automatizar también ese paso, se puede agregar posteriormente un webhook de servidor con credenciales limitadas. Hasta regenerar, una ruta nueva puede devolver HTTP 404 en Pages y una antigua conservar su HTML estático.

## Variables y dominio propio

Variables públicas de Vite / GitHub Repository Variables:

| Variable                        | Uso                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | API del proyecto existente                                                                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública, sujeta a RLS                                                                   |
| `VITE_MEDIA_BASE_URL`           | Base R2 del video de cabecera y recursos iniciales                                            |
| `VITE_BASE_PATH`                | `/mrfiesta-evolution/` por defecto; `/` en dominio propio                                     |
| `VITE_SITE_URL`                 | `https://mrfiestalima.github.io/mrfiesta-evolution/` por defecto; URL pública con barra final |

Para dominio propio configurar el dominio en GitHub Pages y DNS, cambiar base a `/`, ajustar URL pública, actualizar CNAME si corresponde y volver a construir. No se deben editar individualmente las URLs del código o los enlaces de archivos R2.

## Administrador

Las pestañas actuales permanecen. **Evolution 2** añade subpestañas y fichas plegables para estadísticas, testimonios, antes/después, adicionales, edades, clientes y páginas/SEO. Permite habilitar, ordenar, eliminar del borrador, elegir archivos de biblioteca, previsualizar y publicar. Los campos de experiencias y tecnología se amplían dentro de sus pestañas. El editor de celebraciones añade historia del evento y SEO.

La vista previa usa el contenido local por una hora y propaga su identificador al navegar entre páginas. No publica ni modifica datos. La demostración `?demo` existe solo en desarrollo; producción siempre requiere autenticación y autorización.

### Agregar una experiencia

En Experiencias, crear o editar el paquete; completar nombre, precio (`S/590`, `Desde S/590` o `Consultar`), duración, slug, descripción, tags e incluidos. Edades del motor: `6-8`, `9-11`, `12-14`, `15-17`, `Adultos`. Preferencias: `Bailar`, `Karaoke`, `Juegos`, `Just Dance`, `Animación`, `Pista LED`, `Todo`. Listas: un elemento por línea. Imagen/video se seleccionan de la biblioteca. Guardar, previsualizar, publicar y regenerar Pages. Mantener el ID al editar, pues adicionales y casos lo usan.

### Agregar una landing

Evolution 2 → Páginas y SEO → Agregar. Completar slug único, título, descripción, introducción, secciones de contenido, tipo, CTA y metadata. Seleccionar IDs de experiencias relacionadas. Habilitar y publicar. Regenerar Pages antes de compartir la ruta nueva. Evitar duplicar contenido cambiando solo el nombre del distrito.

### Publicar un evento

Crear/editar en Celebraciones, completar identidad y slug, cargar portada/video/galería y describir el caso con datos reales. Los campos vacíos no se muestran. Usar el ID de experiencia para asociarlo a su ficha. Publicar y regenerar Pages. Pasar a borrador o eliminar también exige regenerar para retirar el HTML estático; la biblioteca se conserva.

### Reglas y adicionales

`data/recommendationRules.ts` contiene opciones, perfiles iniciales y puntuación local. Edades/preferencias del CMS sobreescriben el perfil por defecto. El motor devuelve máximo tres paquetes habilitados y orienta organizaciones a la página corporativa. La combinación adolescente + baile + karaoke permite comparar Chicoteca, Chicoteca en Casa y Club LED. Todo resultado requiere revisión del lugar.

En Adicionales, ingresar nombre, descripción, precio, imagen, modalidad y IDs compatibles (vacío = todas). `data/partyBuilder.ts` calcula solo adicionales habilitados y compatibles; no duplica seleccionados y separa valores por consultar del subtotal. Al cambiar base se limpia la selección. No hay pagos ni reservas automáticas.

## WhatsApp y medición

`lib/whatsapp.ts` centraliza los mensajes y valida el teléfono configurado. Recomendador, armador, formulario general, corporativo y eventos incluyen su contexto. Los formularios no almacenan contactos: preparan el mensaje que el visitante decide enviar en WhatsApp.

`lib/analytics.ts` expone `trackEvent` y se conecta opcionalmente a `window.gtag`, `fbq` o `ttq` si el propietario ya los configuró. Sin configuración no envía eventos. No hay IDs ficticios, ni datos personales/respuestas/mensajes en los parámetros. Cubre clics de WhatsApp, vistas de fichas, recomendaciones, configuraciones, formularios, comparación y reproducción.

## Validación y despliegue

1. `npm ci`
2. `npm test`
3. `npm run lint`
4. `npm run build` (incluye verificación de HTML estático)
5. Revisar móvil, teclado, admin y mensajes sin enviar consultas de prueba.
6. Aplicar migración aditiva y desplegar `site-media` con su archivo compartido.
7. Push revisado a main o ejecutar workflow. Confirmar resultado de GitHub Actions y rutas públicas.

Las pruebas cubren recomendación, precios, compatibilidad de adicionales, WhatsApp, migración de documentos, validación, relaciones de biblioteca, routing, metadata y prerender. Las interacciones de wizard, formularios, comparación y videos necesitan JavaScript; su contenido informativo y enlaces básicos se prerenderizan.

## Comprobación de acceso

Después de la migración se confirmó que las tres celebraciones existentes conservan `details = {}` y RLS sigue activo. La API pública devuelve una lista vacía al consultar el borrador; `site-media` devuelve 401 sin sesión. El asesor de Supabase mantiene avisos de configuración existentes en el proyecto compartido con Live: funciones SECURITY DEFINER, search_path y protección de contraseñas. No se modificaron permisos de Live como parte de este cambio. Referencias: [funciones privilegiadas](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [search_path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable), [contraseñas comprometidas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
