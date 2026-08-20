import { useEffect, useRef, type RefObject } from 'react'
import type { Celebration } from '../types/celebrations'
import { CelebrationGallery } from './CelebrationGallery'

export function CelebrationModal({ celebration, onClose, returnFocusRef }: { celebration: Celebration; onClose: () => void; returnFocusRef: RefObject<HTMLElement | null> }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; closeRef.current?.focus(); return () => { document.body.style.overflow = previousOverflow; returnFocusRef.current?.focus() } }, [returnFocusRef])
  return <div className="celebration-modal" role="dialog" aria-modal="true" aria-label={celebration.title}><div className="modal-shell"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Cerrar celebración"><span>ESC</span> ×</button><CelebrationGallery celebration={celebration} onClose={onClose}/></div></div>
}
