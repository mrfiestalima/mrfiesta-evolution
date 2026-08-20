import { supabase } from '../lib/supabase'
import type { CelebrationMedia } from '../types/celebrations'

type PresignResponse = { uploadUrl: string; key: string; publicUrl: string }

function requireSupabase() { if (!supabase) throw new Error('Supabase no está configurado.'); return supabase }

export async function requestUploadUrl(celebrationId: string, file: File): Promise<PresignResponse> {
  const client = requireSupabase()
  const { data, error } = await client.functions.invoke<PresignResponse>('r2-media', { body: { operation: 'presign-upload', celebrationId, fileName: file.name, contentType: file.type, fileSize: file.size } })
  if (error || !data) throw new Error(error?.message ?? 'No se pudo preparar la subida.')
  return data
}

export function uploadToR2(uploadUrl: string, file: File, onProgress: (progress: number) => void): Promise<void> {
  return new Promise((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.open('PUT', uploadUrl); xhr.setRequestHeader('Content-Type', file.type); xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100)) }; xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('R2 upload failed')); xhr.onerror = () => reject(new Error('R2 upload failed')); xhr.onabort = () => reject(new Error('Upload cancelled')); xhr.send(file) })
}

export async function insertMedia(celebrationId: string, asset: PresignResponse, file: File, sortOrder: number): Promise<CelebrationMedia> {
  const client = requireSupabase()
  const { data, error } = await client.from('media').insert({ celebration_id: celebrationId, type: file.type.startsWith('video/') ? 'video' : 'image', url: asset.publicUrl, thumbnail_url: null, alt: file.name.replace(/\.[^.]+$/, ''), width: null, height: null, duration_seconds: null, sort_order: sortOrder, featured: false }).select().single()
  if (error || !data) throw new Error(error?.message ?? 'No se pudo guardar la media.')
  return { id: data.id, celebrationId: data.celebration_id, type: data.type === 'video' ? 'video' : 'image', url: data.url, thumbnailUrl: data.thumbnail_url, alt: data.alt, width: data.width, height: data.height, durationSeconds: data.duration_seconds, sortOrder: data.sort_order, featured: data.featured }
}

export async function cleanupObject(celebrationId: string, key: string): Promise<void> { const client = requireSupabase(); const { error } = await client.functions.invoke('r2-media', { body: { operation: 'cleanup-object', celebrationId, key } }); if (error) throw new Error(error.message) }
export async function deleteMedia(mediaId: string): Promise<void> { const client = requireSupabase(); const { error } = await client.functions.invoke('r2-media', { body: { operation: 'delete-media', mediaId } }); if (error) throw new Error(error.message) }
export async function updateMediaOrder(mediaId: string, sortOrder: number): Promise<void> { const client = requireSupabase(); const { error } = await client.from('media').update({ sort_order: sortOrder }).eq('id', mediaId); if (error) throw new Error(error.message) }
export async function setCelebrationCover(celebrationId: string, url: string): Promise<void> { const client = requireSupabase(); const { error } = await client.from('celebrations').update({ cover_url: url }).eq('id', celebrationId); if (error) throw new Error(error.message) }
export async function setCelebrationTrailer(celebrationId: string, url: string): Promise<void> { const client = requireSupabase(); const { error } = await client.from('celebrations').update({ trailer_url: url }).eq('id', celebrationId); if (error) throw new Error(error.message) }
