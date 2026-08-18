import type { Celebration } from '../types/celebrations'

export const fallbackCelebrations: Celebration[] = [
  { id: 'fallback-1', slug: 'valentina-cumple-15', childName: 'Valentina', age: 15, title: 'Valentina cumple 15', eventDate: null, district: 'La Molina', venue: null, theme: 'Fiesta editorial', shortDescription: null, longDescription: null, coverUrl: null, trailerUrl: null, featured: true, published: true, meta: 'La Molina · Fiesta editorial', tags: ['Quinceañera', 'LED'], media: [] },
  { id: 'fallback-2', slug: 'mateo-cumple-10', childName: 'Mateo', age: 10, title: 'Mateo cumple 10', eventDate: null, district: 'Surco', venue: null, theme: 'Una tarde fuera de serie', shortDescription: null, longDescription: null, coverUrl: null, trailerUrl: null, featured: false, published: true, meta: 'Surco · Una tarde fuera de serie', tags: ['Cumpleaños', 'Just Dance'], media: [] },
  { id: 'fallback-3', slug: 'prom-2025', childName: 'Prom', age: null, title: 'Prom 2025', eventDate: null, district: 'Lima', venue: null, theme: 'El último baile', shortDescription: null, longDescription: null, coverUrl: null, trailerUrl: null, featured: false, published: true, meta: 'Lima · El último baile', tags: ['Prom', 'Live'], media: [] }
]
