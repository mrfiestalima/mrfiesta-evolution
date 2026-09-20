import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImagePlus,
  Save,
  Upload,
  X,
} from "lucide-react";
import {
  defaultContent,
  sectionLabels,
  validateContent,
  type Asset,
  type SiteContent,
  type SectionKey,
} from "../data/siteContent";
import {
  getSiteDocument,
  listSiteAssets,
  openContentPreview,
  saveSiteDocument,
  uploadSiteAsset,
} from "../data/siteRepository";
import "./site-editor.css";

const tabs = [
  "Portada",
  "Experiencias",
  "Tecnología",
  "Live",
  "Textos y secciones",
  "Contacto",
  "Biblioteca",
] as const;
type Tab = (typeof tabs)[number];
const copyLabels: Record<string, string> = {
  Title: "Título",
  Accent: "Título destacado",
  Description: "Descripción",
  Button: "Texto del botón",
};
const groups = {
  hero: "Portada",
  statement: "Presentación",
  experiences: "Experiencias",
  technology: "Tecnología",
  live: "Live",
  events: "Celebraciones",
  proof: "Frase de marca",
  quote: "Cotización",
  faq: "Preguntas frecuentes",
  final: "Cierre",
  footer: "Pie de página",
  floating: "Botón flotante",
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="cms-field">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          maxLength={3000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          maxLength={3000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
function AssetThumb({ asset }: { asset: Asset }) {
  return asset.type === "video" ? (
    <video
      src={asset.url}
      controls
      playsInline
      preload="metadata"
      aria-label={asset.name}
    />
  ) : (
    <img src={asset.url} alt={asset.name} loading="lazy" />
  );
}

export default function SiteEditor({ demo = false }: { demo?: boolean }) {
  const [content, setContent] = useState<SiteContent>(() =>
    structuredClone(defaultContent),
  );
  const [baseline, setBaseline] = useState(JSON.stringify(defaultContent));
  const [draftRevision, setDraftRevision] = useState(0),
    [publishedRevision, setPublishedRevision] = useState(0);
  const [tab, setTab] = useState<Tab>("Portada"),
    [loading, setLoading] = useState(!demo),
    [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]),
    [assetsLoaded, setAssetsLoaded] = useState(false),
    [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(0);
  const [search, setSearch] = useState(""),
    [publishReview, setPublishReview] = useState(false);
  const [picker, setPicker] = useState<{
    label: string;
    set: (asset: Asset | null) => void;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(content) !== baseline;
  useEffect(() => {
    let live = true;
    if (!demo)
      Promise.all([getSiteDocument("draft"), getSiteDocument("published")])
        .then(([draft, published]) => {
          if (live) {
            setContent(draft.content);
            setBaseline(JSON.stringify(draft.content));
            setDraftRevision(draft.revision);
            setPublishedRevision(published.revision);
          }
        })
        .catch((e) => {
          if (live) {
            setError(e.message);
            setLoadFailed(true);
          }
        })
        .finally(() => {
          if (live) setLoading(false);
        });
    return () => {
      live = false;
    };
  }, [demo]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty || uploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploading]);
  useEffect(() => {
    if (!picker) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !uploading) setPicker(null);
      if (e.key === "Tab") {
        const elements = pickerRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input:not(:disabled),video[controls]",
        );
        if (elements?.length) {
          const first = elements[0],
            last = elements[elements.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      triggerRef.current?.focus();
    };
  }, [picker, uploading]);
  const change = (next: SiteContent) => {
    setContent(next);
    setMessage("");
    setPublishReview(false);
  };
  async function loadAssets() {
    if (demo) {
      setAssetsLoaded(true);
      return;
    }
    try {
      setAssets(await listSiteAssets());
      setAssetsLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function choose(label: string, set: (a: Asset | null) => void) {
    triggerRef.current = document.activeElement as HTMLElement;
    setPicker({ label, set });
    if (!assetsLoaded) void loadAssets();
  }
  async function upload(file: File) {
    setUploading(true);
    setError("");
    setProgress(0);
    try {
      const asset = await uploadSiteAsset(file, setProgress);
      setAssets((list) => [asset, ...list]);
      setMessage("Archivo subido. Selecciónalo para usarlo en una sección.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }
  async function save(kind: "draft" | "published") {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      validateContent(content);
      if (demo)
        throw new Error(
          "Esta es una demostración local. Conecta tu cuenta para guardar o publicar.",
        );
      if (kind === "published") {
        const draft = await saveSiteDocument("draft", content, draftRevision);
        setDraftRevision(draft.revision);
        setBaseline(JSON.stringify(content));
      }
      const result = await saveSiteDocument(
        kind,
        content,
        kind === "draft" ? draftRevision : publishedRevision,
      );
      if (kind === "draft") {
        setDraftRevision(result.revision);
        setBaseline(JSON.stringify(content));
      } else {
        setPublishedRevision(result.revision);
        setPublishReview(false);
      }
      setMessage(
        kind === "draft"
          ? "Borrador guardado. La web pública sigue igual."
          : "Cambios publicados. Se verán al abrir o recargar la web.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function preview() {
    try {
      openContentPreview(content);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const copyFields = (prefix: string) => (
    <div className="cms-fields">
      {Object.keys(defaultContent.copy)
        .filter((key) => key.startsWith(prefix))
        .map((key) => (
          <Field
            key={key}
            label={copyLabels[key.slice(prefix.length)] ?? key}
            value={content.copy[key as keyof SiteContent["copy"]]}
            multiline={key.endsWith("Description")}
            onChange={(value) =>
              change({ ...content, copy: { ...content.copy, [key]: value } })
            }
          />
        ))}
    </div>
  );
  const slot = (
    label: string,
    asset: Asset | null,
    set: (a: Asset | null) => void,
  ) => (
    <div className="cms-slot">
      <div className="cms-slot-preview">
        {asset ? (
          <AssetThumb asset={asset} />
        ) : (
          <div>
            <ImagePlus size={30} />
            <p>Agrega una foto o un video</p>
          </div>
        )}
      </div>
      <strong>{label}</strong>
      <small>
        {asset?.name ?? "Se mantiene el diseño gráfico de la sección."}
      </small>
      <div className="cms-row">
        <button
          type="button"
          className="admin-button secondary"
          onClick={() => choose(label, set)}
        >
          Elegir archivo
        </button>
        {asset && (
          <button
            type="button"
            className="cms-text-button"
            onClick={() => set(null)}
          >
            Quitar de esta sección
          </button>
        )}
      </div>
    </div>
  );
  const move = <T,>(list: T[], index: number, direction: number): T[] => {
    const next = [...list];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    return next;
  };
  const order = (
    index: number,
    length: number,
    onMove: (d: number) => void,
  ) => (
    <span className="cms-row">
      <button
        type="button"
        className="cms-icon-button"
        disabled={index === 0}
        aria-label="Mover arriba"
        onClick={() => onMove(-1)}
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        className="cms-icon-button"
        disabled={index === length - 1}
        aria-label="Mover abajo"
        onClick={() => onMove(1)}
      >
        <ArrowDown size={16} />
      </button>
    </span>
  );
  const library = (
    <>
      <div className="cms-row">
        <Field label="Buscar archivo" value={search} onChange={setSearch} />
        <label className="admin-button primary cms-upload">
          <Upload size={16} /> Subir archivo
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            disabled={demo || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
        <button
          type="button"
          className="admin-button secondary"
          onClick={() => void loadAssets()}
        >
          Actualizar
        </button>
      </div>
      <p className="cms-help">
        JPG, PNG y WebP hasta 20 MB · MP4 y WebM hasta 500 MB. Los archivos se
        guardan en Cloudflare y quedan disponibles mediante su enlace. Solo
        aparecen en la página cuando los asignas a una sección y publicas.
      </p>
      {uploading && (
        <div role="status">
          <progress value={progress} max={100} />
          <p>
            {progress < 100 ? `Subiendo ${progress}%…` : "Verificando archivo…"}
          </p>
        </div>
      )}
      <div className="cms-library">
        {assets
          .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
          .map((asset) => (
            <article key={asset.id}>
              <AssetThumb asset={asset} />
              <strong>{asset.name}</strong>
              <small>{asset.type === "video" ? "Video" : "Imagen"}</small>
              {picker && (
                <button
                  type="button"
                  className="admin-button primary"
                  onClick={() => {
                    picker.set(asset);
                    setPicker(null);
                  }}
                >
                  Usar este archivo
                </button>
              )}
            </article>
          ))}
      </div>
      {assetsLoaded && !assets.length && (
        <p className="cms-help">
          Tu biblioteca está vacía. Sube el primer archivo para empezar.
        </p>
      )}
    </>
  );
  if (loading) return <p role="status">Cargando el contenido de tu web…</p>;
  if (loadFailed)
    return (
      <div className="cms-notice" role="alert">
        {error}
        <p>
          No se cargó el borrador. Recarga cuando la conexión esté disponible.
        </p>
      </div>
    );
  return (
    <section className="cms">
      <header className="cms-heading">
        <div>
          <p className="admin-eyebrow">TU WEB, A TU MANERA</p>
          <h1>Contenido de la web</h1>
          <p>Controla cada sección sin tocar código.</p>
        </div>
        <a
          className="admin-button secondary"
          href="../"
          target="_blank"
          rel="noreferrer"
        >
          Ver web publicada ↗
        </a>
      </header>
      {demo && (
        <div className="cms-notice">
          Demostración local: puedes editar y previsualizar. Guardar, publicar y
          subir archivos requieren tu cuenta conectada.
        </div>
      )}
      <div className="cms-toolbar">
        <span>{dirty ? "● Cambios sin guardar" : "Borrador al día"}</span>
        <div className="cms-row">
          <button
            type="button"
            className="admin-button secondary"
            disabled={busy || uploading}
            onClick={preview}
          >
            <Eye size={15} /> Previsualizar
          </button>
          <button
            type="button"
            className="admin-button secondary"
            disabled={demo || busy || uploading}
            onClick={() => void save("draft")}
          >
            <Save size={15} /> Guardar borrador
          </button>
          <button
            type="button"
            className="admin-button primary"
            disabled={demo || busy || uploading}
            onClick={() => {
              try {
                validateContent(content);
                setPublishReview(true);
                setError("");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Publicar cambios
          </button>
        </div>
      </div>
      {publishReview && (
        <div className="cms-notice">
          <strong>Publicar esta versión</strong>
          <p>
            Los visitantes verán estos textos, precios, archivos y secciones.
            Revisa la vista previa antes de confirmar.
          </p>
          <div className="cms-row">
            <button
              className="admin-button primary"
              disabled={busy}
              onClick={() => void save("published")}
            >
              Confirmar publicación
            </button>
            <button
              className="admin-button secondary"
              onClick={() => setPublishReview(false)}
            >
              Seguir editando
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="cms-success" role="status">
          {message}
        </p>
      )}
      <div className="cms-layout">
        <nav className="cms-nav" aria-label="Secciones del administrador">
          {tabs.map((t) => (
            <button
              key={t}
              aria-current={tab === t ? "page" : undefined}
              onClick={() => {
                setTab(t);
                if (t === "Biblioteca" && !assetsLoaded) void loadAssets();
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="cms-body">
          <h2>{tab}</h2>
          {tab === "Portada" && (
            <>
              {copyFields("hero")}
              {slot("Imagen o video de inicio", content.heroAsset, (a) =>
                change({ ...content, heroAsset: a }),
              )}
            </>
          )}
          {tab === "Live" && (
            <>
              {copyFields("live")}
              {slot(
                "Imagen o video de MR Fiesta Live",
                content.liveAsset,
                (a) => change({ ...content, liveAsset: a }),
              )}
            </>
          )}
          {tab === "Experiencias" && (
            <>
              {copyFields("experiences")}
              {content.experiences.map((item, index) => (
                <details className="cms-card" key={item.id}>
                  <summary>
                    {String(index + 1).padStart(2, "0")} · {item.name}{" "}
                    <span>{item.enabled ? "Visible" : "Oculto"}</span>
                  </summary>
                  <div className="cms-card-content">
                    <div className="cms-row">
                      <label>
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) =>
                            change({
                              ...content,
                              experiences: content.experiences.map((i) =>
                                i.id === item.id
                                  ? { ...i, enabled: e.target.checked }
                                  : i,
                              ),
                            })
                          }
                        />{" "}
                        Mostrar paquete
                      </label>
                      {order(index, content.experiences.length, (d) =>
                        change({
                          ...content,
                          experiences: move(content.experiences, index, d),
                        }),
                      )}
                    </div>
                    {(["name", "price", "time", "desc"] as const).map((key) => (
                      <Field
                        key={key}
                        label={
                          {
                            name: "Nombre",
                            price: "Precio visible (ej. S/750)",
                            time: "Duración",
                            desc: "Descripción",
                          }[key]
                        }
                        value={item[key]}
                        multiline={key === "desc"}
                        onChange={(value) =>
                          change({
                            ...content,
                            experiences: content.experiences.map((i) =>
                              i.id === item.id ? { ...i, [key]: value } : i,
                            ),
                          })
                        }
                      />
                    ))}
                    <Field
                      label="Etiquetas separadas por comas"
                      value={item.tags.join(",")}
                      onChange={(value) =>
                        change({
                          ...content,
                          experiences: content.experiences.map((i) =>
                            i.id === item.id
                              ? { ...i, tags: value.split(",") }
                              : i,
                          ),
                        })
                      }
                    />
                    {slot(`Archivo de ${item.name}`, item.asset, (a) =>
                      change({
                        ...content,
                        experiences: content.experiences.map((i) =>
                          i.id === item.id ? { ...i, asset: a } : i,
                        ),
                      }),
                    )}
                  </div>
                </details>
              ))}
              <button
                className="admin-button secondary"
                disabled={content.experiences.length >= 30}
                onClick={() =>
                  change({
                    ...content,
                    experiences: [
                      ...content.experiences,
                      {
                        id: crypto.randomUUID(),
                        name: "Nueva experiencia",
                        price: "Consultar",
                        time: "",
                        desc: "",
                        tags: [],
                        enabled: false,
                        asset: null,
                      },
                    ],
                  })
                }
              >
                + Agregar experiencia
              </button>
            </>
          )}
          {tab === "Tecnología" && (
            <>
              {copyFields("technology")}
              {content.technology.map((item, index) => (
                <details className="cms-card" key={item.id}>
                  <summary>
                    {item.name}{" "}
                    <span>{item.enabled ? "Visible" : "Oculto"}</span>
                  </summary>
                  <div className="cms-card-content">
                    <div className="cms-row">
                      <label>
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) =>
                            change({
                              ...content,
                              technology: content.technology.map((i) =>
                                i.id === item.id
                                  ? { ...i, enabled: e.target.checked }
                                  : i,
                              ),
                            })
                          }
                        />{" "}
                        Mostrar elemento
                      </label>
                      {order(index, content.technology.length, (d) =>
                        change({
                          ...content,
                          technology: move(content.technology, index, d),
                        }),
                      )}
                    </div>
                    <Field
                      label="Nombre"
                      value={item.name}
                      onChange={(value) =>
                        change({
                          ...content,
                          technology: content.technology.map((i) =>
                            i.id === item.id ? { ...i, name: value } : i,
                          ),
                        })
                      }
                    />
                    {slot(item.name, item.asset, (a) =>
                      change({
                        ...content,
                        technology: content.technology.map((i) =>
                          i.id === item.id ? { ...i, asset: a } : i,
                        ),
                      }),
                    )}
                  </div>
                </details>
              ))}
              <button
                className="admin-button secondary"
                disabled={content.technology.length >= 30}
                onClick={() =>
                  change({
                    ...content,
                    technology: [
                      ...content.technology,
                      {
                        id: crypto.randomUUID(),
                        name: "Nueva tecnología",
                        enabled: false,
                        asset: null,
                      },
                    ],
                  })
                }
              >
                + Agregar tecnología
              </button>
            </>
          )}
          {tab === "Textos y secciones" && (
            <>
              <div className="cms-visibility">
                {Object.entries(sectionLabels).map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={content.visible[key as SectionKey]}
                      onChange={(e) =>
                        change({
                          ...content,
                          visible: {
                            ...content.visible,
                            [key]: e.target.checked,
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              {Object.entries(groups)
                .filter(
                  ([prefix]) =>
                    !["hero", "experiences", "technology", "live"].includes(
                      prefix,
                    ),
                )
                .map(([prefix, label]) => (
                  <details className="cms-card" key={prefix}>
                    <summary>{label}</summary>
                    <div className="cms-card-content">{copyFields(prefix)}</div>
                  </details>
                ))}
              <h3>Por qué elegirnos</h3>
              {content.facts.map((item, index) => (
                <div className="cms-card-content cms-card" key={item.id}>
                  <Field
                    label="Título"
                    value={item.title}
                    onChange={(v) =>
                      change({
                        ...content,
                        facts: content.facts.map((i) =>
                          i.id === item.id ? { ...i, title: v } : i,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Descripción"
                    value={item.description}
                    multiline
                    onChange={(v) =>
                      change({
                        ...content,
                        facts: content.facts.map((i) =>
                          i.id === item.id ? { ...i, description: v } : i,
                        ),
                      })
                    }
                  />
                  {order(index, content.facts.length, (d) =>
                    change({
                      ...content,
                      facts: move(content.facts, index, d),
                    }),
                  )}
                </div>
              ))}
              <h3>Preguntas y respuestas</h3>
              {content.faq.map((item, index) => (
                <div className="cms-card cms-card-content" key={item.id}>
                  <Field
                    label="Pregunta"
                    value={item.question}
                    onChange={(v) =>
                      change({
                        ...content,
                        faq: content.faq.map((i) =>
                          i.id === item.id ? { ...i, question: v } : i,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Respuesta"
                    value={item.answer}
                    multiline
                    onChange={(v) =>
                      change({
                        ...content,
                        faq: content.faq.map((i) =>
                          i.id === item.id ? { ...i, answer: v } : i,
                        ),
                      })
                    }
                  />
                  <div className="cms-row">
                    {order(index, content.faq.length, (d) =>
                      change({ ...content, faq: move(content.faq, index, d) }),
                    )}
                    <button
                      className="cms-text-button"
                      onClick={() =>
                        change({
                          ...content,
                          faq: content.faq.filter((i) => i.id !== item.id),
                        })
                      }
                    >
                      Quitar pregunta del borrador
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="admin-button secondary"
                disabled={content.faq.length >= 30}
                onClick={() =>
                  change({
                    ...content,
                    faq: [
                      ...content.faq,
                      {
                        id: crypto.randomUUID(),
                        question: "Nueva pregunta",
                        answer: "",
                      },
                    ],
                  })
                }
              >
                + Agregar pregunta
              </button>
            </>
          )}
          {tab === "Contacto" && (
            <>
              <p className="cms-help">
                Este número se usa en todos los botones de WhatsApp, incluido el
                formulario de cotización.
              </p>
              <Field
                label="WhatsApp con código de país, sin + ni espacios"
                value={content.contact.phone}
                onChange={(v) =>
                  change({
                    ...content,
                    contact: { ...content.contact, phone: v },
                  })
                }
              />
              {(["instagram", "facebook", "tiktok"] as const).map((key) => (
                <Field
                  key={key}
                  label={`${key} · enlace completo (opcional)`}
                  value={content.contact[key]}
                  onChange={(v) =>
                    change({
                      ...content,
                      contact: { ...content.contact, [key]: v },
                    })
                  }
                />
              ))}
            </>
          )}
          {tab === "Biblioteca" && library}
        </div>
      </div>
      {picker && (
        <div
          className="cms-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Elegir archivo: ${picker.label}`}
        >
          <div className="cms-picker" ref={pickerRef}>
            <header className="cms-row">
              <h2>{picker.label}</h2>
              <button
                autoFocus
                className="cms-icon-button"
                disabled={uploading}
                aria-label="Cerrar biblioteca"
                onClick={() => setPicker(null)}
              >
                <X />
              </button>
            </header>
            {error && (
              <p role="alert" className="cms-error">
                {error}
              </p>
            )}
            {library}
          </div>
        </div>
      )}
    </section>
  );
}
