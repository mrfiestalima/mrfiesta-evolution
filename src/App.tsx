import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Images, Menu, Play, Sparkles, X, Zap } from 'lucide-react'
import { messages, whatsappUrl } from './lib/whatsapp'
import { mediaManifest } from './data/media'
import { MediaVideo } from './components/MediaVideo'
import { EventMediaPreview } from './components/EventMediaPreview'
import { CelebrationModal } from './components/CelebrationModal'
import { CelebrationWhatsAppCTA } from './components/CelebrationWhatsAppCTA'
import { WhatsAppMark } from './components/CelebrationWhatsAppCTA'
import { QuoteForm } from './components/QuoteForm'
import { getPublishedCelebrations } from './data/celebrationsRepository'
import type { Celebration } from './types/celebrations'

const experiences = [
  { number: '01', name: 'Chicoteca en Casa', price: 'S/750', time: '2 horas', desc: 'El primer salto: música, luces y una pista que convierte tu sala en el centro de todo.', tags: ['DJ', 'Luces', 'Juegos'] },
  { number: '02', name: 'Experiencia Neón', price: 'S/950', time: '3 horas', desc: 'La energía sube. UV, neón y una atmósfera diseñada para que nadie se quede sentado.', tags: ['UV', 'Neón', 'Karaoke'], featured: true },
  { number: '03', name: 'Ultra Chicoteca LED', price: 'S/1290', time: '3 horas', desc: 'Una pista visualmente inmersiva, sonido, visuales y el ritmo de una noche que se recuerda.', tags: ['Pista LED', 'Visuales', 'DJ'] },
  { number: '04', name: 'Ultra Chicoteca + Decoración', price: 'S/1590', time: '4 horas', desc: 'La experiencia completa: producción, decoración y cada detalle conectado a la celebración.', tags: ['Full set', 'Decoración', 'Live'] }
]
const tech = [
  ['Pista LED Infinity', '01', 'tech-wide'], ['ILUMINACIÓN\nINTELIGENTE', '02', 'tech-tall'], ['JUST DANCE', '03', 'tech-small'], ['KARAOKE', '04', 'tech-small'], ['PROYECCIÓN\nAUDIOVISUAL', '05', 'tech-wide'], ['ROBOT LED', '06', 'tech-small'], ['GLITTER & NEON', '07', 'tech-tall']
]
const eventColors = ['violet', 'cyan', 'pink'] as const

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? undefined : { opacity: 0, y: 22 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function App() {
  const [menu, setMenu] = useState(false)
  const [activeExperience, setActiveExperience] = useState(1)
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null)
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null)
  const celebrationTriggerRef = useRef<HTMLElement | null>(null)
  const [celebrations, setCelebrations] = useState<Celebration[]>([])
  useEffect(() => {
    let mounted = true
    getPublishedCelebrations().then((published) => {
      if (mounted) setCelebrations(published)
    })
    return () => { mounted = false }
  }, [])
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (!menu) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenu(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus() } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menu])
  const nav = ['Inicio', 'Experiencias', 'Tecnología', 'Eventos', 'MR Fiesta Live']
  return <div className="site-shell"><a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="nav-wrap"><nav className="nav container"><a href="#inicio" className="brand" aria-label="MR Fiesta inicio"><span>MR</span> FIESTA</a><div id="main-navigation" className={`nav-links ${menu ? 'is-open' : ''}`}>{nav.map((item, i) => <a key={item} href={['#inicio','#experiencias','#tecnologia','#eventos','#live'][i]} onClick={() => setMenu(false)}>{item}</a>)}<a className="nav-cta" href="#cotizar" onClick={() => setMenu(false)}>Cotizar <ArrowUpRight size={15}/></a></div><button className="menu-toggle" aria-expanded={menu} aria-controls="main-navigation" aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></nav></header>

    <main id="contenido" tabIndex={-1}>
      <section className="hero" id="inicio"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-grid"/><div className="container hero-content"><div className="hero-kicker"><span className="status-dot"/> MRF // EXPERIENCE <span className="kicker-line"/> LIMA / PE</div><div className="hero-main"><div><p className="eyebrow">ENTERTAINMENT <i>×</i> TECHNOLOGY</p><h1>LA FIESTA<br/><em>EVOLUCIONÓ.</em></h1><p className="hero-copy">Creamos celebraciones donde música, iluminación, juegos, video y tecnología funcionan como un solo sistema.</p><div className="hero-actions"><a className="button button-primary button-breathe" href="#cotizar">QUIERO VIVIRLO <ArrowUpRight size={17}/></a><a className="text-link explore-link" href="#eventos"><span className="play-icon"><Play size={12} fill="currentColor"/></span> Explorar celebraciones</a></div></div><div className="hero-media" aria-label="Video ambiental de MR Fiesta"><MediaVideo src={mediaManifest.hero.video.src} poster={mediaManifest.hero.poster.src} autoPlay={!reducedMotion} muted loop playsInline preload="metadata" fallback={<><div className="media-noise"/><div className="media-center"><strong>DALE PLAY<br/>A TU FIESTA.</strong><span>MÚSICA · LUCES · MOMENTOS</span></div></>}/><div className="media-caption"><span>MÚSICA QUE CONECTA</span><span>LIMA, PERÚ</span></div></div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE</span><ChevronDown size={15}/><span className="hero-index">01 <i>/</i> 06</span></div></div></section>

      <section className="statement section container"><Reveal><p className="eyebrow">02 / EL CAMBIO</p><h2>NO HACEMOS<br/><span>FIESTAS COMUNES.</span></h2><div className="statement-detail"><div className="line"/><p>Diseñamos experiencias donde entretenimiento, producción y tecnología funcionan juntos. El resultado no se explica. <strong>Se vive.</strong></p></div></Reveal></section>

      <section className="experiences section" id="experiencias"><div className="container"><Reveal><div className="section-top"><div><p className="eyebrow">03 / EXPERIENCIAS</p><h2>ELIGE CÓMO QUIERES<br/><em>VIVIR LA FIESTA.</em></h2></div><span className="section-note">ELIGE TU EXPERIENCIA<br/>LIMA, PERÚ</span></div></Reveal><div className="experience-layout"><div className="experience-list">{experiences.map((item, i) => <motion.button className={`experience-tab ${activeExperience === i ? 'active' : ''}`} aria-pressed={activeExperience === i} key={item.name} onClick={() => setActiveExperience(i)} whileHover={reducedMotion ? undefined : { x: 5 }}><span>{item.number}</span><b>{item.name}</b><ArrowUpRight size={18}/></motion.button>)}</div><motion.div className="experience-feature" key={activeExperience} initial={reducedMotion ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }}><div className="feature-art"><div className="art-scan"/><span className="feature-stamp">MRF<br/>LIVE</span><div className="feature-word">{experiences[activeExperience].number}</div><div className="feature-label">TU PRÓXIMA<br/><strong>CELEBRACIÓN</strong></div></div><div className="feature-info"><div><h3>{experiences[activeExperience].name}</h3><p>{experiences[activeExperience].desc}</p></div><div className="feature-price"><strong>{experiences[activeExperience].price}</strong><span>{experiences[activeExperience].time}</span></div></div><div className="tag-row">{experiences[activeExperience].tags.map(tag => <span key={tag}>{tag}</span>)}<a className="button-primary button-breathe" href={whatsappUrl(messages.experience(experiences[activeExperience].name))}>Quiero esta experiencia <ArrowUpRight size={15}/></a></div></motion.div></div></div></section>

      <section className="technology section" id="tecnologia"><div className="container"><Reveal><div className="section-top tech-heading"><div><p className="eyebrow">04 / CREATIVE TECHNOLOGY</p><h2>NO ES TECNOLOGÍA<br/><span>PARA MIRAR.</span><br/>ES TECNOLOGÍA<br/><em>PARA VIVIRLA.</em></h2></div><p className="tech-intro">Cada elemento responde al momento. La luz sigue la música. La imagen amplifica la emoción. La pista se vuelve parte de la historia.</p></div></Reveal><div className="tech-grid">{tech.map(([name, number, kind], i) => <Reveal key={name} delay={i * .05} className={`tech-module ${kind}`}><div className="tech-art"><span className="tech-number">{number}</span><div className="tech-glow"/><span className="tech-visual">{i === 0 ? <Zap size={48}/> : i === 4 ? <Play size={35} fill="currentColor"/> : <Sparkles size={30}/>}</span><span className="tech-status">MR FIESTA</span></div><h3>{name.split('\n').map((line, j) => <span key={line}>{line}{j < name.split('\n').length - 1 && <br/>}</span>)}</h3></Reveal>)}</div></div></section>

      <section className="live section" id="live"><div className="container live-panel"><div className="live-copy"><p className="eyebrow">05 / MR FIESTA LIVE</p><h2>LA FIESTA<br/><em>TAMBIÉN SE<br/>CONECTA.</em></h2><p>Una capa digital que convierte a los invitados en parte activa del show. Piden canciones, comparten fotos, reaccionan y se conectan con el DJ.</p><a className="text-link yellow-link" href={whatsappUrl('Hola 👋 Quiero conocer MR Fiesta Live para mi evento.')}>Conocer MR Fiesta Live <ArrowUpRight size={16}/></a></div><div className="live-interface"><div className="live-top"><span><span className="status-dot"/> MR FIESTA LIVE</span><span>VISTA CONCEPTUAL</span></div><div className="live-screen"><div className="qr"><div className="qr-core"/><span>EXPERIENCIA LIVE</span></div><div className="live-actions"><div><span className="live-icon">♫</span><b>Pedidos en vivo</b><small>Conecta con el DJ</small></div><div><span className="live-icon">♡</span><b>Reacciones</b><small>Hazlo sentir</small></div><div><span className="live-icon">▧</span><b>Galería</b><small>Comparte la noche</small></div></div></div></div></div></section>

    <section className="events section" id="eventos"><div className="container"><Reveal><div className="section-top"><div><p className="eyebrow">06 / CELEBRACIONES</p><h2>{celebrations.length ? <>ESTO YA PASÓ.<br/><em>EL PRÓXIMO PUEDE<br/>SER EL TUYO.</em></> : <>TU PRÓXIMO<br/><em>GRAN RECUERDO.</em></>}</h2></div><p className="section-note wide-note">Música, luz y momentos<br/>para compartir.</p></div></Reveal>{celebrations.length === 0 && <div className="events-empty"><h3>Imagina lo que podemos hacer juntos.</h3><p>Cuéntanos qué vas a celebrar. Pídenos por WhatsApp referencias de eventos y opciones para tu espacio.</p><a className="text-link" href={whatsappUrl("Hola 👋 Quisiera ver fotos y videos de eventos de MR FIESTA para elegir mi experiencia.")}>VER OPCIONES POR WHATSAPP <ArrowUpRight size={16}/></a></div>}<div className="event-grid">{celebrations.map((event, i) => <Reveal key={event.id} delay={i * .1} className={`event-card ${eventColors[i % eventColors.length]}`}><div className="event-art"><span>{String(i+1).padStart(2,'0')}</span><EventMediaPreview coverUrl={event.coverUrl} trailerUrl={event.trailerUrl} alt={event.title} isPlaying={activeTrailerId === event.id} onPlay={() => setActiveTrailerId(event.id)} onStop={() => setActiveTrailerId(null)}/></div><div className="event-details"><p>{event.meta}</p><h3>{event.title}</h3><div className="event-tags">{event.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="event-ctas"><button className="event-explore-button" onClick={eventObject => { celebrationTriggerRef.current = eventObject.currentTarget; setSelectedCelebration(event) }}><Images size={14}/> <span>VER CÓMO SE VIVIÓ</span></button><CelebrationWhatsAppCTA title={event.title}/></div></div></Reveal>)}</div></div></section>

      <section className="proof section container"><Reveal><div className="proof-quote">Tú pones el motivo.<br/><em>Juntos creamos<br/>la celebración.</em></div><div className="proof-by"><span className="line"/> <span>MR FIESTA / ENTERTAINMENT × TECHNOLOGY</span></div></Reveal></section>
      <section className="facts section"><div className="container"><Reveal><p className="eyebrow">WHY MR FIESTA / EN HECHOS</p><div className="facts-grid"><div><strong>01</strong><h3>Producción<br/><em>propia.</em></h3><p>Diseñamos y operamos cada experiencia desde dentro.</p></div><div><strong>02</strong><h3>Equipos<br/><em>propios.</em></h3><p>Control real sobre cada detalle que se enciende.</p></div><div><strong>03</strong><h3>Tecnología<br/><em>propia.</em></h3><p>Herramientas que nacen para hacerte vivir más.</p></div><div><strong>04</strong><h3>Para cada<br/><em>edad.</em></h3><p>Niños, preadolescentes, adolescentes y quinceañeros.</p></div></div></Reveal></div></section>
      <QuoteForm experiences={experiences.map(item => item.name)}/>
      <section className="section container faq" id="preguntas"><p className="eyebrow">ANTES DE DARLE PLAY</p><h2>RESOLVAMOS<br/><em>TUS DUDAS.</em></h2><details><summary>¿Cómo solicito una cotización?</summary><p>Completa el formulario con tu distrito, fecha aproximada y número de invitados. Se preparará un mensaje que puedes revisar y enviar por WhatsApp.</p></details><details><summary>¿No sé qué experiencia elegir?</summary><p>Selecciona “Ayúdenme a elegir” y cuéntanos la edad, el tipo de celebración y cómo es el espacio. Conversamos contigo para encontrar la opción adecuada.</p></details><details><summary>¿Puedo consultar si todavía no tengo fecha?</summary><p>Sí. Deja la fecha vacía y te orientamos con las opciones. La disponibilidad se revisa cuando definas el día.</p></details><details><summary>¿Enviar mi consulta reserva la fecha?</summary><p>No. Nuestro equipo revisará contigo la disponibilidad, los servicios, el importe final y las condiciones antes de confirmar una reserva.</p></details></section>
      <section className="final-cta"><div className="cta-glow"/><div className="container"><p className="eyebrow">YOUR EVENT / NEXT</p><h2>YA VISTE<br/>CÓMO SE VIVE.<br/><em>AHORA HAGAMOS<br/>LA TUYA.</em></h2><p>Cuéntanos fecha, edad y distrito.<br/>Nosotros empezamos a diseñar la experiencia.</p><a className="button button-primary button-breathe" href="#cotizar">CREAR MI EXPERIENCIA <ArrowUpRight size={18}/></a></div></section>
    </main>
    <div className="whatsapp-float"><WhatsAppMark/><span>¿Planeando una fiesta?</span><a href={whatsappUrl(messages.quote)}>Hablar con MR Fiesta <ArrowUpRight size={15}/></a></div>
    <footer className="footer"><div className="container footer-inner"><div><a href="#inicio" className="brand"><span>MR</span> FIESTA</a><p>Entertainment × Technology<br/>Lima, Perú.</p></div><div className="footer-links"><a href={whatsappUrl(messages.quote)}>WhatsApp</a><a href="#experiencias">Experiencias</a><a href="#cotizar">Cotizar</a><a href="#preguntas">Preguntas</a></div><span className="footer-mark">© {new Date().getFullYear()} MR FIESTA</span></div></footer>{selectedCelebration && <CelebrationModal celebration={selectedCelebration} onClose={() => setSelectedCelebration(null)} returnFocusRef={celebrationTriggerRef}/>}
  </div>
}
export default App
