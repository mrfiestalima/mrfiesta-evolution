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
  const [dimensions, setDimensions] = useState<{ url: string; ratio: number } | null>(null);
  const orientation = dimensions?.url === asset?.url && dimensions
    ? dimensions.ratio > 1 ? 'landscape' : dimensions.ratio === 1 ? 'square' : 'portrait'
    : 'portrait';
  if (!asset || failed === asset.url) return null;
  return asset.type === "image" ? (
    <img
      className="site-asset"
      data-orientation={orientation}
      src={asset.url}
      alt={alt}
      loading={ambient ? "eager" : "lazy"}
      onLoad={(event) => setDimensions({ url: asset.url, ratio: event.currentTarget.naturalWidth / event.currentTarget.naturalHeight })}
      onError={() => setFailed(asset.url)}
    />
  ) : (
    <video
      className="site-asset"
      data-orientation={orientation}
      src={asset.url}
      aria-label={alt}
      controls
      playsInline
      preload="metadata"
      onLoadedMetadata={(event) => setDimensions({ url: asset.url, ratio: event.currentTarget.videoWidth / event.currentTarget.videoHeight })}
      onPlay={(event) => {
        document.querySelectorAll('video').forEach((video) => {
          if (video !== event.currentTarget) video.pause();
        });
      }}
      onError={() => setFailed(asset.url)}
    />
  );
}
