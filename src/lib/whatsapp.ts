export const whatsappUrl = (message: string, phone = "51977783926") => {
  if (!/^[1-9]\d{7,14}$/.test(phone))
    throw new Error("Número de WhatsApp inválido");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
export function contextMessage(
  context: string,
  fields: Record<string, string | number | undefined | null>,
) {
  return `Hola 👋 Quiero ${context} con MR FIESTA.\n\n${Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${String(v).trim().slice(0, 2000)}`)
    .join(
      "\n",
    )}\n\n¿Me ayudan a revisar disponibilidad y preparar una propuesta?`;
}
export const messages = {
  recommendation: (fields: Record<string, string | number>) =>
    contextMessage("consultar una fiesta recomendada", fields),
  builder: (fields: Record<string, string | number>) =>
    contextMessage("cotizar mi configuración", fields),
  corporate: (fields: Record<string, string | number>) =>
    contextMessage("cotizar un evento corporativo", fields),
  quoteDetails: (fields: Record<string, string | number>) =>
    contextMessage("cotizar mi fiesta", fields),
  spaceEvaluation:
    "Hola 👋 Quiero saber qué montaje podría funcionar en mi espacio. Voy a enviarles fotos/videos.",
  live: "Hola 👋 Quiero conocer MR Fiesta Live para mi evento.",
  references:
    "Hola 👋 Quisiera ver fotos y videos de eventos de MR FIESTA para elegir mi experiencia.",
  hero: "Hola 👋 Quiero organizar una experiencia con MR FIESTA. 🎉",
  quote:
    "Hola 👋 Quiero organizar una experiencia con MR FIESTA. Mi evento será el...",
  experience: (name: string) =>
    `Hola 👋 Estoy viendo la ${name} de MR FIESTA y quiero información para mi evento.`,
  event: (name: string) =>
    `Hola 👋 Acabo de ver la celebración “${name}” de MR FIESTA y quisiera hacer algo similar para mi evento.`,
};
