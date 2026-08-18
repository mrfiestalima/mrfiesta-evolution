import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'
import type { Celebration, CelebrationMedia } from '../types/celebrations'

type CelebrationRow = Database['public']['Tables']['celebrations']['Row']
type MediaRow = Database['public']['Tables']['media']['Row']
type CelebrationWithMedia = CelebrationRow & { media: MediaRow[] }

function mapMedia(row: MediaRow): CelebrationMedia {
  return { id: row.id, celebrationId: row.celebration_id, type: row.type === 'video' ? 'video' : 'image', url: row.url, thumbnailUrl: row.thumbnail_url, alt: row.alt, width: row.width, height: row.height, durationSeconds: row.duration_seconds, sortOrder: row.sort_order, featured: row.featured }
}

function mapCelebration(row: CelebrationWithMedia): Celebration {
  const media = [...(row.media ?? [])].sort((a, b) => a.sort_order - b.sort_order).map(mapMedia)
  return { id: row.id, slug: row.slug, childName: row.child_name, age: row.age, title: row.title, eventDate: row.event_date, district: row.district, venue: row.venue, theme: row.theme, shortDescription: row.short_description, longDescription: row.long_description, coverUrl: row.cover_url, trailerUrl: row.trailer_url, featured: row.featured, published: row.published, meta: [row.district, row.theme].filter(Boolean).join(' · ') || 'Celebración real', tags: [row.theme, media[0]?.type === 'video' ? 'Live' : 'Celebración'].filter((tag): tag is string => Boolean(tag)), media }
}

async function queryCelebrations(query: PromiseLike<{ data: CelebrationWithMedia[] | null; error: { message: string } | null }>): Promise<Celebration[]> {
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapCelebration)
}

export async function getPublishedCelebrations(): Promise<Celebration[]> {
  if (!supabase) return []
  try {
    return await queryCelebrations(supabase.from('celebrations').select('*, media(*)').eq('published', true).order('event_date', { ascending: false }).order('sort_order', { foreignTable: 'media', ascending: true }))
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[celebrations] Unable to load published celebrations.', error)
    return []
  }
}

export async function getCelebrationBySlug(slug: string): Promise<Celebration | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('celebrations').select('*, media(*)').eq('slug', slug).eq('published', true).maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapCelebration(data) : null
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[celebrations] Unable to load celebration by slug.', error)
    return null
  }
}

export async function getFeaturedCelebration(): Promise<Celebration | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('celebrations').select('*, media(*)').eq('published', true).eq('featured', true).order('event_date', { ascending: false }).limit(1).maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapCelebration(data) : null
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[celebrations] Unable to load featured celebration.', error)
    return null
  }
}
