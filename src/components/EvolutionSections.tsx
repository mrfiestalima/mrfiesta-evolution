import { useState } from "react";
import type { SiteContent } from "../data/siteContent";
import type { BeforeAfter } from "../types/evolution";
import { evolutionDefaults } from "../data/evolution";
import {
  ageOptions,
  preferenceOptions,
  guestOptions,
  spaceOptions,
  recommend,
  type Answers,
} from "../data/recommendationRules";
import {
  calculateParty,
  compatibleAddons,
  money,
  displayPrice,
} from "../data/partyBuilder";
import { messages, whatsappUrl } from "../lib/whatsapp";
import { trackEvent } from "../lib/analytics";
import { sitePath } from "../lib/site";
import { SiteAsset } from "./SiteAsset";

export function BeforeAfterSlider({ item }: { item: BeforeAfter }) {
  const [position, setPosition] = useState(50);
  if (
    !item.before ||
    !item.after ||
    item.before.type !== "image" ||
    item.after.type !== "image"
  )
    return null;
  return (
    <article className="evo-card">
      <div className="comparison">
        <img
          src={item.after.url}
          alt={`Después: ${item.title}`}
          loading="lazy"
        />
        <img
          src={item.before.url}
          alt={`Antes: ${item.title}`}
          loading="lazy"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <span className="comparison-before">Antes</span>
        <span className="comparison-after">Después</span>
        <div className="comparison-line" style={{ left: `${position}%` }} />
      </div>
      <label>
        Comparar antes y después
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          aria-valuetext={`${position}% antes`}
          onChange={(e) => setPosition(Number(e.target.value))}
          onPointerUp={() =>
            trackEvent("before_after_interaction", { id: item.id })
          }
          onKeyUp={() =>
            trackEvent("before_after_interaction", { id: item.id })
          }
        />
      </label>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.district && <small>{item.district}</small>}
    </article>
  );
}
export function EvolutionIntro({ content }: { content: SiteContent }) {
  const e = content.evolution ?? evolutionDefaults;
  const stats = e.stats.filter((x) => x.enabled && x.value && x.label);
  const slugs = [
    "chicoteca-lima",
    "fiestas-15-anos-lima",
    "fiestas-adultos-lima",
    "eventos-colegios-lima",
    "eventos-corporativos-lima",
  ];
  return (
    <>
      <div className="container evo-stats">
        {stats.map((x) => (
          <div key={x.id}>
            <strong>
              {x.value}
              {x.suffix}
            </strong>
            <span>{x.label}</span>
          </div>
        ))}
      </div>
      <section className="section container evo">
        <p className="eyebrow">TU MOTIVO. TU ESTILO.</p>
        <h2>
          ¿QUÉ VAMOS A <em>CELEBRAR?</em>
        </h2>
        <div className="evo-grid">
          {e.landings
            .filter((x) => x.enabled && slugs.includes(x.slug))
            .map((x) => (
              <a className="evo-card" key={x.id} href={sitePath(`${x.slug}/`)}>
                <h3>{x.slug === "chicoteca-lima" ? "CHICOTECAS EN LIMA" : x.title}</h3>
                <p>{x.description}</p>
                <span>Descubrir →</span>
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
export function EvolutionProof({ content }: { content: SiteContent }) {
  const e = content.evolution ?? evolutionDefaults;
  const comparisons = e.beforeAfter.filter(
    (x) => x.enabled && x.before?.type === "image" && x.after?.type === "image",
  );
  const reviews = e.testimonials.filter(
    (x) => x.enabled && x.name && x.comment,
  );
  return (
    <>
      {comparisons.length > 0 && (
        <section className="section container evo">
          <p className="eyebrow">DEL ESPACIO AL MOMENTO</p>
          <h2>
            ANTES / <em>DESPUÉS.</em>
          </h2>
          <div className="evo-grid">
            {comparisons.map((x) => (
              <BeforeAfterSlider key={x.id} item={x} />
            ))}
          </div>
          <a
            className="button button-outline"
            href={sitePath("fiestas-en-departamentos-lima/")}
          >
            EVALUAR MI ESPACIO →
          </a>
        </section>
      )}
      {reviews.length > 0 && (
        <section className="section container evo">
          <h2>
            LO VIVIERON. <em>LO CUENTAN.</em>
          </h2>
          <div className="evo-grid">
            {reviews.map((x) => (
              <figure className="evo-card" key={x.id}>
                {x.avatar && (
                  <img
                    className="review-avatar"
                    src={x.avatar.url}
                    loading="lazy"
                    alt=""
                  />
                )}
                <p aria-label={`${x.stars} de 5 estrellas`}>
                  {"★".repeat(x.stars)}
                </p>
                <blockquote>{x.comment}</blockquote>
                <figcaption>
                  {x.name}
                  {x.sourceUrl && (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={x.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {x.source || "Ver fuente"}
                      </a>
                    </>
                  )}
                </figcaption>
                {x.video && (
                  <div className="evo-media">
                    <SiteAsset
                      asset={x.video}
                      alt={`Testimonio de ${x.name}`}
                    />
                  </div>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
export function RecommendationWizard({ content }: { content: SiteContent }) {
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Answers>({
      age: "",
      preferences: [],
      guests: "",
      space: "",
    });
  const [date, setDate] = useState(""),
    [district, setDistrict] = useState("");
  const labels = [
    "¿Para quién es la fiesta?",
    "¿Qué les gusta hacer?",
    "¿Cuántos invitados?",
    "¿Dónde será?",
  ];
  const options = [ageOptions, preferenceOptions, guestOptions, spaceOptions][
    Math.min(step, 3)
  ];
  const selected = [
    answers.age,
    answers.preferences,
    answers.guests,
    answers.space,
  ][Math.min(step, 3)];
  const results = recommend(content.experiences, answers);
  function pick(value: string) {
    const keys = ["age", "preferences", "guests", "space"] as const;
    const key = keys[step];
    setAnswers((a) => ({
      ...a,
      [key]:
        key === "preferences"
          ? a.preferences.includes(value)
            ? a.preferences.filter((x) => x !== value)
            : [...a.preferences, value]
          : value,
    }));
  }
  return (
    <section id="recomendador" className="section container evo">
      <p className="eyebrow">4 RESPUESTAS. UN BUEN PUNTO DE PARTIDA.</p>
      <h2>
        ENCUENTRA <em>TU FIESTA.</em>
      </h2>
      <div className="evo-panel" aria-live="polite">
        {step < 4 ? (
          <>
            <p>Paso {step + 1} de 4</p>
            <h3>{labels[step]}</h3>
            <div className="evo-options">
              {options.map((x) => (
                <button
                  key={x}
                  aria-pressed={
                    Array.isArray(selected)
                      ? selected.includes(x)
                      : selected === x
                  }
                  onClick={() => pick(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="evo-actions">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}>Anterior</button>
              )}
              <button
                className="button button-primary"
                disabled={!selected.length}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) trackEvent("recommendation_complete");
                }}
              >
                {step === 3 ? "VER RECOMENDACIONES" : "SIGUIENTE"} →
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>
              {answers.age === "Empresa/colegio"
                ? "Preparemos una propuesta para tu organización"
                : "Estas experiencias pueden interesarte"}
            </h3>
            <p>
              Orientación inicial. Confirmaremos montaje, aforo y disponibilidad
              según tu espacio.
            </p>
            <div className="evo-form">
              <label>
                Fecha aproximada (opcional)
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Distrito (opcional)
                <input
                  value={district}
                  maxLength={100}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </label>
            </div>
            <div className="evo-grid">
              {results.map(({ experience: x, reason }, i) => (
                <article className="evo-card" key={x.id}>
                  <small>
                    {i === 0 ? "NUESTRA SUGERENCIA" : "OTRA OPCIÓN"}
                  </small>
                  <h3>{x.name}</h3>
                  <strong>{displayPrice(x.price)}</strong>
                  <p>{reason}</p>
                  <a href={sitePath(`experiencias/${x.slug || x.id}/`)}>
                    Ver experiencia →
                  </a>
                  <a
                    className="button button-primary"
                    href={whatsappUrl(
                      messages.recommendation({
                        Experiencia: x.name,
                        Fecha: date || "Por definir",
                        Distrito: district || "Por definir",
                        Edad: answers.age,
                        Preferencias: answers.preferences.join(", "),
                        Invitados: answers.guests,
                        Espacio: answers.space,
                      }),
                      content.contact.phone,
                    )}
                  >
                    CONSULTAR
                  </a>
                </article>
              ))}
            </div>
            {answers.age === "Empresa/colegio" && (
              <a
                className="button button-primary"
                href={sitePath("eventos-corporativos-lima/")}
              >
                VER EVENTOS CORPORATIVOS
              </a>
            )}
            <button onClick={() => setStep(0)}>Cambiar respuestas</button>
          </>
        )}
      </div>
    </section>
  );
}
export function PartyBuilder({ content }: { content: SiteContent }) {
  const bases = content.experiences.filter((x) => x.enabled),
    addons = (content.evolution ?? evolutionDefaults).addons;
  const [baseId, setBaseId] = useState(bases[0]?.id ?? ""),
    [selected, setSelected] = useState<string[]>([]);
  const result = calculateParty(
    bases.find((x) => x.id === baseId),
    addons,
    selected,
  );
  if (!bases.length) return null;
  return (
    <section id="arma-tu-fiesta" className="section container evo">
      <p className="eyebrow">A TU MANERA</p>
      <h2>
        ARMA <em>TU EXPERIENCIA.</em>
      </h2>
      <div className="evo-panel">
        <label>
          1. Elige tu experiencia
          <select
            value={baseId}
            onChange={(e) => {
              setBaseId(e.target.value);
              setSelected([]);
            }}
          >
            {bases.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name} · {displayPrice(x.price)}
              </option>
            ))}
          </select>
        </label>
        {compatibleAddons(addons, baseId).length > 0 && (
          <fieldset>
            <legend>2. Agrega lo que más te gusta</legend>
            {compatibleAddons(addons, baseId).map((x) => (
              <label className="evo-addon" key={x.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(x.id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, x.id]
                        : selected.filter((id) => id !== x.id),
                    )
                  }
                />
                <span>
                  {x.image?.type === "image" && (
                    <img
                      src={x.image.url}
                      alt=""
                      loading="lazy"
                      width="64"
                      height="64"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <strong>{x.name}</strong>
                  <small>{x.description}</small>
                </span>
                <span>
                  {x.priceMode === "consult"
                    ? "Consultar"
                    : `${x.priceMode === "from" ? "Desde " : ""}${money(x.price ?? 0)}`}
                </span>
              </label>
            ))}
          </fieldset>
        )}
        <p>
          Base: {result.base?.name}
          {result.base?.time && ` · ${result.base.time}`}
        </p>
        <h3>
          {result.total === null
            ? "Precio a consultar"
            : `${result.from ? "Desde " : ""}${money(result.total)}`}
          {result.consult && result.total !== null
            ? " + adicionales por cotizar"
            : ""}
        </h3>
        <p>
          Precio referencial. Sujeto a fecha, distrito, espacio, condiciones
          técnicas y disponibilidad. La propuesta final se confirma por
          WhatsApp.
        </p>
        <a
          className="button button-primary"
          onClick={() => trackEvent("builder_complete", { base: baseId })}
          href={whatsappUrl(
            messages.builder({
              Experiencia: result.base?.name ?? "",
              Duración: result.base?.time || "Consultar",
              Adicionales:
                result.addons.map((x) => x.name).join(", ") ||
                "Sin adicionales",
              Estimado:
                result.total === null
                  ? "Consultar"
                  : `${money(result.total)}${result.consult ? " + por cotizar" : ""} (referencial)`,
            }),
            content.contact.phone,
          )}
        >
          ENVIAR MI CONFIGURACIÓN →
        </a>
      </div>
    </section>
  );
}
