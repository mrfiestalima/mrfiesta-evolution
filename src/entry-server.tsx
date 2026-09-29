import { renderToString } from "react-dom/server";
import HomePage from "./HomePage";
import LandingPage from "./pages/LandingPage";
import {
  defaultContent,
  validateContent,
  upgradeContent,
} from "./data/siteContent";
import {
  mapCelebration,
  type CelebrationWithMedia,
} from "./data/celebrationsRepository";
import { pages, type Page } from "./lib/routes";
import { seoHead, safeJson } from "./lib/seo";
import { canonical } from "./lib/site";
export function prepare(document: unknown, rows: CelebrationWithMedia[]) {
  const content =
    document && Object.keys(document as object).length
      ? upgradeContent(validateContent(document))
      : structuredClone(defaultContent);
  const events = rows.map(mapCelebration).filter((x) => x.published);
  const routes = pages(content, events);
  function render(page: Page) {
    // Only the selected event needs its gallery in the bootstrap payload.
    const summaries = events.map((x) => ({
      ...x,
      media: page.kind === "event" && page.item.id === x.id ? x.media : [],
    }));
    const html = renderToString(
      page.kind === "home" ? (
        <HomePage content={content} celebrations={summaries} />
      ) : (
        <LandingPage page={page} content={content} events={summaries} />
      ),
    );
    return {
      html,
      head: seoHead(page, content),
      bootstrap: safeJson({ content, events: summaries, path: page.path }),
    };
  }
  return { routes, render, canonical };
}
