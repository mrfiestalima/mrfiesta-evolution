import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import LandingPage from "./pages/LandingPage";
import { defaultContent, type SiteContent } from "./data/siteContent";
import { getPublicContent, readContentPreview } from "./data/siteRepository";
import {
  getPublishedCelebrations,
  getCelebrationBySlug,
} from "./data/celebrationsRepository";
import type { Celebration } from "./types/celebrations";
import { routePath } from "./lib/site";
import { resolvePage } from "./lib/routes";
import { pageSeo } from "./lib/seo";
import { installTracking, trackEvent } from "./lib/analytics";
export type Bootstrap = {
  content: SiteContent;
  events: Celebration[];
  path: string;
};
export default function App({ initial }: { initial?: Bootstrap }) {
  const [preview] = useState(readContentPreview);
  const [content, setContent] = useState(
    preview ?? initial?.content ?? defaultContent,
  );
  const [events, setEvents] = useState(initial?.events ?? []);
  const path =
    typeof location === "undefined"
      ? (initial?.path ?? "")
      : routePath(location.pathname);
  const page = resolvePage(path, content, events);
  useEffect(() => {
    let active = true;
    if (!preview)
      void getPublicContent().then((c) => {
        if (active) setContent(c);
      });
    void getPublishedCelebrations()
      .then(async (list) => {
        if (path.startsWith("eventos/")) {
          const full = await getCelebrationBySlug(path.split("/")[1]);
          if (full) list = list.map((x) => (x.id === full.id ? full : x));
        }
        if (active) setEvents(list);
      })
      .catch(() => {
        /* Preserve prerendered content during a temporary outage. */
      });
    return () => {
      active = false;
    };
  }, [preview, path]);
  useEffect(installTracking, []);
  useEffect(() => {
    const seo = pageSeo(page, content);
    document.title = seo.title;
    if (preview) {
      const tag = document.createElement("meta");
      tag.name = "robots";
      tag.content = "noindex,nofollow";
      document.head.append(tag);
      return () => tag.remove();
    }
  }, [page.kind, page.path, preview, content]);
  useEffect(() => {
    if (preview) return;
    if (page.kind === "experience")
      trackEvent("experience_view", { id: page.item.id });
    if (page.kind === "event") trackEvent("event_view", { id: page.item.id });
  }, [page.kind, page.path, preview]);
  return page.kind === "home" ? (
    <HomePage content={content} celebrations={events} preview={!!preview} />
  ) : (
    <LandingPage page={page} content={content} events={events} />
  );
}
