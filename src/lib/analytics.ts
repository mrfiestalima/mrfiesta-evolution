export type TrackingEvent =
  | "hero_cta"
  | "whatsapp_click"
  | "experience_view"
  | "experience_whatsapp"
  | "event_view"
  | "event_whatsapp"
  | "recommendation_complete"
  | "builder_complete"
  | "quote_complete"
  | "corporate_quote"
  | "before_after_interaction"
  | "video_play";
export function trackEvent(
  name: TrackingEvent,
  params: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  // Never include contact details, form answers or WhatsApp message bodies.
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (name: string, data: unknown) => void };
  };
  try {
    w.gtag?.("event", name, params);
    w.fbq?.("trackCustom", name, params);
    w.ttq?.track(name, params);
  } catch {
    /* Analytics must never block conversion. */
  }
}
export function installTracking() {
  if (typeof document === "undefined") return () => {};
  const click = (e: MouseEvent) => {
    const a = (e.target as Element)?.closest?.("a");
    if (a?.href.startsWith("https://wa.me/"))
      trackEvent("whatsapp_click", { context: a.dataset.context || "general" });
  };
  const play = (e: Event) => {
    if (e.target instanceof HTMLVideoElement) trackEvent("video_play");
  };
  document.addEventListener("click", click);
  document.addEventListener("play", play, true);
  return () => {
    document.removeEventListener("click", click);
    document.removeEventListener("play", play, true);
  };
}
