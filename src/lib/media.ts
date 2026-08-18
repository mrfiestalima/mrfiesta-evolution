const mediaBaseUrl = (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '')

export const MEDIA_BASE_URL = mediaBaseUrl

export function mediaUrl(path: string): string | undefined {
  const normalizedPath = path.trim().replace(/^\/+/, '')
  if (!mediaBaseUrl || !normalizedPath) return undefined
  return `${mediaBaseUrl}/${normalizedPath}`
}
