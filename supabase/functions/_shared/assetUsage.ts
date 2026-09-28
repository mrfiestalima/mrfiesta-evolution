type Document = { kind: string; content: unknown };
type Celebration = { id: string; title: string; published: boolean; cover_url: string | null; trailer_url: string | null };
type Media = { celebration_id: string | null; url: string; thumbnail_url?: string | null };

export function contentUsage(content: unknown, url: string): string[] {
  if (!content || typeof content !== 'object') return [];
  const c = content as Record<string, any>;
  const uses: string[] = [];
  if (c.heroAsset?.url === url) uses.push('Cabecera / Portada');
  if (c.liveAsset?.url === url) uses.push('MR Fiesta Live');
  for (const [key, label] of [['experiences', 'Experiencia'], ['technology', 'Tecnología']]) {
    for (const item of Array.isArray(c[key]) ? c[key] : []) {
      if (item.asset?.url === url) uses.push(`${label}: ${item.name}`);
    }
  }
  return uses;
}

export function assetUsage(url: string, documents: Document[], celebrations: Celebration[], media: Media[], fallbackHero: string): string[] {
  const uses: string[] = [];
  for (const doc of documents) {
    const content = doc.content && typeof doc.content === 'object' && Object.keys(doc.content).length
      ? doc.content : { heroAsset: { url: fallbackHero } };
    uses.push(...contentUsage(content, url).map(label => `${doc.kind === 'published' ? 'Web publicada' : 'Borrador'} · ${label}`));
  }
  for (const c of celebrations) {
    const prefix = `Celebración: ${c.title} (${c.published ? 'publicada' : 'borrador'})`;
    if (c.cover_url === url) uses.push(`${prefix} · Portada`);
    if (c.trailer_url === url) uses.push(`${prefix} · Video`);
    if (media.some(m => m.celebration_id === c.id && (m.url === url || m.thumbnail_url === url))) uses.push(`${prefix} · Galería`);
  }
  return [...new Set(uses)];
}
