import { ageOptions, preferenceOptions } from "../data/recommendationRules";
import { useState, type ReactNode } from "react";
import type { SiteContent, Asset } from "../data/siteContent";
import { evolutionDefaults } from "../data/evolution";
import type { EvolutionContent } from "../types/evolution";
type Module = Exclude<
  keyof EvolutionContent,
  "showBuilder" | "showRecommendation"
>;
const labels: Record<Module, string> = {
  stats: "Estadísticas",
  testimonials: "Testimonios",
  beforeAfter: "Antes / después",
  addons: "Adicionales",
  ageGuides: "Guía por edades",
  corporateClients: "Clientes corporativos",
  landings: "Páginas y SEO",
};
const fields: Record<string, string> = {
  value: "Valor real",
  suffix: "Sufijo",
  label: "Etiqueta",
  name: "Nombre",
  comment: "Comentario real",
  stars: "Estrellas (1–5)",
  source: "Fuente",
  sourceUrl: "Enlace a la fuente",
  eventId: "ID de celebración relacionada",
  avatar: "Foto",
  video: "Video",
  title: "Título",
  description: "Descripción",
  district: "Distrito",
  before: "Antes (imagen)",
  after: "Después (imagen)",
  price: "Precio",
  image: "Imagen",
  compatibleWith: "IDs de experiencias compatibles (vacío = todas)",
  priceMode: "Modalidad del precio",
  activities: "Actividades",
  logo: "Logo",
  slug: "Slug de URL",
  intro: "Introducción",
  sections: "Secciones",
  experienceIds: "IDs de experiencias relacionadas",
  asset: "Imagen o video",
  seoTitle: "Título SEO",
  seoDescription: "Descripción SEO",
  cta: "Texto del botón",
  kind: "Tipo de página",
  subtitle: "Subtítulo",
  included: "Incluye",
  ages: "Edades recomendadas",
  guests: "Invitados de referencia",
  preferences: "Preferencias del recomendador",
  featured: "Destacado",
  eventIds: "IDs de celebraciones relacionadas",
  space: "Espacio",
  celebrationType: "Tipo de celebración",
  experienceId: "ID de experiencia",
  challenge: "El reto",
  solution: "La solución",
  result: "El resultado",
  services: "Servicios utilizados",
  tags: "Etiquetas",
  testimonial: "Testimonio real",
};
const templates: Record<Module, Record<string, unknown>> = {
  stats: { value: "", suffix: "", label: "" },
  testimonials: {
    name: "",
    comment: "",
    stars: 5,
    source: "",
    sourceUrl: "",
    eventId: "",
    avatar: null,
    video: null,
  },
  beforeAfter: {
    title: "",
    description: "",
    district: "",
    eventId: "",
    before: null,
    after: null,
  },
  addons: {
    name: "",
    price: 0,
    description: "",
    image: null,
    compatibleWith: [],
    priceMode: "fixed",
  },
  ageGuides: { title: "", description: "", activities: [] },
  corporateClients: { name: "", logo: null },
  landings: {
    slug: "",
    title: "",
    description: "",
    intro: "",
    sections: [],
    experienceIds: [],
    asset: null,
    seoTitle: "",
    seoDescription: "",
    cta: "CONSULTAR",
    kind: "service",
  },
};
type Slot = (
  label: string,
  asset: Asset | null,
  onChange: (a: Asset | null) => void,
) => ReactNode;
export function RecordFields({
  record,
  onChange,
  slot,
}: {
  record: Record<string, unknown>;
  onChange: (r: Record<string, unknown>) => void;
  slot?: Slot;
}) {
  const update = (key: string, value: unknown) =>
    onChange({ ...record, [key]: value });
  return (
    <div className="cms-fields">
      {Object.entries(record)
        .filter(([key]) => !["id", "enabled"].includes(key))
        .map(([key, value]) => {
          const label = fields[key] || key;
          if (
            [
              "avatar",
              "video",
              "before",
              "after",
              "image",
              "logo",
              "asset",
            ].includes(key)
          )
            return (
              <div key={key}>
                {slot?.(label, value as Asset | null, (a) => update(key, a))}
              </div>
            );
          if (key === "sections")
            return (
              <div key={key}>
                <h4>Secciones de contenido</h4>
                {(value as { title: string; body: string }[]).map((s, i) => (
                  <div className="cms-card" key={i}>
                    <label className="cms-field">
                      Título
                      <input
                        value={s.title}
                        onChange={(e) =>
                          update(
                            key,
                            (value as object[]).map((x, n) =>
                              n === i ? { ...x, title: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="cms-field">
                      Texto
                      <textarea
                        rows={5}
                        value={s.body}
                        onChange={(e) =>
                          update(
                            key,
                            (value as object[]).map((x, n) =>
                              n === i ? { ...x, body: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          key,
                          (value as object[]).filter((_, n) => n !== i),
                        )
                      }
                    >
                      Quitar sección
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update(key, [
                      ...(value as object[]),
                      { title: "", body: "" },
                    ])
                  }
                >
                  Agregar sección
                </button>
              </div>
            );
          if (typeof value === "boolean")
            return (
              <label key={key} className="cms-check">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => update(key, e.target.checked)}
                />
                {label}
              </label>
            );
          if (key === "priceMode" || key === "kind")
            return (
              <label key={key} className="cms-field">
                {label}
                <select
                  value={String(value)}
                  onChange={(e) => update(key, e.target.value)}
                >
                  {(key === "priceMode"
                    ? [
                        ["fixed", "Precio fijo"],
                        ["from", "Desde"],
                        ["consult", "Consultar"],
                      ]
                    : [
                        ["service", "Servicio"],
                        ["corporate", "Corporativo"],
                        ["live", "Live"],
                        ["ages", "Guía por edades"],
                        ["spaces", "Evaluación de espacio"],
                      ]
                  ).map(([v, t]) => (
                    <option key={v} value={v}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            );
          if (typeof value === "number" || value === null)
            return (
              <label key={key} className="cms-field">
                {label}
                <input
                  type="number"
                  min={key === "stars" ? 1 : 0}
                  max={key === "stars" ? 5 : undefined}
                  step={key === "price" ? "0.01" : "1"}
                  value={value ?? ""}
                  onChange={(e) =>
                    update(
                      key,
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </label>
            );
          if (Array.isArray(value) && ["ages", "preferences"].includes(key))
            return (
              <fieldset key={key}>
                <legend>{label}</legend>
                {(key === "ages"
                  ? ageOptions.filter((x) => x !== "Empresa/colegio")
                  : preferenceOptions
                ).map((option) => (
                  <label className="cms-check" key={option}>
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      onChange={(e) =>
                        update(
                          key,
                          e.target.checked
                            ? [...value, option]
                            : value.filter((x) => x !== option),
                        )
                      }
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
            );
          if (Array.isArray(value))
            return (
              <label key={key} className="cms-field">
                {label} · Un elemento por línea
                <textarea
                  rows={3}
                  value={value.join("\n")}
                  onChange={(e) => update(key, e.target.value.split("\n"))}
                />
              </label>
            );
          return (
            <label className="cms-field" key={key}>
              {label}
              <textarea
                rows={
                  [
                    "intro",
                    "description",
                    "comment",
                    "challenge",
                    "solution",
                    "result",
                    "testimonial",
                  ].includes(key)
                    ? 4
                    : 2
                }
                maxLength={5000}
                value={String(value ?? "")}
                onChange={(e) => update(key, e.target.value)}
              />
            </label>
          );
        })}
    </div>
  );
}
export default function EvolutionEditor({
  content,
  onChange,
  slot,
}: {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  slot: Slot;
}) {
  const [module, setModule] = useState<Module>("stats");
  const e = content.evolution ?? evolutionDefaults;
  const list = e[module] as unknown as Record<string, unknown>[];
  const changeList = (next: Record<string, unknown>[]) =>
    onChange({ ...content, evolution: { ...e, [module]: next } });
  return (
    <>
      <nav className="cms-tabs" aria-label="Módulos Evolution">
        {Object.entries(labels).map(([key, label]) => (
          <button
            key={key}
            aria-current={module === key ? "page" : undefined}
            onClick={() => setModule(key as Module)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="cms-card">
        <h2>Recomendador y armador de fiesta</h2>
        {(["showRecommendation", "showBuilder"] as const).map((key) => (
          <label key={key} className="cms-check">
            <input
              type="checkbox"
              checked={e[key]}
              onChange={(event) =>
                onChange({
                  ...content,
                  evolution: { ...e, [key]: event.target.checked },
                })
              }
            />
            {key === "showRecommendation"
              ? "Mostrar recomendador"
              : "Mostrar armador de fiesta"}
          </label>
        ))}
        <p>
          Las reglas usan edades y preferencias de cada experiencia. Los
          adicionales se configuran abajo. Los precios siempre son
          referenciales.
        </p>
      </div>
      <h2>{labels[module]}</h2>
      {["addons", "landings"].includes(module) && (
        <p>
          Experiencias disponibles:{" "}
          {content.experiences.map((x) => `${x.name} (${x.id})`).join(" · ")}
        </p>
      )}
      <p>
        Publica solo datos reales. Las secciones sin contenido no aparecen.
        Guarda el borrador y usa Vista previa antes de publicar. Los cambios de
        páginas requieren regenerar el sitio para actualizar su HTML y sitemap.
      </p>
      {list.map((item, i) => (
        <details className="cms-card" key={String(item.id)}>
          <summary>
            {String(
              item.name || item.title || item.label || `Elemento ${i + 1}`,
            )}{" "}
            · {item.enabled ? "Habilitado" : "Oculto"}
          </summary>
          <div className="cms-row">
            <h3>
              {String(
                item.name || item.title || item.label || `Elemento ${i + 1}`,
              )}
            </h3>
            <button
              aria-label="Mover arriba"
              disabled={i === 0}
              onClick={() => {
                const next = [...list];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                changeList(next);
              }}
            >
              ↑
            </button>
            <button
              aria-label="Mover abajo"
              disabled={i === list.length - 1}
              onClick={() => {
                const next = [...list];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                changeList(next);
              }}
            >
              ↓
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "¿Quitar este elemento del borrador? Los archivos permanecerán en la biblioteca.",
                  )
                )
                  changeList(list.filter((_, n) => n !== i));
              }}
            >
              Eliminar
            </button>
          </div>
          <small>ID: {String(item.id)}</small>
          <label className="cms-check">
            <input
              type="checkbox"
              checked={!!item.enabled}
              onChange={(event) =>
                changeList(
                  list.map((x, n) =>
                    n === i ? { ...x, enabled: event.target.checked } : x,
                  ),
                )
              }
            />
            Habilitado
          </label>
          <RecordFields
            record={item}
            slot={slot}
            onChange={(next) =>
              changeList(list.map((x, n) => (n === i ? next : x)))
            }
          />
        </details>
      ))}
      <button
        className="admin-button primary"
        onClick={() =>
          changeList([
            ...list,
            {
              id: crypto.randomUUID(),
              enabled: false,
              ...structuredClone(templates[module]),
            },
          ])
        }
      >
        AGREGAR {labels[module].toUpperCase()}
      </button>
    </>
  );
}
