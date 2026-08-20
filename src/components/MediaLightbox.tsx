import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from './CelebrationGallery'

export function MediaLightbox({ items, index, onClose, onChange }: { items: GalleryItem[]; index: number; onClose: () => void; onChange: (index: number) => void }) {
  const item = items[index]
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length); if (event.key === 'ArrowRight') onChange((index + 1) % items.length) }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown) }, [index, items.length, onChange, onClose])
  if (!item) return null
  return <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label={`Media de ${item.alt}`} onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}><button className="lightbox-close" onClick={onClose} aria-label="Cerrar media"><X size={22}/></button>{items.length > 1 && <><button className="lightbox-nav previous" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Media anterior"><ChevronLeft size={25}/></button><button className="lightbox-nav next" onClick={() => onChange((index + 1) % items.length)} aria-label="Media siguiente"><ChevronRight size={25}/></button></>}{item.type === 'video' ? <video key={item.url} src={item.url} poster={item.thumbnailUrl ?? undefined} controls playsInline preload="metadata" autoPlay={false}/> : <img src={item.url} alt={item.alt}/>}<span className="lightbox-counter">{index + 1} / {items.length}</span></div>
}
