export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL ||
  "https://mrfiestalima.github.io/mrfiesta-evolution/"
).replace(/\/*$/, "/");
export const BASE_URL = import.meta.env?.BASE_URL || "/mrfiesta-evolution/";
export function sitePath(path = "") {
  const target = `${BASE_URL}${path.replace(/^\/+/, "")}`;
  if (typeof location === "undefined") return target;
  const preview = new URLSearchParams(location.search).get("preview");
  if (!preview || !/^[a-f0-9-]{36}$/.test(preview)) return target;
  const url = new URL(target, "https://preview.invalid");
  url.searchParams.set("preview", preview);
  return url.pathname + url.search + url.hash;
}
export const canonical = (path = "") =>
  new URL(path.replace(/^\/+/, ""), SITE_URL).href;
export function routePath(pathname: string, base = BASE_URL) {
  if (!pathname.startsWith(base)) return "404";
  try {
    return decodeURIComponent(pathname.slice(base.length))
      .replace(/^\/+|\/+$/g, "")
      .replace(/^index\.html$/, "");
  } catch {
    return "404";
  }
}
