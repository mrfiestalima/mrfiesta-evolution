const phone = '51977783926'
const base = `https://wa.me/${phone}`
export const whatsappUrl = (message: string) => `${base}?text=${encodeURIComponent(message)}`
export const messages = {
  hero: 'Hola 👋 Quiero organizar una experiencia con MR FIESTA. 🎉',
  quote: 'Hola 👋 Quiero organizar una experiencia con MR FIESTA. Mi evento será el...',
  experience: (name: string) => `Hola 👋 Estoy viendo la ${name} de MR FIESTA y quiero información para mi evento.`,
  event: (name: string) => `Hola 👋 Acabo de ver la celebración ${name} de MR FIESTA y quisiera hacer algo similar para mi evento.`
}
