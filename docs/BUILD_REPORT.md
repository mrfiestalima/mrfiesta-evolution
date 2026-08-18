# MR Fiesta Evolution — Build Report

## Arquitectura

Aplicación single-page con React, Vite y TypeScript estricto. La página está organizada en secciones semánticas dentro de `src/App.tsx`, con estilos globales y responsive en `src/index.css`. `src/lib/whatsapp.ts` concentra el número oficial y todos los mensajes contextuales.

## Dependencias y design system

Se usan React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, clsx y tailwind-merge. La interfaz usa tokens CSS para fondos oscuros, amarillo de conversión, líneas y tipografía. Manrope prioriza legibilidad; DM Mono se reserva para metadatos de sistema.

## Motion y responsive

Reveal-on-scroll, transiciones de navegación, selección de experiencias y microinteracciones están construidas con Framer Motion y transform/opacity. Se respeta `prefers-reduced-motion`. El layout tiene composiciones específicas para móvil, tablet y escritorio; el CTA de WhatsApp cambia a una barra inferior compacta en móvil.

## Performance y accesibilidad

No se cargan videos, audio autoplay ni imágenes externas de eventos. Los media frames son CSS para evitar peso y falsas representaciones. Se usan HTML semántico, botones accesibles, labels, focus nativo, color contrastado y anchors directos.

## SEO y GitHub Pages

`index.html` incluye `lang=es`, título, description, canonical, Open Graph y Twitter Card. `vite.config.ts` usa `base: '/mrfiesta-evolution/'`. `.github/workflows/deploy.yml` valida con lint, compila y despliega a Pages desde `main`.

## Próximas mejoras

Reemplazar placeholders por material audiovisual propio, confirmar URLs sociales, añadir sitemap/robots, medir conversiones y conectar un CMS o backend solo cuando exista una necesidad operativa real.
