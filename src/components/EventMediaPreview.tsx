import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, X } from 'lucide-react'

type EventMediaPreviewProps = {
  coverUrl: string | null
  trailerUrl: string | null
  alt: string
  isPlaying: boolean
  onPlay: () => void
  onStop: () => void
}

export function EventMediaPreview({ coverUrl, trailerUrl, alt, isPlaying, onPlay, onStop }: EventMediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!isPlaying) videoRef.current?.pause()
    if (isPlaying) setFailed(false)
  }, [isPlaying])

  function handleError() {
    setFailed(true)
    onStop()
  }

  return <>
    <div className="event-light"/>
    {isPlaying && trailerUrl && !failed ? <video ref={videoRef} src={trailerUrl} poster={coverUrl ?? undefined} controls autoPlay playsInline preload="metadata" onError={handleError} onEnded={onStop} aria-label={`Trailer de ${alt}`}/> : coverUrl ? <img src={coverUrl} alt={alt} loading="lazy"/> : <div className="event-placeholder">MEDIA<br/>PREVIEW</div>}
    {failed && <div className="event-video-error"><X size={13}/> No se pudo reproducir el video <button onClick={() => { setFailed(false); onPlay() }} aria-label="Reintentar video"><RotateCcw size={12}/></button></div>}
    {trailerUrl && !isPlaying && !failed && <button className="event-play-button" onClick={() => { setFailed(false); onPlay() }} aria-label={`Reproducir video de ${alt}`}><Play size={15} fill="currentColor"/></button>}
    {isPlaying && <button className="event-close-button" onClick={onStop}>Volver a portada</button>}
  </>
}
