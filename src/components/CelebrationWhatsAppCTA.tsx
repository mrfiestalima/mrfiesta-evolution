import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { messages, whatsappUrl } from '../lib/whatsapp'

function WhatsAppMark() {
  return <span className="whatsapp-mark" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20.5 3.5A11.4 11.4 0 0 0 12.4 0C6.1 0 1 5.1 1 11.4c0 2 .5 3.9 1.5 5.6L1 23l6.2-1.6a11.4 11.4 0 0 0 5.2 1.2h.1c6.3 0 11.4-5.1 11.4-11.4 0-3-1.2-5.7-3.4-7.7ZM12.4 20.7h-.1c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3.7 1 1-3.6-.2-.4a9.3 9.3 0 0 1-1.4-4.8c0-5.1 4.2-9.3 9.4-9.3 2.5 0 4.8 1 6.6 2.7a9.3 9.3 0 0 1 2.7 6.6c0 5.2-4.2 9.4-9.2 9.4Zm5.1-7c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.1-.3-.5.3-.4.8-1.4.1-.2.1-.4 0-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.4 3.7 5.9 5.1 2.2.9 2.8.7 3.3.7.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.1-1.3-.1-.2-.3-.2-.6-.3Z"/></svg></span>
}

export function CelebrationWhatsAppCTA({ title, variant = 'compact', className = '' }: { title: string; variant?: 'compact' | 'full'; className?: string }) {
  const label = 'Quiero una fiesta así, abrir conversación en WhatsApp'
  const content: ReactNode = <><WhatsAppMark/><span className="whatsapp-cta-copy"><strong>QUIERO UNA FIESTA ASÍ</strong><small>ABRIR EN WHATSAPP</small></span><ArrowUpRight className="whatsapp-cta-arrow" size={variant === 'full' ? 18 : 15}/></>
  return <a className={`celebration-whatsapp-cta celebration-whatsapp-cta--${variant} ${className}`} href={whatsappUrl(messages.event(title))} aria-label={`${label} sobre ${title}`}>{content}</a>
}
