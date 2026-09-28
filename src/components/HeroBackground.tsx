import { useState } from 'react';
import type { Asset } from '../data/siteContent';
import './hero-background.css';

export function HeroBackground({ asset }: { asset: Asset | null }) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!asset || failed === asset.url) return null;
  return <div className="hero-background" aria-hidden="true">
    {asset.type === 'video' ? <video
      key={asset.url}
      src={asset.url}
      autoPlay muted loop playsInline
      preload="auto"
      disablePictureInPicture
      tabIndex={-1}
      onError={() => setFailed(asset.url)}
    /> : <img src={asset.url} alt="" onError={() => setFailed(asset.url)} />}
  </div>;
}
