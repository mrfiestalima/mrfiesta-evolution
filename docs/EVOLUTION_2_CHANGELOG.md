# Evolution 2 — Cambios

- Conservada la cabecera con logo animado de fondo; incorporado control de pausa y movimiento reducido.
- Home reorganizada: tipos de celebración, experiencias, eventos reales, tecnología, Live, prueba social opcional, recomendador, configurador, motivos, FAQ y cotización.
- Estadísticas, testimonios, clientes y comparaciones reales configurables; listas inicialmente vacías y ocultas.
- Formatos Chicoteca S/590 y Club LED S/1,090 editables; paquetes anteriores preservados.
- Experiencias ampliadas con slug, subtítulo, incluidos, edades, invitados, preferencias, imagen/video, CTA y destacado.
- Quince landings iniciales con textos distintos, fichas de experiencias/tecnología, índice y páginas individuales de eventos.
- Casos de celebración ampliados con reto, solución, resultado, tipo, invitados, espacio, experiencia, servicios, testimonial y SEO.
- Recomendador local de cuatro pasos, máximo tres resultados y contexto completo en WhatsApp.
- Configurador con base, adicionales compatibles, modalidades fijo/desde/consultar y subtotal referencial.
- BeforeAfterSlider accesible por rango/teclado; guía por edades y evaluación de departamentos.
- Página corporativa con servicios, clientes opcionales y formulario de consulta.
- CMS modular en subpestañas y fichas plegables; orden, visibilidad, recursos de biblioteca y preview navegable.
- Protección de eliminación de archivos extendida a las nuevas referencias del CMS.
- HTML por ruta mediante prerender React/Vite; hidratación, metadata, canonical, OG/Twitter, JSON-LD, sitemap y robots automáticos.
- Admin y 404 noindex; sin rutas de borradores en sitemap.
- Base y URL pública configurables para GitHub Pages o dominio propio.
- Galerías de home diferidas; modal dividido en chunk; videos secundarios sin autoplay.
- Helpers de WhatsApp centralizados y tracking opcional sin datos personales ni IDs ficticios.
- Migración aditiva `evolution_event_details`, manteniendo datos y RLS existentes.
- Tests de motor, configurador, mensajes, compatibilidad, validación, SEO, rutas y recursos; verificación automática de cada HTML generado.

## Operación

La publicación del CMS actualiza los datos; la regeneración de páginas estáticas se realiza con el workflow de GitHub enlazado desde el administrador. Es necesaria al añadir, despublicar, eliminar o cambiar slugs/SEO de páginas o eventos. No se configuró un token de despliegue dentro del cliente.

Las cifras, testimonios, comparaciones, logos de clientes y adicionales deben cargarse con información real del negocio. Los datos existentes de celebraciones se conservaron, incluidos los que el usuario había descrito como pruebas; su retiro se hace desde el administrador con confirmación.
