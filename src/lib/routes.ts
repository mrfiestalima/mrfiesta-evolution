import type { SiteContent, Experience, Technology } from "../data/siteContent";
import type { Celebration } from "../types/celebrations";
import type { Landing } from "../types/evolution";
export type Page =
  | { kind: "home" | "events" | "notFound"; path: string }
  | { kind: "landing"; path: string; item: Landing }
  | { kind: "experience"; path: string; item: Experience }
  | { kind: "technology"; path: string; item: Technology }
  | { kind: "event"; path: string; item: Celebration };
export function pages(content: SiteContent, events: Celebration[]): Page[] {
  return [
    { kind: "home", path: "" },
    { kind: "events", path: "eventos/" },
    ...(content.evolution?.landings ?? [])
      .filter((x) => x.enabled)
      .map((item) => ({
        kind: "landing" as const,
        path: `${item.slug}/`,
        item,
      })),
    ...content.experiences
      .filter((x) => x.enabled)
      .map((item) => ({
        kind: "experience" as const,
        path: `experiencias/${item.slug || item.id}/`,
        item,
      })),
    ...content.technology
      .filter((x) => x.enabled)
      .map((item) => ({
        kind: "technology" as const,
        path: `tecnologia/${item.slug || item.id}/`,
        item,
      })),
    ...events
      .filter((x) => x.published)
      .map((item) => ({
        kind: "event" as const,
        path: `eventos/${item.slug}/`,
        item,
      })),
  ];
}
export function resolvePage(
  path: string,
  content: SiteContent,
  events: Celebration[],
): Page {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return (
    pages(content, events).find(
      (x) => x.path.replace(/\/$/, "") === normalized,
    ) ?? { kind: "notFound", path: normalized }
  );
}
