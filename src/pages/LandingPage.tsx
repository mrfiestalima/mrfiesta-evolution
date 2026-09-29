import { useState, type FormEvent } from "react";
import type { Page } from "../lib/routes";
import type { SiteContent } from "../data/siteContent";
import type { Celebration } from "../types/celebrations";
import { sitePath } from "../lib/site";
import { whatsappUrl, messages } from "../lib/whatsapp";
import { trackEvent } from "../lib/analytics";
import { displayPrice } from "../data/partyBuilder";
import { SiteAsset } from "../components/SiteAsset";
import { BeforeAfterSlider } from "../components/EvolutionSections";
function CorporateForm({ content }: { content: SiteContent }) {
  const [prepared, setPrepared] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>;
    trackEvent("corporate_quote");
    setPrepared(whatsappUrl(messages.corporate(values), content.contact.phone));
  }
  return (
    <section id="cotizar-empresa" className="evo-panel">
      <h2>Hablemos de tu evento.</h2>
      <p>Completa los datos y envía tu consulta por WhatsApp.</p>
      <form
        className="evo-form"
        onSubmit={submit}
        onChange={() => setPrepared("")}
      >
        {[
          ["Empresa", "text"],
          ["Nombre de contacto", "text"],
          ["Email", "email"],
          ["Teléfono", "tel"],
          ["Fecha", "date"],
          ["Lugar", "text"],
          ["Invitados", "number"],
          ["Tipo de evento", "text"],
        ].map(([name, type]) => (
          <label key={name}>
            {name}
            <input
              name={name}
              type={type}
              min={type === "number" ? 1 : undefined}
              maxLength={200}
              required={!["Fecha", "Lugar"].includes(name)}
            />
          </label>
        ))}
        <label className="full">
          Comentarios
          <textarea name="Comentarios" maxLength={2000} />
        </label>
        <button className="button button-primary full">
          PREPARAR CONSULTA POR WHATSAPP →
        </button>
        {prepared && (
          <div className="full" role="status">
            <p>
              Tu consulta está preparada. Abre WhatsApp, revisa el mensaje y
              envíalo para contactarnos.
            </p>
            <a
              className="button button-primary"
              href={prepared}
              target="_blank"
              rel="noopener noreferrer"
            >
              ABRIR WHATSAPP →
            </a>
          </div>
        )}
      </form>
    </section>
  );
}
export function EventCards({ events }: { events: Celebration[] }) {
  return (
    <div className="evo-grid">
      {events
        .filter((x) => x.published)
        .map((x) => (
          <a
            className="evo-card"
            href={sitePath(`eventos/${x.slug}/`)}
            key={x.id}
          >
            {x.coverUrl && (
              <div className="evo-media">
                <img
                  className="site-asset"
                  src={x.coverUrl}
                  loading="lazy"
                  alt={x.title}
                />
              </div>
            )}
            <small>
              {[x.district, x.age ? `${x.age} años` : null]
                .filter(Boolean)
                .join(" · ")}
            </small>
            <h3>{x.title}</h3>
            <p>{x.shortDescription}</p>
            <span>Ver celebración →</span>
          </a>
        ))}
    </div>
  );
}
export default function LandingPage({
  page,
  content,
  events,
}: {
  page: Page;
  content: SiteContent;
  events: Celebration[];
}) {
  const e = content.evolution;
  const title =
    page.kind === "landing"
      ? page.item.title
      : page.kind === "experience" || page.kind === "technology"
        ? page.item.name
        : page.kind === "event"
          ? page.item.title
          : page.kind === "events"
            ? "CELEBRACIONES REALES."
            : "No encontramos esta página.";
  const description =
    page.kind === "landing"
      ? page.item.intro
      : page.kind === "experience"
        ? page.item.desc
        : page.kind === "technology"
          ? page.item.description
          : page.kind === "event"
            ? page.item.shortDescription
            : page.kind === "events"
              ? "Cada grupo tiene una historia. Explora fotos, videos y detalles de nuestras celebraciones."
              : "Vuelve al inicio para explorar nuestras experiencias.";
  const asset =
    page.kind === "landing" || page.kind === "technology"
      ? page.item.asset
      : page.kind === "experience"
        ? page.item.video || page.item.image || page.item.asset
        : null;
  const related =
    page.kind === "landing"
      ? content.experiences.filter(
          (x) => x.enabled && page.item.experienceIds.includes(x.id),
        )
      : [];
  const corporate = page.kind === "landing" && page.item.kind === "corporate";
  const message =
    page.kind === "event"
      ? messages.event(page.item.title)
      : page.kind === "experience"
        ? messages.experience(page.item.name)
        : page.kind === "landing" && page.item.kind === "spaces"
          ? messages.spaceEvaluation
          : page.kind === "landing" && page.item.kind === "live"
            ? messages.live
            : messages.experience(title);
  const cta =
    page.kind === "landing" ||
    page.kind === "experience" ||
    page.kind === "technology"
      ? page.item.cta
      : page.kind === "event"
        ? page.item.details?.cta
        : undefined;
  const relatedEvents =
    page.kind === "experience"
      ? events.filter((x) => x.details?.experienceId === page.item.id)
      : page.kind === "technology"
        ? events.filter((x) => page.item.eventIds?.includes(x.id))
        : page.kind === "event"
          ? events
              .filter(
                (x) =>
                  x.id !== page.item.id &&
                  ((x.details?.experienceId &&
                    x.details.experienceId ===
                      page.item.details?.experienceId) ||
                    (x.theme && x.theme === page.item.theme)),
              )
              .slice(0, 3)
          : [];
  return (
    <div className="container">
      <header className="landing-header">
        <a href={sitePath()} aria-label="MR Fiesta inicio">
          <img src={sitePath("logo.png")} alt="MR Fiesta" />
        </a>
        <a href={sitePath("eventos/")}>Eventos reales</a>
        <a href={sitePath("#cotizar")}>Cotizar →</a>
      </header>
      <main id="contenido" className="landing evo">
        <nav aria-label="Migas de pan" className="breadcrumbs">
          <a href={sitePath()}>Inicio</a>
          <span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        {description && <p className="landing-intro">{description}</p>}
        {page.kind !== "notFound" && (
          <a
            className="button button-primary"
            href={
              corporate
                ? "#cotizar-empresa"
                : whatsappUrl(message, content.contact.phone)
            }
            onClick={() => {
              if (page.kind === "experience")
                trackEvent("experience_whatsapp", { id: page.item.id });
              if (page.kind === "event")
                trackEvent("event_whatsapp", { id: page.item.id });
            }}
          >
            {cta || "CONSULTAR DISPONIBILIDAD"} →
          </a>
        )}
        {asset && (
          <div className="evo-media">
            <SiteAsset asset={asset} alt={title} />
          </div>
        )}
        {page.kind === "landing" && (
          <>
            {page.item.sections.map((s, i) => (
              <section className="landing-article" key={i}>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
            {page.item.kind === "ages" && (
              <div className="evo-grid">
                {e?.ageGuides
                  .filter((x) => x.enabled)
                  .map((x) => (
                    <article className="evo-card" key={x.id}>
                      <h2>{x.title}</h2>
                      <p>{x.description}</p>
                      <ul>
                        {x.activities.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
              </div>
            )}
            {page.item.kind === "spaces" && (
              <div className="evo-grid">
                {e?.beforeAfter
                  .filter((x) => x.enabled)
                  .map((x) => (
                    <BeforeAfterSlider key={x.id} item={x} />
                  ))}
              </div>
            )}
            {corporate && (
              <>
                {(e?.corporateClients ?? []).some(
                  (x) => x.enabled && x.logo,
                ) && (
                  <section>
                    <h2>Han confiado en nosotros</h2>
                    <div className="evo-grid">
                      {e?.corporateClients
                        .filter((x) => x.enabled && x.logo)
                        .map((x) => (
                          <figure key={x.id} className="evo-card">
                            <img
                              src={x.logo!.url}
                              loading="lazy"
                              alt={x.name}
                              width="160"
                            />
                          </figure>
                        ))}
                    </div>
                  </section>
                )}
                <CorporateForm content={content} />
              </>
            )}
          </>
        )}
        {page.kind === "experience" && (
          <section className="landing-article">
            <h2>{page.item.subtitle || "Tu experiencia, de cerca."}</h2>
            <p>
              <strong>{displayPrice(page.item.price)}</strong>
              {page.item.time && ` · ${page.item.time}`}
            </p>
            <ul>
              {(page.item.included ?? page.item.tags).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {Boolean(page.item.ages?.length) && (
              <p>Edades sugeridas: {page.item.ages?.join(", ")}.</p>
            )}
            {page.item.guests && (
              <p>
                Referencia de invitados: hasta {page.item.guests}. Sujeto a
                revisión del espacio.
              </p>
            )}
            <p>
              Confirma fecha, distrito, dimensiones, acceso y condiciones
              técnicas antes de reservar. Podemos ayudarte a ajustar el montaje.
            </p>
          </section>
        )}
        {page.kind === "event" && (
          <>
            {page.item.coverUrl && !page.item.trailerUrl && (
              <img
                src={page.item.coverUrl}
                alt={page.item.title}
                style={{
                  width: "100%",
                  maxHeight: 650,
                  objectFit: "contain",
                  marginTop: 32,
                }}
              />
            )}
            <div className="landing-article">
              <p>
                {[
                  page.item.eventDate,
                  page.item.district,
                  page.item.venue,
                  page.item.age ? `${page.item.age} años` : null,
                  page.item.details?.celebrationType,
                  page.item.details?.space,
                  page.item.details?.guests
                    ? `${page.item.details.guests} invitados`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p>{page.item.longDescription}</p>
              {content.experiences
                .filter(
                  (x) => x.enabled && x.id === page.item.details?.experienceId,
                )
                .map((x) => (
                  <p key={x.id}>
                    Experiencia:{" "}
                    <a href={sitePath(`experiencias/${x.slug || x.id}/`)}>
                      {x.name} →
                    </a>
                  </p>
                ))}
              {Boolean(page.item.details?.tags.length) && (
                <p>{page.item.details?.tags.join(" · ")}</p>
              )}
              {[
                ["El reto", page.item.details?.challenge],
                ["La propuesta", page.item.details?.solution],
                ["El resultado", page.item.details?.result],
              ]
                .filter(([, v]) => v)
                .map(([heading, body]) => (
                  <section key={heading}>
                    <h2>{heading}</h2>
                    <p>{body}</p>
                  </section>
                ))}
              {Boolean(page.item.details?.services?.length) && (
                <>
                  <h2>Servicios de esta celebración</h2>
                  <ul>
                    {page.item.details?.services.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
              {page.item.details?.testimonial && (
                <blockquote>{page.item.details.testimonial}</blockquote>
              )}
            </div>
            {page.item.trailerUrl && (
              <video
                src={page.item.trailerUrl}
                poster={page.item.coverUrl ?? undefined}
                controls
                playsInline
                preload="none"
                style={{ width: "100%", maxHeight: 650 }}
                aria-label={`Video de ${title}`}
              />
            )}
            <div className="event-gallery">
              {page.item.media.map((x) =>
                x.type === "image" ? (
                  <img
                    key={x.id}
                    src={x.url}
                    loading="lazy"
                    alt={x.alt || title}
                  />
                ) : (
                  <video
                    key={x.id}
                    src={x.url}
                    poster={x.thumbnailUrl ?? undefined}
                    controls
                    playsInline
                    preload="none"
                    aria-label={x.alt || title}
                  />
                ),
              )}
            </div>
          </>
        )}
        {related.length > 0 && (
          <section>
            <h2>Experiencias para este plan</h2>
            <div className="evo-grid">
              {related.map((x) => (
                <a
                  className="evo-card"
                  key={x.id}
                  href={sitePath(`experiencias/${x.slug || x.id}/`)}
                >
                  <h3>{x.name}</h3>
                  <strong>{displayPrice(x.price)}</strong>
                  <p>{x.desc}</p>
                  <span>Ver detalles →</span>
                </a>
              ))}
            </div>
          </section>
        )}
        {page.kind === "events" && <EventCards events={events} />}{" "}
        {relatedEvents.length > 0 && (
          <section>
            <h2>Más celebraciones para inspirarte</h2>
            <EventCards events={relatedEvents} />
          </section>
        )}
        <footer className="landing-header">
          <a href={sitePath()}>MR FIESTA · Lima, Perú</a>
          <a href={sitePath("#recomendador")}>Encuentra tu fiesta →</a>
        </footer>
      </main>
    </div>
  );
}
