import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DeleteObjectCommand, S3Client } from 'npm:@aws-sdk/client-s3@3.859.0'
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3.859.0'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }
const imageTypes: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const videoTypes: Record<string, string> = { 'video/mp4': 'mp4', 'video/webm': 'webm' }
const maxImageBytes = 20 * 1024 * 1024
const maxVideoBytes = 500 * 1024 * 1024

type RequestBody = { operation?: 'presign-upload' | 'delete-media' | 'cleanup-object'; celebrationId?: string; fileName?: string; contentType?: string; fileSize?: number; mediaId?: string; key?: string }

function json(body: Record<string, unknown>, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }
function cleanSlug(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') }
function keyFromPublicUrl(publicUrl: string, publicBase: string) { const normalizedBase = publicBase.replace(/\/+$/, ''); if (!publicUrl.startsWith(`${normalizedBase}/`)) throw new Error('Objeto fuera del bucket configurado.'); return decodeURIComponent(publicUrl.slice(normalizedBase.length + 1)) }

async function getContext(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('UNAUTHORIZED')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
  const { data: userData, error: userError } = await client.auth.getUser(token)
  if (userError || !userData.user) throw new Error('UNAUTHORIZED')
  const { data: admin, error: adminError } = await client.from('admin_users').select('user_id').eq('user_id', userData.user.id).maybeSingle()
  if (adminError || !admin) throw new Error('FORBIDDEN')
  return { client, userId: userData.user.id }
}

function getR2() {
  const accountId = Deno.env.get('R2_ACCOUNT_ID')
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
  const bucket = Deno.env.get('R2_BUCKET_NAME')
  const publicBase = Deno.env.get('R2_PUBLIC_BASE_URL')?.replace(/\/+$/, '')
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) throw new Error('R2_NOT_CONFIGURED')
  return { client: new S3Client({ region: 'auto', endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId, secretAccessKey } }), bucket, publicBase }
}

async function presignUpload(client: ReturnType<typeof createClient>, r2: ReturnType<typeof getR2>, body: RequestBody) {
  if (!body.celebrationId || !body.fileName || !body.contentType || !body.fileSize) throw new Error('INVALID_INPUT')
  const { data: celebration, error } = await client.from('celebrations').select('slug').eq('id', body.celebrationId).single()
  if (error || !celebration) throw new Error('CELEBRATION_NOT_FOUND')
  const extension = imageTypes[body.contentType] ?? videoTypes[body.contentType]
  const folder = imageTypes[body.contentType] ? 'images' : videoTypes[body.contentType] ? 'videos' : ''
  const limit = imageTypes[body.contentType] ? maxImageBytes : videoTypes[body.contentType] ? maxVideoBytes : 0
  if (!extension || !folder || body.fileSize > limit) throw new Error('UNSUPPORTED_FILE')
  const slug = cleanSlug(celebration.slug)
  const key = `events/${slug}/${folder}/${crypto.randomUUID()}.${extension}`
  const command = new (await import('npm:@aws-sdk/client-s3@3.859.0')).PutObjectCommand({ Bucket: r2.bucket, Key: key, ContentType: body.contentType })
  const uploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 300 })
  return { uploadUrl, key, publicUrl: `${r2.publicBase}/${key}` }
}

async function deleteMedia(client: ReturnType<typeof createClient>, r2: ReturnType<typeof getR2>, mediaId: string) {
  const { data: media, error } = await client.from('media').select('id, url, celebration_id').eq('id', mediaId).single()
  if (error || !media) throw new Error('MEDIA_NOT_FOUND')
  const { data: celebration, error: celebrationError } = await client.from('celebrations').select('slug').eq('id', media.celebration_id).single()
  if (celebrationError || !celebration) throw new Error('CELEBRATION_NOT_FOUND')
  const key = keyFromPublicUrl(media.url, r2.publicBase)
  if (!key.startsWith(`events/${cleanSlug(celebration.slug)}/`)) throw new Error('INVALID_OBJECT')
  await r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: key }))
  const { error: deleteError } = await client.from('media').delete().eq('id', mediaId)
  if (deleteError) throw new Error(deleteError.message)
  return { deleted: true }
}

async function cleanupObject(client: ReturnType<typeof createClient>, r2: ReturnType<typeof getR2>, celebrationId: string, key: string) {
  const { data: celebration, error } = await client.from('celebrations').select('slug').eq('id', celebrationId).single()
  if (error || !celebration || !key.startsWith(`events/${cleanSlug(celebration.slug)}/`)) throw new Error('INVALID_OBJECT')
  await r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: key }))
  return { deleted: true }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  try {
    const { client } = await getContext(req)
    const body = await req.json() as RequestBody
    const r2 = getR2()
    if (body.operation === 'presign-upload') return json(await presignUpload(client, r2, body))
    if (body.operation === 'delete-media' && body.mediaId) return json(await deleteMedia(client, r2, body.mediaId))
    if (body.operation === 'cleanup-object' && body.celebrationId && body.key) return json(await cleanupObject(client, r2, body.celebrationId, body.key))
    return json({ error: 'Invalid operation' }, 400)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const status = code === 'UNAUTHORIZED' ? 401 : code === 'FORBIDDEN' ? 403 : code === 'INVALID_INPUT' || code === 'UNSUPPORTED_FILE' ? 400 : 500
    return json({ error: status === 500 ? 'Upload service unavailable.' : code }, status)
  }
})
