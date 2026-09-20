import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useWhatsAppUrl } from "./ContactContext";
import { copyDefaults } from "../data/siteContent";

export function QuoteForm({
  experiences,
  copy = copyDefaults,
}: {
  experiences: string[];
  copy?: typeof copyDefaults;
}) {
  const whatsappUrl = useWhatsAppUrl();
  const [prepared, setPrepared] = useState<string | null>(null);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || "").trim();
    const date = value("date")
      ? value("date").split("-").reverse().join("/")
      : "Por definir";
    setPrepared(
      whatsappUrl(
        `Hola 👋 Quiero cotizar mi fiesta con MR FIESTA.\n\nExperiencia: ${value("experience")}\nFecha: ${date}\nDistrito: ${value("district")}\nEdad: ${value("age") || "Por definir"}\nInvitados: ${value("guests") || "Por definir"}\n${value("details") ? `Detalles: ${value("details")}\n` : ""}\n¿Me ayudan a revisar disponibilidad y preparar una propuesta?`,
      ),
    );
  }
  return (
    <section
      className="quote-section section"
      id="cotizar"
      aria-labelledby="quote-title"
    >
      <div className="container quote-layout">
        <div>
          <p className="eyebrow">TU FIESTA EMPIEZA AQUÍ</p>
          <h2 id="quote-title">
            {copy.quoteTitle}
            <br />
            <em>{copy.quoteAccent}</em>
          </h2>
          <p className="quote-intro">{copy.quoteDescription}</p>
          <ul className="quote-benefits">
            <li>
              <Check size={16} /> Elige una experiencia o pide orientación.
            </li>
            <li>
              <Check size={16} /> Revisamos fecha, espacio y detalles contigo.
            </li>
            <li>
              <Check size={16} /> Recibe una propuesta para tu celebración.
            </li>
          </ul>
          <p className="quote-note">
            La consulta no confirma una reserva. La disponibilidad y el importe
            final se coordinan con nuestro equipo.
          </p>
        </div>
        <form
          className="quote-form"
          onSubmit={prepare}
          onChange={() => setPrepared(null)}
        >
          <label className="quote-wide">
            ¿Qué experiencia te interesa?
            <select name="experience" defaultValue="Ayúdenme a elegir">
              <option>Ayúdenme a elegir</option>
              {experiences.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Fecha aproximada
            <input name="date" type="date" min={today} />
          </label>
          <label>
            Distrito <span>(obligatorio)</span>
            <input
              name="district"
              required
              maxLength={80}
              pattern=".*\S.*"
              placeholder="Ej. San Miguel"
              autoComplete="address-level2"
            />
          </label>
          <label>
            Edad del cumpleañero/a
            <input
              name="age"
              type="number"
              min="1"
              max="120"
              placeholder="Ej. 12"
            />
          </label>
          <label>
            Número de invitados
            <input
              name="guests"
              type="number"
              min="1"
              max="10000"
              placeholder="Ej. 25"
            />
          </label>
          <label className="quote-wide">
            ¿Algo más que debamos saber?
            <textarea
              name="details"
              rows={3}
              maxLength={600}
              placeholder="Tipo de celebración, espacio disponible, temática…"
            />
          </label>
          <button className="button button-primary quote-wide" type="submit">
            PREPARAR MI CONSULTA <ArrowUpRight size={18} />
          </button>
          {prepared && (
            <div className="quote-ready quote-wide" role="status">
              <p>
                Tu consulta está lista. Podrás revisar el mensaje antes de
                enviarlo.
              </p>
              <a
                className="button"
                href={prepared}
                target="_blank"
                rel="noopener noreferrer"
              >
                ABRIR WHATSAPP <ArrowUpRight size={18} />
              </a>
            </div>
          )}
          <small className="quote-wide">
            Estos datos se usan para preparar tu mensaje. No se guardan en esta
            web.
          </small>
        </form>
      </div>
    </section>
  );
}
