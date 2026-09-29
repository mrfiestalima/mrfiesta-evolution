import type { EvolutionContent, EventDetails } from "../types/evolution";
import { initialLandings } from "./landings";
export const emptyEventDetails: EventDetails = {
  celebrationType: "",
  guests: null,
  space: "",
  experienceId: "",
  challenge: "",
  solution: "",
  result: "",
  services: [],
  tags: [],
  testimonial: "",
  cta: "QUIERO ALGO PARECIDO",
  seoTitle: "",
  seoDescription: "",
};
export const evolutionDefaults: EvolutionContent = {
  stats: [],
  testimonials: [],
  beforeAfter: [],
  addons: [],
  corporateClients: [],
  landings: initialLandings,
  showRecommendation: true,
  showBuilder: true,
  ageGuides: [
    [
      "6-8 años",
      "Animación y juegos con momentos de baile.",
      ["Animación", "Juegos", "Just Dance", "Mini hora loca"],
    ],
    [
      "9-11 años",
      "Retos y actividades para compartir con amigos.",
      ["Retos", "Competencias", "Just Dance", "Karaoke"],
    ],
    [
      "12-14 años",
      "Más música y autonomía; menos animación infantil.",
      ["Música", "Baile", "Karaoke"],
    ],
    [
      "15-17 años",
      "DJ y producción para vivir su propia fiesta.",
      ["DJ", "Luces", "Pista LED", "Hora loca"],
    ],
    [
      "Adultos",
      "Elige el ambiente según tu grupo y ocasión.",
      ["DJ", "Karaoke", "Hora loca", "Producción"],
    ],
  ].map(([title, description, activities], i) => ({
    id: `age-${i}`,
    title: title as string,
    description: description as string,
    activities: activities as string[],
    enabled: true,
  })),
};
export function validateEvolution(e: EvolutionContent) {
  if (!e || typeof e !== "object")
    throw new Error("Contenido Evolution inválido.");
  for (const key of [
    "stats",
    "testimonials",
    "beforeAfter",
    "addons",
    "ageGuides",
    "corporateClients",
    "landings",
  ] as const) {
    const list = e[key];
    if (
      !Array.isArray(list) ||
      list.length > 100 ||
      new Set(list.map((x) => x?.id)).size !== list.length ||
      list.some(
        (x) =>
          !x ||
          typeof x.id !== "string" ||
          !x.id ||
          typeof x.enabled !== "boolean",
      )
    )
      throw new Error(`Revisa ${key}: IDs únicos y máximo 100 elementos.`);
  }
  if (
    typeof e.showBuilder !== "boolean" ||
    typeof e.showRecommendation !== "boolean"
  )
    throw new Error("Revisa las secciones interactivas.");
  const text = (x: unknown, max = 5000) =>
    typeof x === "string" && x.length <= max;
  const strings = (x: unknown) =>
    Array.isArray(x) && x.length <= 100 && x.every((v) => text(v, 300));
  if (
    e.stats.some(
      (x) => ![x.value, x.suffix, x.label].every((v) => text(v, 120)),
    )
  )
    throw new Error("Revisa las estadísticas.");
  if (
    e.addons.some(
      (x) =>
        !text(x.name, 120) ||
        !text(x.description) ||
        !strings(x.compatibleWith) ||
        !["fixed", "from", "consult"].includes(x.priceMode) ||
        (x.priceMode !== "consult" &&
          (!Number.isFinite(x.price) || Number(x.price) < 0)),
    )
  )
    throw new Error("Revisa los precios de adicionales.");
  if (
    e.testimonials.some(
      (x) =>
        ![x.name, x.comment, x.source, x.sourceUrl, x.eventId].every((v) =>
          text(v),
        ) ||
        !Number.isInteger(x.stars) ||
        x.stars < 1 ||
        x.stars > 5,
    )
  )
    throw new Error("Revisa los testimonios.");
  if (
    e.beforeAfter.some(
      (x) =>
        ![x.title, x.description, x.district, x.eventId].every((v) => text(v)),
    )
  )
    throw new Error("Revisa antes/después.");
  if (
    e.ageGuides.some(
      (x) => !text(x.title) || !text(x.description) || !strings(x.activities),
    )
  )
    throw new Error("Revisa la guía por edades.");
  if (e.corporateClients.some((x) => !text(x.name, 120)))
    throw new Error("Revisa clientes.");
  if (
    new Set(e.landings.map((x) => x.slug)).size !== e.landings.length ||
    e.landings.some(
      (x) =>
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug) ||
        ["admin", "eventos", "experiencias", "tecnologia", "404"].includes(
          x.slug,
        ) ||
        ![
          x.title,
          x.description,
          x.intro,
          x.seoTitle,
          x.seoDescription,
          x.cta,
        ].every((v) => text(v)) ||
        !strings(x.experienceIds) ||
        !["service", "corporate", "live", "ages", "spaces"].includes(x.kind) ||
        !Array.isArray(x.sections) ||
        x.sections.length > 30 ||
        x.sections.some((s) => !text(s.title) || !text(s.body)),
    )
  )
    throw new Error("Revisa páginas y slugs SEO.");
  // Reject unsafe URLs at every depth, including optional assets in new modules.
  const walk = (v: unknown, key = "") => {
    if (v && typeof v === "object") {
      if ("url" in v) {
        const a = v as Record<string, unknown>;
        if (
          !text(a.id, 100) ||
          !text(a.name, 300) ||
          !["image", "video"].includes(String(a.type))
        )
          throw new Error("Archivo inválido.");
      }
      for (const [k, x] of Object.entries(v)) walk(x, k);
    } else if (
      typeof v === "string" &&
      v &&
      ["url", "sourceUrl"].includes(key)
    ) {
      const u = new URL(v);
      if (u.protocol !== "https:" || u.username || u.password)
        throw new Error("Los archivos y fuentes requieren HTTPS.");
    }
  };
  walk(e);
  for (const x of e.beforeAfter)
    if (
      (x.before && x.before.type !== "image") ||
      (x.after && x.after.type !== "image")
    )
      throw new Error("Antes y después requieren imágenes.");
  for (const x of e.corporateClients)
    if (x.logo && x.logo.type !== "image")
      throw new Error("El logo requiere una imagen.");
  for (const x of e.testimonials)
    if (
      (x.avatar && x.avatar.type !== "image") ||
      (x.video && x.video.type !== "video")
    )
      throw new Error("Revisa foto y video del testimonio.");
}

export function validateEventDetails(d: EventDetails) {
  if (!d || typeof d !== "object") throw new Error("Detalles inválidos");
  for (const [key, value] of Object.entries(d)) {
    if (key === "guests") {
      if (
        value !== null &&
        (!Number.isInteger(value) ||
          Number(value) < 1 ||
          Number(value) > 100000)
      )
        throw new Error("Invitados inválidos");
    } else if (["services", "tags"].includes(key)) {
      if (
        !Array.isArray(value) ||
        value.length > 100 ||
        value.some((x) => typeof x !== "string" || x.length > 300)
      )
        throw new Error("Lista inválida");
    } else if (typeof value !== "string" || value.length > 5000)
      throw new Error("Texto inválido");
  }
  return d;
}
