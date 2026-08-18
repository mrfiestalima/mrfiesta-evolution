import { useState, type ReactNode } from 'react'
import clsx from 'clsx'

type MediaVideoProps = {
  src?: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  className?: string
  fallback: ReactNode
}

export function MediaVideo({ src, poster, autoPlay = false, muted = true, loop = false, playsInline = true, preload = 'metadata', className, fallback }: MediaVideoProps) {
  const [failed, setFailed] = useState(false)
  const shouldRenderVideo = Boolean(src) && !failed

  return <div className={clsx('media-video', className)}>
    {shouldRenderVideo ? <video src={src} poster={poster} autoPlay={autoPlay} muted={muted} loop={loop} playsInline={playsInline} preload={preload} aria-label="Video ambiental de MR Fiesta" onError={() => setFailed(true)} /> : fallback}
  </div>
}
