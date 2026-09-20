import { mediaManifest } from "./media";

export type Asset = {
  id: string;
  url: string;
  type: "image" | "video";
  name: string;
};
export type Experience = {
  id: string;
  name: string;
  price: string;
  time: string;
  desc: string;
  tags: string[];
  enabled: boolean;
  asset: Asset | null;
};
export type Technology = {
  id: string;
  name: string;
  enabled: boolean;
  asset: Asset | null;
};
export const copyDefaults = {
  heroTitle: "LA FIESTA",
  heroAccent: "EVOLUCIONÓ.",
  heroDescription:
    "Creamos celebraciones donde música, iluminación, juegos, video y tecnología funcionan como un solo sistema.",
  heroButton: "QUIERO VIVIRLO",
  statementTitle: "NO HACEMOS",
  statementAccent: "FIESTAS COMUNES.",
  statementDescription:
    "Diseñamos experiencias donde entretenimiento, producción y tecnología funcionan juntos. El resultado no se explica. Se vive.",
  experiencesTitle: "ELIGE CÓMO QUIERES",
  experiencesAccent: "VIVIR LA FIESTA.",
  technologyTitle: "NO ES TECNOLOGÍA PARA MIRAR.",
  technologyAccent: "ES TECNOLOGÍA PARA VIVIRLA.",
  technologyDescription:
    "Cada elemento responde al momento. La luz sigue la música. La imagen amplifica la emoción. La pista se vuelve parte de la historia.",
  liveTitle: "LA FIESTA",
  liveAccent: "TAMBIÉN SE CONECTA.",
  liveDescription:
    "Una capa digital que convierte a los invitados en parte activa del show. Piden canciones, comparten fotos, reaccionan y se conectan con el DJ.",
  liveButton: "Conocer MR Fiesta Live",
  eventsTitle: "CELEBRACIONES",
  eventsAccent: "PARA RECORDAR.",
  eventsDescription: "Música, luz y momentos para compartir.",
  proofTitle: "Tú pones el motivo.",
  proofAccent: "Juntos creamos la celebración.",
  quoteTitle: "CUÉNTANOS",
  quoteAccent: "QUÉ IMAGINAS.",
  quoteDescription:
    "Unos pocos datos y empezamos a darle forma. Prepara tu consulta y envíanosla por WhatsApp.",
  faqTitle: "RESOLVAMOS",
  faqAccent: "TUS DUDAS.",
  finalTitle: "YA VISTE CÓMO SE VIVE.",
  finalAccent: "AHORA HAGAMOS LA TUYA.",
  finalDescription:
    "Cuéntanos fecha, edad y distrito. Nosotros empezamos a diseñar la experiencia.",
  finalButton: "CREAR MI EXPERIENCIA",
  footerDescription: "Entertainment × Technology · Lima, Perú.",
  floatingButton: "Hablar con MR Fiesta",
};
export const sectionLabels = {
  statement: "Presentación",
  experiences: "Experiencias",
  technology: "Tecnología",
  live: "MR Fiesta Live",
  events: "Celebraciones",
  proof: "Frase de marca",
  facts: "Por qué elegirnos",
  faq: "Preguntas frecuentes",
  final: "Cierre",
};
export type SectionKey = keyof typeof sectionLabels;
export type SiteContent = {
  version: 1;
  copy: typeof copyDefaults;
  visible: Record<SectionKey, boolean>;
  heroAsset: Asset | null;
  liveAsset: Asset | null;
  experiences: Experience[];
  technology: Technology[];
  facts: { id: string; title: string; description: string }[];
  faq: { id: string; question: string; answer: string }[];
  contact: {
    phone: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};
export const defaultContent: SiteContent = {
  version: 1,
  copy: copyDefaults,
  visible: Object.fromEntries(
    Object.keys(sectionLabels).map((key) => [key, true]),
  ) as SiteContent["visible"],
  heroAsset: mediaManifest.hero.video.src
    ? {
        id: "legacy-hero",
        url: mediaManifest.hero.video.src,
        type: "video",
        name: "Video de inicio",
      }
    : null,
  liveAsset: null,
  experiences: [
    {
      id: "home",
      name: "Chicoteca en Casa",
      price: "S/750",
      time: "2 horas",
      desc: "El primer salto: música, luces y una pista que convierte tu sala en el centro de todo.",
      tags: ["DJ", "Luces", "Juegos"],
      enabled: true,
      asset: null,
    },
    {
      id: "neon",
      name: "Experiencia Neón",
      price: "S/950",
      time: "3 horas",
      desc: "La energía sube. UV, neón y una atmósfera diseñada para que nadie se quede sentado.",
      tags: ["UV", "Neón", "Karaoke"],
      enabled: true,
      asset: null,
    },
    {
      id: "led",
      name: "Ultra Chicoteca LED",
      price: "S/1290",
      time: "3 horas",
      desc: "Una pista visualmente inmersiva, sonido, visuales y el ritmo de una noche que se recuerda.",
      tags: ["Pista LED", "Visuales", "DJ"],
      enabled: true,
      asset: null,
    },
    {
      id: "decoration",
      name: "Ultra Chicoteca + Decoración",
      price: "S/1590",
      time: "4 horas",
      desc: "La experiencia completa: producción, decoración y cada detalle conectado a la celebración.",
      tags: ["Full set", "Decoración", "Live"],
      enabled: true,
      asset: null,
    },
  ],
  technology: [
    "Pista LED Infinity",
    "Iluminación inteligente",
    "Just Dance",
    "Karaoke",
    "Proyección audiovisual",
    "Robot LED",
    "Glitter & Neon",
  ].map((name, i) => ({ id: `tech-${i}`, name, enabled: true, asset: null })),
  facts: [
    {
      id: "production",
      title: "Producción propia.",
      description: "Diseñamos y operamos cada experiencia desde dentro.",
    },
    {
      id: "equipment",
      title: "Equipos propios.",
      description: "Control real sobre cada detalle que se enciende.",
    },
    {
      id: "technology",
      title: "Tecnología propia.",
      description: "Herramientas que nacen para hacerte vivir más.",
    },
    {
      id: "ages",
      title: "Para cada edad.",
      description: "Niños, preadolescentes, adolescentes y quinceañeros.",
    },
  ],
  faq: [
    {
      id: "quote",
      question: "¿Cómo solicito una cotización?",
      answer:
        "Completa el formulario con tu distrito, fecha aproximada y número de invitados. Se preparará un mensaje que puedes revisar y enviar por WhatsApp.",
    },
    {
      id: "choose",
      question: "¿No sé qué experiencia elegir?",
      answer:
        "Selecciona “Ayúdenme a elegir” y cuéntanos la edad, el tipo de celebración y cómo es el espacio.",
    },
    {
      id: "date",
      question: "¿Puedo consultar si todavía no tengo fecha?",
      answer:
        "Sí. Deja la fecha vacía y te orientamos con las opciones. La disponibilidad se revisa cuando definas el día.",
    },
    {
      id: "booking",
      question: "¿Enviar mi consulta reserva la fecha?",
      answer:
        "No. Nuestro equipo revisará contigo la disponibilidad, los servicios, el importe final y las condiciones antes de confirmar una reserva.",
    },
  ],
  contact: { phone: "51977783926", instagram: "", facebook: "", tiktok: "" },
};

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
export function validateContent(value: unknown): SiteContent {
  const fail = (message: string): never => {
    throw new Error(message);
  };
  if (!value || typeof value !== "object") return fail("Contenido inválido.");
  const c = value as SiteContent;
  const text = (v: unknown, max = 3000) =>
    typeof v === "string" && v.length <= max;
  const asset = (v: Asset | null) =>
    v === null ||
    (v &&
      text(v.id, 100) &&
      text(v.name, 300) &&
      isHttpsUrl(v.url) &&
      ["image", "video"].includes(v.type));
  if (
    c.version !== 1 ||
    !c.copy ||
    !Object.keys(copyDefaults).every((k) =>
      text(c.copy[k as keyof typeof copyDefaults]),
    )
  )
    return fail("Revisa los textos de la web (máximo 3000 caracteres).");
  if (
    !c.visible ||
    !Object.keys(sectionLabels).every(
      (k) => typeof c.visible[k as SectionKey] === "boolean",
    )
  )
    return fail("Revisa las secciones visibles.");
  if (!c.contact || !/^[1-9]\d{7,14}$/.test(c.contact.phone))
    return fail(
      "WhatsApp debe incluir código de país y solo números (ej. 51977783926).",
    );
  if (
    ![c.contact.instagram, c.contact.facebook, c.contact.tiktok].every(
      (v) => v === "" || (text(v, 2048) && isHttpsUrl(v)),
    )
  )
    return fail("Las redes sociales deben usar enlaces HTTPS completos.");
  if (!asset(c.heroAsset) || !asset(c.liveAsset))
    return fail("Archivo de portada o Live inválido.");
  const unique = (items: { id: string }[]) =>
    items.every((i) => text(i.id, 100) && i.id.length > 0) &&
    new Set(items.map((i) => i.id)).size === items.length;
  if (
    !Array.isArray(c.experiences) ||
    c.experiences.length > 30 ||
    !unique(c.experiences) ||
    !c.experiences.every(
      (i) =>
        text(i.name, 120) &&
        i.name.trim() &&
        text(i.price, 80) &&
        text(i.time, 80) &&
        text(i.desc) &&
        typeof i.enabled === "boolean" &&
        asset(i.asset) &&
        Array.isArray(i.tags) &&
        i.tags.length <= 12 &&
        i.tags.every((t) => text(t, 80)),
    )
  )
    return fail(
      "Revisa los paquetes: nombre obligatorio y hasta 12 etiquetas.",
    );
  if (
    !Array.isArray(c.technology) ||
    c.technology.length > 30 ||
    !unique(c.technology) ||
    !c.technology.every(
      (i) =>
        text(i.name, 120) &&
        i.name.trim() &&
        typeof i.enabled === "boolean" &&
        asset(i.asset),
    )
  )
    return fail("Revisa los elementos de tecnología.");
  if (
    !Array.isArray(c.facts) ||
    c.facts.length > 12 ||
    !unique(c.facts) ||
    !c.facts.every((i) => text(i.title, 120) && text(i.description))
  )
    return fail("Revisa los motivos para elegirnos.");
  if (
    !Array.isArray(c.faq) ||
    c.faq.length > 30 ||
    !unique(c.faq) ||
    !c.faq.every((i) => text(i.question, 300) && text(i.answer))
  )
    return fail("Revisa las preguntas frecuentes.");
  return c;
}
