import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "npm:@aws-sdk/client-s3@3.859.0";
import { assetUsage } from '../_shared/assetUsage.ts';
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.859.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const formats: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")
    return response({ error: "Method not allowed" }, 405);
  try {
    const token = (req.headers.get("Authorization") ?? "").replace(
      /^Bearer\s+/i,
      "",
    );
    if (!token) return response({ error: "Authentication required" }, 401);
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: user, error: authError } = await client.auth.getUser(token);
    if (authError || !user.user)
      return response({ error: "Invalid session" }, 401);
    if (user.user.is_anonymous) return response({ error: "Admin required" }, 403);
    const { data: admin, error: adminError } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.user.id)
      .maybeSingle();
    if (adminError || !admin) return response({ error: "Admin required" }, 403);
    const account = Deno.env.get("R2_ACCOUNT_ID"),
      access = Deno.env.get("R2_ACCESS_KEY_ID"),
      secret = Deno.env.get("R2_SECRET_ACCESS_KEY"),
      bucket = Deno.env.get("R2_BUCKET_NAME"),
      base = Deno.env.get("R2_PUBLIC_BASE_URL")?.replace(/\/+$/, "");
    if (!account || !access || !secret || !bucket || !base)
      return response({ error: "Storage is not configured" }, 503);
    const r2 = new S3Client({
      region: "auto",
      endpoint: `https://${account}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: access, secretAccessKey: secret },
    });
    const body = await req.json();
    if (body.operation === 'delete' && typeof body.url === 'string') {
      const url = body.url;
      if (!url.startsWith(`${base}/`)) return response({ error: 'Invalid asset URL' }, 400);
      const [assets, media, documents, celebrations] = await Promise.all([
        client.from('site_assets').select('id,url,object_key').eq('url', url),
        client.from('media').select('id,celebration_id,url,thumbnail_url'),
        client.from('site_documents').select('kind,content'),
        client.from('celebrations').select('id,title,published,cover_url,trailer_url'),
      ]);
      if (assets.error || media.error || documents.error || celebrations.error) throw new Error('Could not verify usage');
      const matching = media.data.filter(m => m.url === url);
      if (!assets.data.length && !matching.length) return response({ error: 'File not found' }, 404);
      const uses = assetUsage(url, documents.data, celebrations.data, media.data, `${base}/hero/evolution.mp4`);
      // Orphaned thumbnails may also belong to a preserved library video.
      if (media.data.some(m => !m.celebration_id && m.thumbnail_url === url)) uses.push('Miniatura de un video de la biblioteca');
      if (uses.length) return response({ error: 'ASSET_IN_USE', uses }, 409);
      const key = decodeURIComponent(url.slice(base.length + 1));
      if (!key || key.split('/').some(part => part === '..' || part === '.') || key.includes('?') || key.includes('#')) return response({ error: 'Invalid object' }, 400);
      await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      // Keep records until R2 confirms deletion so failed requests are retryable.
      const deletedMedia = await client.from('media').delete().eq('url', url).is('celebration_id', null);
      if (deletedMedia.error) throw deletedMedia.error;
      const deletedAssets = await client.from('site_assets').delete().eq('url', url);
      if (deletedAssets.error) throw deletedAssets.error;
      return response({ deleted: true });
    }
    if (body.operation === "prepare") {
      const { name, contentType, size } = body;
      const image =
        typeof contentType === "string" && contentType.startsWith("image/");
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.length > 300 ||
        !Object.hasOwn(formats, contentType) ||
        !Number.isSafeInteger(size) ||
        size <= 0 ||
        size > (image ? 20 : 500) * 1024 * 1024
      )
        return response({ error: "Invalid file" }, 400);
      const id = crypto.randomUUID(),
        key = `site/${id}.${formats[contentType]}`;
      const uploadUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: contentType,
        }),
        { expiresIn: 300 },
      );
      const { error } = await client
        .from("site_assets")
        .insert({
          id,
          object_key: key,
          url: `${base}/${key}`,
          name,
          type: image ? "image" : "video",
          content_type: contentType,
          size,
          ready: false,
        });
      if (error) throw error;
      return response({ id, uploadUrl });
    }
    if (body.operation === "complete" && typeof body.id === "string") {
      const { data: asset, error } = await client
        .from("site_assets")
        .select("*")
        .eq("id", body.id)
        .single();
      if (
        error ||
        !asset ||
        !/^site\/[a-f0-9-]+\.(jpg|png|webp|mp4|webm)$/.test(asset.object_key)
      )
        return response({ error: "File not found" }, 404);
      const head = await r2.send(
        new HeadObjectCommand({ Bucket: bucket, Key: asset.object_key }),
      );
      if (
        head.ContentLength !== asset.size ||
        head.ContentType !== asset.content_type
      )
        return response({ error: "Uploaded file does not match" }, 400);
      const saved = await client
        .from("site_assets")
        .update({ ready: true })
        .eq("id", asset.id);
      if (saved.error) throw saved.error;
      return response({
        asset: {
          id: asset.id,
          name: asset.name,
          type: asset.type,
          url: asset.url,
        },
      });
    }
    return response({ error: "Invalid operation" }, 400);
  } catch {
    return response({ error: "Upload could not be completed" }, 500);
  }
});
