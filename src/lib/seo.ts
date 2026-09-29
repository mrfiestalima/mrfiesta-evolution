import type { Page } from "./routes";
import type { SiteContent } from "../data/siteContent";
import { canonical } from "./site";
export function pageSeo(page: Page, content: SiteContent) {
  let title = "MR Fiesta · Celebraciones, DJ y tecnología en Lima",
    description = content.copy.heroDescription,
    image = canonical("logo.png");
  if (page.kind === "landing") {
    title = page.item.seoTitle || page.item.title;
    description = page.item.seoDescription || page.item.description;
    if (page.item.asset?.type === "image") image = page.item.asset.url;
  }
  if (page.kind === "experience") {
    title = `Experiencia ${page.item.name} · Detalles y precio | MR Fiesta`;
    description = page.item.desc;
    if (page.item.image) image = page.item.image.url;
    else if (page.item.asset?.type === "image") image = page.item.asset.url;
  }
  if (page.kind === "technology") {
    title = `Tecnología ${page.item.name} · Montaje y requisitos | MR Fiesta`;
    description =
      page.item.description ||
      `Conoce ${page.item.name} y consulta cómo integrarlo a tu celebración con MR Fiesta.`;
    if (page.item.asset?.type === "image") image = page.item.asset.url;
  }
  if (page.kind === "event") {
    title =
      page.item.details?.seoTitle ||
      `${page.item.title} | Evento real de MR Fiesta`;
    description =
      page.item.details?.seoDescription ||
      page.item.shortDescription ||
      `Conoce la celebración ${page.item.title}${page.item.district ? ` en ${page.item.district}` : ""}: fotos y detalles de MR Fiesta.`;
    image = page.item.coverUrl || image;
  }
  if (page.kind === "events") {
    title = "Eventos reales y celebraciones en Lima | MR Fiesta";
    description =
      "Explora celebraciones reales de MR Fiesta. Conoce sus espacios, experiencias, fotos y videos para inspirar tu próximo evento.";
  }
  if (page.kind === "notFound") {
    title = "Página no encontrada | MR Fiesta";
    description =
      "Encuentra experiencias y celebraciones de MR Fiesta desde el inicio.";
  }
  const url = canonical(page.path),
    name = page.kind === "home" ? "Inicio" : title.split("|")[0].trim();
  const schema: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": canonical("#business"),
      name: "MR Fiesta",
      url: canonical(),
      telephone: `+${content.contact.phone}`,
      sameAs: Object.entries(content.contact)
        .filter(([k, v]) => k !== "phone" && v)
        .map(([, v]) => v),
      areaServed: { "@type": "City", name: "Lima" },
      image: canonical("logo.png"),
    },
  ];
  if (page.kind !== "home" && page.kind !== "notFound")
    schema.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: canonical() },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    });
  if (
    page.kind === "experience" ||
    page.kind === "technology" ||
    page.kind === "landing"
  )
    schema.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      provider: { "@id": canonical("#business") },
      areaServed: "Lima",
      url,
    });
  if (page.kind === "home" && content.visible.faq && content.faq.length)
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((x) => ({
        "@type": "Question",
        name: x.question,
        acceptedAnswer: { "@type": "Answer", text: x.answer },
      })),
    });
  if (page.kind === "event")
    schema.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.item.title,
      description,
      url,
      image,
      author: { "@id": canonical("#business") },
    });
  return {
    title,
    description,
    image,
    url,
    schema,
    noindex: page.kind === "notFound",
  };
}
export const escapeHtml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export const safeJson = (v: unknown) =>
  JSON.stringify(v)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
export function seoHead(page: Page, content: SiteContent) {
  const s = pageSeo(page, content);
  return `<title>${escapeHtml(s.title)}</title><meta name="description" content="${escapeHtml(s.description)}"><meta name="robots" content="${s.noindex ? "noindex,follow" : "index,follow"}"><link rel="canonical" href="${escapeHtml(s.url)}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(s.title)}"><meta property="og:description" content="${escapeHtml(s.description)}"><meta property="og:url" content="${escapeHtml(s.url)}"><meta property="og:image" content="${escapeHtml(s.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(s.title)}"><meta name="twitter:description" content="${escapeHtml(s.description)}"><meta name="twitter:image" content="${escapeHtml(s.image)}"><script type="application/ld+json">${safeJson(s.schema)}</script>`;
}
