import { useState } from "react";
import type { Asset } from "../data/siteContent";

export function SiteAsset({
  asset,
  alt,
  ambient = false,
}: {
  asset: Asset | null;
  alt: string;
  ambient?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!asset || failed === asset.url) return null;
  return asset.type === "image" ? (
    <img
      className="site-asset"
      src={asset.url}
      alt={alt}
      loading={ambient ? "eager" : "lazy"}
      onError={() => setFailed(asset.url)}
    />
  ) : (
    <video
      className="site-asset"
      src={asset.url}
      aria-label={alt}
      controls={!ambient}
      autoPlay={ambient}
      muted={ambient}
      loop={ambient}
      playsInline
      preload="metadata"
      onError={() => setFailed(asset.url)}
    />
  );
}
