export type CelebrationMedia = {
  id: string
  celebrationId: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl: string | null
  alt: string | null
  width: number | null
  height: number | null
  durationSeconds: number | null
  sortOrder: number
  featured: boolean
}

export type Celebration = {
  id: string
  slug: string
  childName: string
  age: number | null
  title: string
  eventDate: string | null
  district: string | null
  venue: string | null
  theme: string | null
  shortDescription: string | null
  longDescription: string | null
  coverUrl: string | null
  trailerUrl: string | null
  featured: boolean
  published: boolean
  meta: string
  tags: string[]
  media: CelebrationMedia[]
}
