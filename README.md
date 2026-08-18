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
