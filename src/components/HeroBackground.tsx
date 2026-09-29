import { useState, useRef, useEffect } from "react";
import type { Asset } from "../data/siteContent";
import "./hero-background.css";
export function HeroBackground({ asset }: { asset: Asset | null }) {
  const [failed, setFailed] = useState<string | null>(null),
    [paused, setPaused] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) {
        ref.current?.pause();
        setPaused(true);
      }
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [asset?.url]);
  if (!asset || failed === asset.url) return null;
  return (
    <>
      <div className="hero-background" aria-hidden="true">
        {asset.type === "video" ? (
          <video
            ref={ref}
            key={asset.url}
            src={asset.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            onPause={() => setPaused(true)}
            onPlay={() => setPaused(false)}
            onError={() => setFailed(asset.url)}
          />
        ) : (
          <img src={asset.url} alt="" onError={() => setFailed(asset.url)} />
        )}
      </div>
      {asset.type === "video" && (
        <button
          className="hero-pause"
          onClick={() => {
            if (ref.current?.paused)
              void ref.current.play().catch(() => setPaused(true));
            else ref.current?.pause();
          }}
          aria-label={
            paused
              ? "Reproducir animación de cabecera"
              : "Pausar animación de cabecera"
          }
        >
          {paused ? "▶ Reproducir fondo" : "Ⅱ Pausar fondo"}
        </button>
      )}
    </>
  );
}
