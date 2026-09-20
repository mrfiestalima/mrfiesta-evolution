import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Images,
  Menu,
  Play,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { messages } from "./lib/whatsapp";
import { SiteAsset } from "./components/SiteAsset";
import { ContactContext } from "./components/ContactContext";
import { defaultContent, type SiteContent } from "./data/siteContent";
import { getPublicContent, readContentPreview } from "./data/siteRepository";
import { EventMediaPreview } from "./components/EventMediaPreview";
import { CelebrationModal } from "./components/CelebrationModal";
import { CelebrationWhatsAppCTA } from "./components/CelebrationWhatsAppCTA";
import { WhatsAppMark } from "./components/CelebrationWhatsAppCTA";
import { QuoteForm } from "./components/QuoteForm";
import { getPublishedCelebrations } from "./data/celebrationsRepository";
import type { Celebration } from "./types/celebrations";

const eventColors = ["violet", "cyan", "pink"] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [preview] = useState(readContentPreview);
  const [content, setContent] = useState<SiteContent>(
    preview ?? defaultContent,
  );
  useEffect(() => {
    let alive = true;
    if (!preview)
      getPublicContent().then((c) => {
        if (alive) setContent(c);
      });
    return () => {
      alive = false;
    };
  }, [preview]);
  const copy = content.copy;
  const experiences = content.experiences
    .filter((item) => item.enabled)
    .map((item, i) => ({ ...item, number: String(i + 1).padStart(2, "0") }));
  const tech = content.technology.filter((item) => item.enabled);
  const whatsappUrl = (message: string) =>
    `https://wa.me/${content.contact.phone}?text=${encodeURIComponent(message)}`;
  const [menu, setMenu] = useState(false);
  const [activeExperience, setActiveExperience] = useState(1);
  const selectedExperience =
    experiences[Math.min(activeExperience, experiences.length - 1)];
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null);
  const [selectedCelebration, setSelectedCelebration] =
    useState<Celebration | null>(null);
  const celebrationTriggerRef = useRef<HTMLElement | null>(null);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  useEffect(() => {
    let mounted = true;
    getPublishedCelebrations().then((published) => {
      if (mounted) setCelebrations(published);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const nav = [
    ["Inicio", "#inicio", true],
    [
      "Experiencias",
      "#experiencias",
      content.visible.experiences && experiences.length > 0,
    ],
    ["Tecnología", "#tecnologia", content.visible.technology],
    ["Eventos", "#eventos", content.visible.events],
    ["MR Fiesta Live", "#live", content.visible.live],
  ] as const;
  return (
    <ContactContext.Provider value={content.contact.phone}>
      <div className="site-shell">
        {preview && (
          <div className="site-preview-banner">
            VISTA PREVIA · Estos cambios todavía no están publicados.{" "}
            <a href={import.meta.env.BASE_URL}>Ver web pública</a>
          </div>
        )}
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <header className="nav-wrap">
          <nav className="nav container">
            <a href="#inicio" className="brand" aria-label="MR Fiesta inicio">
              <span>MR</span> FIESTA
            </a>
            <div
              id="main-navigation"
              className={`nav-links ${menu ? "is-open" : ""}`}
            >
              {nav
                .filter((item) => item[2])
                .map(([item, href]) => (
                  <a key={item} href={href} onClick={() => setMenu(false)}>
                    {item}
                  </a>
                ))}
              <a
                className="nav-cta"
                href="#cotizar"
                onClick={() => setMenu(false)}
              >
                Cotizar <ArrowUpRight size={15} />
              </a>
            </div>
            <button
              className="menu-toggle"
              aria-expanded={menu}
              aria-controls="main-navigation"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </nav>
        </header>

        <main id="contenido" tabIndex={-1}>
          <section className="hero" id="inicio">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-grid" />
            <div className="container hero-content">
              <div className="hero-kicker">
                <span className="status-dot" /> MRF // EXPERIENCE{" "}
                <span className="kicker-line" /> LIMA / PE
              </div>
              <div className="hero-main">
                <div>
                  <p className="eyebrow">
                    ENTERTAINMENT <i>×</i> TECHNOLOGY
                  </p>
                  <h1>
                    {copy.heroTitle}
                    <br />
                    <em>{copy.heroAccent}</em>
                  </h1>
                  <p className="hero-copy">{copy.heroDescription}</p>
                  <div className="hero-actions">
                    <a
                      className="button button-primary button-breathe"
                      href="#cotizar"
                    >
                      {copy.heroButton} <ArrowUpRight size={17} />
                    </a>
                    <a
                      className="text-link explore-link"
                      href={content.visible.events ? "#eventos" : "#cotizar"}
                    >
                      <span className="play-icon">
                        <Play size={12} fill="currentColor" />
                      </span>{" "}
                      Explorar celebraciones
                    </a>
                  </div>
                </div>
                <div
                  className="hero-media"
                  aria-label="Video ambiental de MR Fiesta"
                >
                  <div className="media-video">
                    <div className="media-noise" />
                    <div className="media-center">
                      <strong>
                        DALE PLAY
                        <br />A TU FIESTA.
                      </strong>
                      <span>MÚSICA · LUCES · MOMENTOS</span>
                    </div>
                  </div>
                  <SiteAsset
                    asset={content.heroAsset}
                    alt="MR Fiesta en acción"
                    ambient={!reducedMotion}
                  />
                  <div className="media-caption">
                    <span>MÚSICA QUE CONECTA</span>
                    <span>LIMA, PERÚ</span>
                  </div>
                </div>
              </div>
              <div className="hero-bottom">
                <span>SCROLL TO EXPLORE</span>
                <ChevronDown size={15} />
                <span className="hero-index">
                  01 <i>/</i> 06
                </span>
              </div>
            </div>
          </section>

          {content.visible.statement && (
            <section className="statement section container">
              <Reveal>
                <p className="eyebrow">02 / EL CAMBIO</p>
                <h2>
                  {copy.statementTitle}
                  <br />
                  <span>{copy.statementAccent}</span>
                </h2>
                <div className="statement-detail">
                  <div className="line" />
                  <p>{copy.statementDescription}</p>
                </div>
              </Reveal>
            </section>
          )}

          {content.visible.experiences && selectedExperience && (
            <section className="experiences section" id="experiencias">
              <div className="container">
                <Reveal>
                  <div className="section-top">
                    <div>
                      <p className="eyebrow">03 / EXPERIENCIAS</p>
                      <h2>
                        {copy.experiencesTitle}
                        <br />
                        <em>{copy.experiencesAccent}</em>
                      </h2>
                    </div>
                    <span className="section-note">
                      ELIGE TU EXPERIENCIA
                      <br />
                      LIMA, PERÚ
                    </span>
                  </div>
                </Reveal>
                <div className="experience-layout">
                  <div className="experience-list">
                    {experiences.map((item, i) => (
                      <motion.button
                        className={`experience-tab ${selectedExperience?.id === item.id ? "active" : ""}`}
                        aria-pressed={selectedExperience?.id === item.id}
                        key={item.id}
                        onClick={() => setActiveExperience(i)}
                        whileHover={reducedMotion ? undefined : { x: 5 }}
                      >
                        <span>{item.number}</span>
                        <b>{item.name}</b>
                        <ArrowUpRight size={18} />
                      </motion.button>
                    ))}
                  </div>
                  <motion.div
                    className="experience-feature"
                    key={activeExperience}
                    initial={reducedMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="feature-art">
                      <SiteAsset
                        asset={selectedExperience?.asset ?? null}
                        alt={selectedExperience?.name ?? "Experiencia"}
                      />
                      <div className="art-scan" />
                      <span className="feature-stamp">
                        MRF
                        <br />
                        LIVE
                      </span>
                      <div className="feature-word">
                        {selectedExperience.number}
                      </div>
                      <div className="feature-label">
                        TU PRÓXIMA
                        <br />
                        <strong>CELEBRACIÓN</strong>
                      </div>
                    </div>
                    <div className="feature-info">
                      <div>
                        <h3>{selectedExperience.name}</h3>
                        <p>{selectedExperience.desc}</p>
                      </div>
                      <div className="feature-price">
                        <strong>{selectedExperience.price}</strong>
                        <span>{selectedExperience.time}</span>
                      </div>
                    </div>
                    <div className="tag-row">
                      {selectedExperience.tags.map((tag, index) => (
                        <span key={`${tag}-${index}`}>{tag.trim()}</span>
                      ))}
                      <a
                        className="button-primary button-breathe"
                        href={whatsappUrl(
                          messages.experience(selectedExperience.name),
                        )}
                      >
                        Quiero esta experiencia <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {content.visible.technology && (
            <section className="technology section" id="tecnologia">
              <div className="container">
                <Reveal>
                  <div className="section-top tech-heading">
                    <div>
                      <p className="eyebrow">04 / CREATIVE TECHNOLOGY</p>
                      <h2>
                        {copy.technologyTitle}
                        <br />
                        <em>{copy.technologyAccent}</em>
                      </h2>
                    </div>
                    <p className="tech-intro">{copy.technologyDescription}</p>
                  </div>
                </Reveal>
                <div className="tech-grid">
                  {tech.map(({ name, id, asset }, i) => (
                    <Reveal
                      key={id}
                      delay={i * 0.05}
                      className={`tech-module ${i % 4 === 0 ? "tech-wide" : "tech-small"}`}
                    >
                      <div className="tech-art">
                        <SiteAsset asset={asset} alt={name} />
                        <span className="tech-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="tech-glow" />
                        <span className="tech-visual">
                          {i === 0 ? (
                            <Zap size={48} />
                          ) : i === 4 ? (
                            <Play size={35} fill="currentColor" />
                          ) : (
                            <Sparkles size={30} />
                          )}
                        </span>
                        <span className="tech-status">MR FIESTA</span>
                      </div>
                      <h3>
                        {name.split("\n").map((line, j) => (
                          <span key={line}>
                            {line}
                            {j < name.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </h3>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {content.visible.live && (
            <section className="live section" id="live">
              <div className="container live-panel">
                <div className="live-copy">
                  <p className="eyebrow">05 / MR FIESTA LIVE</p>
                  <h2>
                    {copy.liveTitle}
                    <br />
                    <em>{copy.liveAccent}</em>
                  </h2>
                  <p>{copy.liveDescription}</p>
                  <a
                    className="text-link yellow-link"
                    href={whatsappUrl(
                      "Hola 👋 Quiero conocer MR Fiesta Live para mi evento.",
                    )}
                  >
                    {copy.liveButton} <ArrowUpRight size={16} />
                  </a>
                </div>
                <div className="live-interface">
                  <SiteAsset asset={content.liveAsset} alt="MR Fiesta Live" />
                  <div className="live-top">
                    <span>
                      <span className="status-dot" /> MR FIESTA LIVE
                    </span>
                    <span>VISTA CONCEPTUAL</span>
                  </div>
                  <div className="live-screen">
                    <div className="qr">
                      <div className="qr-core" />
                      <span>EXPERIENCIA LIVE</span>
                    </div>
                    <div className="live-actions">
                      <div>
                        <span className="live-icon">♫</span>
                        <b>Pedidos en vivo</b>
                        <small>Conecta con el DJ</small>
                      </div>
                      <div>
                        <span className="live-icon">♡</span>
                        <b>Reacciones</b>
                        <small>Hazlo sentir</small>
                      </div>
                      <div>
                        <span className="live-icon">▧</span>
                        <b>Galería</b>
                        <small>Comparte la noche</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {content.visible.events && (
            <section className="events section" id="eventos">
              <div className="container">
                <Reveal>
                  <div className="section-top">
                    <div>
                      <p className="eyebrow">06 / CELEBRACIONES</p>
                      <h2>
                        {copy.eventsTitle}
                        <br />
                        <em>{copy.eventsAccent}</em>
                      </h2>
                    </div>
                    <p className="section-note wide-note">
                      {copy.eventsDescription}
                    </p>
                  </div>
                </Reveal>
                {celebrations.length === 0 && (
                  <div className="events-empty">
                    <h3>Imagina lo que podemos hacer juntos.</h3>
                    <p>
                      Cuéntanos qué vas a celebrar. Pídenos por WhatsApp
                      referencias de eventos y opciones para tu espacio.
                    </p>
                    <a
                      className="text-link"
                      href={whatsappUrl(
                        "Hola 👋 Quisiera ver fotos y videos de eventos de MR FIESTA para elegir mi experiencia.",
                      )}
                    >
                      VER OPCIONES POR WHATSAPP <ArrowUpRight size={16} />
                    </a>
                  </div>
                )}
                <div className="event-grid">
                  {celebrations.map((event, i) => (
                    <Reveal
                      key={event.id}
                      delay={i * 0.1}
                      className={`event-card ${eventColors[i % eventColors.length]}`}
                    >
                      <div className="event-art">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <EventMediaPreview
                          coverUrl={event.coverUrl}
                          trailerUrl={event.trailerUrl}
                          alt={event.title}
                          isPlaying={activeTrailerId === event.id}
                          onPlay={() => setActiveTrailerId(event.id)}
                          onStop={() => setActiveTrailerId(null)}
                        />
                      </div>
                      <div className="event-details">
                        <p>{event.meta}</p>
                        <h3>{event.title}</h3>
                        <div className="event-tags">
                          {event.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="event-ctas">
                          <button
                            className="event-explore-button"
                            onClick={(eventObject) => {
                              celebrationTriggerRef.current =
                                eventObject.currentTarget;
                              setSelectedCelebration(event);
                            }}
                          >
                            <Images size={14} /> <span>VER CÓMO SE VIVIÓ</span>
                          </button>
                          <CelebrationWhatsAppCTA title={event.title} />
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {content.visible.proof && (
            <section className="proof section container">
              <Reveal>
                <div className="proof-quote">
                  {copy.proofTitle}
                  <br />
                  <em>{copy.proofAccent}</em>
                </div>
                <div className="proof-by">
                  <span className="line" />{" "}
                  <span>MR FIESTA / ENTERTAINMENT × TECHNOLOGY</span>
                </div>
              </Reveal>
            </section>
          )}
          {content.visible.facts && (
            <section className="facts section">
              <div className="container">
                <Reveal>
                  <p className="eyebrow">WHY MR FIESTA / EN HECHOS</p>
                  <div className="facts-grid">
                    {content.facts.map((item, i) => (
                      <div key={item.id}>
                        <strong>{String(i + 1).padStart(2, "0")}</strong>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          )}
          <QuoteForm
            experiences={experiences.map((item) => item.name)}
            copy={copy}
          />
          {content.visible.faq && (
            <section className="section container faq" id="preguntas">
              <p className="eyebrow">ANTES DE DARLE PLAY</p>
              <h2>
                {copy.faqTitle}
                <br />
                <em>{copy.faqAccent}</em>
              </h2>
              {content.faq.map((item) => (
                <details key={item.id}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>
          )}
          {content.visible.final && (
            <section className="final-cta">
              <div className="cta-glow" />
              <div className="container">
                <p className="eyebrow">YOUR EVENT / NEXT</p>
                <h2>
                  {copy.finalTitle}
                  <br />
                  <em>{copy.finalAccent}</em>
                </h2>
                <p>{copy.finalDescription}</p>
                <a
                  className="button button-primary button-breathe"
                  href="#cotizar"
                >
                  {copy.finalButton} <ArrowUpRight size={18} />
                </a>
              </div>
            </section>
          )}
        </main>
        <div className="whatsapp-float">
          <WhatsAppMark />
          <span>¿Planeando una fiesta?</span>
          <a href={whatsappUrl(messages.quote)}>
            {copy.floatingButton} <ArrowUpRight size={15} />
          </a>
        </div>
        <footer className="footer">
          <div className="container footer-inner">
            <div>
              <a href="#inicio" className="brand">
                <span>MR</span> FIESTA
              </a>
              <p>{copy.footerDescription}</p>
            </div>
            <div className="footer-links">
              <a href={whatsappUrl(messages.quote)}>WhatsApp</a>
              {content.visible.experiences && experiences.length > 0 && (
                <a href="#experiencias">Experiencias</a>
              )}
              <a href="#cotizar">Cotizar</a>
              {content.visible.faq && <a href="#preguntas">Preguntas</a>}
              {Object.entries(content.contact)
                .filter(([key, url]) => key !== "phone" && url)
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {key}
                  </a>
                ))}
            </div>
            <span className="footer-mark">
              © {new Date().getFullYear()} MR FIESTA
            </span>
          </div>
        </footer>
        {selectedCelebration && (
          <CelebrationModal
            celebration={selectedCelebration}
            onClose={() => setSelectedCelebration(null)}
            returnFocusRef={celebrationTriggerRef}
          />
        )}
      </div>
    </ContactContext.Provider>
  );
}
export default App;
