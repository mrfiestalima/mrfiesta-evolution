import { supabase } from "../lib/supabase";
import {
  defaultContent,
  validateContent,
  type SiteContent,
  type Asset,
} from "./siteContent";
import type { Json } from "../types/supabase";
import { uploadToR2 } from "./adminMediaRepository";

export type DocumentState = { content: SiteContent; revision: number };
const requireClient = () => {
  if (!supabase)
    throw new Error("La conexión de contenido no está configurada.");
  return supabase;
};
const decode = (data: Json) =>
  Object.keys(data as object).length
    ? validateContent(data)
    : structuredClone(defaultContent);
export async function getSiteDocument(
  kind: "draft" | "published",
): Promise<DocumentState> {
  const { data, error } = await requireClient()
    .from("site_documents")
    .select("*")
    .eq("kind", kind)
    .single();
  if (error || !data)
    throw new Error(
      "No se pudo cargar el contenido. Comprueba la conexión y la instalación del administrador.",
    );
  return { content: decode(data.content), revision: data.revision };
}
export async function getPublicContent(): Promise<SiteContent> {
  if (!supabase) return structuredClone(defaultContent);
  try {
    return (await getSiteDocument("published")).content;
  } catch {
    return structuredClone(defaultContent);
  }
}
export async function saveSiteDocument(
  kind: "draft" | "published",
  content: SiteContent,
  revision: number,
): Promise<DocumentState> {
  validateContent(content);
  const { data, error } = await requireClient().rpc("save_site_document", {
    target_kind: kind,
    payload: content as unknown as Json,
    expected_revision: revision,
  });
  if (error || !data?.[0])
    throw new Error(
      error?.message.includes("CONTENT_CONFLICT")
        ? "Otra sesión cambió el contenido. Recarga el panel antes de guardar para no sobrescribir sus cambios."
        : "No se pudo guardar. Tu edición permanece en pantalla; revisa la conexión e inténtalo de nuevo.",
    );
  return { content: decode(data[0].content), revision: data[0].revision };
}
export async function listSiteAssets(): Promise<Asset[]> {
  const client = requireClient();
  const [library, events] = await Promise.all([
    client
      .from("site_assets")
      .select("*")
      .eq("ready", true)
      .order("created_at", { ascending: false }),
    client
      .from("media")
      .select("id,url,type,alt")
      .order("created_at", { ascending: false }),
  ]);
  if (library.error || events.error)
    throw new Error("No se pudo cargar la biblioteca de archivos.");
  const assets: Asset[] = [
    ...(library.data ?? []).map((row) => ({
      id: row.id,
      url: row.url,
      type: row.type as Asset["type"],
      name: row.name,
    })),
    ...(events.data ?? []).map((row) => ({
      id: `event-${row.id}`,
      url: row.url,
      type: row.type as Asset["type"],
      name: row.alt || "Archivo de celebración",
    })),
    ...(defaultContent.heroAsset ? [defaultContent.heroAsset] : []),
  ];
  return [...new Map(assets.map((asset) => [asset.url, asset])).values()];
}
export async function uploadSiteAsset(
  file: File,
  progress: (n: number) => void,
): Promise<Asset> {
  const contentType = file.type.split(";")[0];
  const image = ["image/jpeg", "image/png", "image/webp"].includes(contentType);
  if (!image && !["video/mp4", "video/webm"].includes(contentType))
    throw new Error("Usa JPG, PNG, WebP, MP4 o WebM.");
  if (!file.size || file.size > (image ? 20 : 500) * 1024 * 1024)
    throw new Error(
      `El archivo debe pesar entre 1 byte y ${image ? 20 : 500} MB.`,
    );
  const client = requireClient();
  const { data, error } = await client.functions.invoke("site-media", {
    body: {
      operation: "prepare",
      name: file.name,
      contentType,
      size: file.size,
    },
  });
  if (error || !data?.uploadUrl || !data?.id)
    throw new Error(
      "No se pudo preparar la subida. Revisa que Cloudflare esté conectado.",
    );
  await uploadToR2(
    data.uploadUrl,
    new File([file], file.name, { type: contentType }),
    progress,
  );
  const result = await client.functions.invoke("site-media", {
    body: { operation: "complete", id: data.id },
  });
  if (result.error || !result.data?.asset)
    throw new Error(
      "El archivo llegó al almacenamiento, pero no pudo verificarse. No se asignó a la web; vuelve a intentarlo.",
    );
  return result.data.asset as Asset;
}
export function openContentPreview(content: SiteContent) {
  validateContent(content);
  const id = crypto.randomUUID();
  localStorage.setItem(
    `mrfiesta-preview-${id}`,
    JSON.stringify({ content, expires: Date.now() + 3600000 }),
  );
  window.open(
    `${import.meta.env.BASE_URL}?preview=${id}`,
    "_blank",
    "noopener,noreferrer",
  );
}
export function readContentPreview(): SiteContent | null {
  const id = new URLSearchParams(location.search).get("preview");
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) return null;
  try {
    const item = JSON.parse(
      localStorage.getItem(`mrfiesta-preview-${id}`) ?? "null",
    );
    return item?.expires > Date.now() ? validateContent(item.content) : null;
  } catch {
    return null;
  }
}
