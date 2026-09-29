import { build, loadEnv } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
await build({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
    rollupOptions: { input: "src/entry-server.tsx" },
  },
});
const { prepare } = await import(
  pathToFileURL(resolve(".prerender/entry-server.js")).href
);
const url = env.VITE_SUPABASE_URL,
  key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
let document = {},
  events = [];
if (url && key) {
  const query = async (path) => {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok)
      throw new Error(
        `Public content fetch failed (${res.status}). Build stopped to preserve published pages.`,
      );
    return res.json();
  };
  const docs = await query("site_documents?select=content&kind=eq.published");
  if (!docs.length) throw new Error("Missing published site document");
  document = docs[0].content;
  for (let offset = 0; ; offset += 100) {
    const batch = await query(
      `celebrations?select=*,media(*)&published=eq.true&order=event_date.desc.nullsfirst,id&limit=100&offset=${offset}`,
    );
    events.push(...batch);
    if (batch.length < 100) break;
  }
} else if (env.CI) {
  throw new Error(
    "Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for production prerendering.",
  );
}
const { routes, render, canonical } = prepare(document, events);
const template = await readFile("dist/index.html", "utf8");
const clean = template
  .replace(/<title>[\s\S]*?<\/title>/g, "")
  .replace(
    /<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,
    "",
  )
  .replace(/<link\s+rel="canonical"[^>]*>/g, "");
for (const page of [...routes, { kind: "notFound", path: "404.html" }]) {
  if (
    page.path.includes("..") ||
    (!/^([a-z0-9-]+\/)*$/.test(page.path) && page.path !== "404.html")
  )
    throw new Error(`Unsafe output path: ${page.path}`);
  const { html, head, bootstrap } = render(page);
  const output = clean
    .replace("</head>", `${head}</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div><script id="site-data" type="application/json">${bootstrap}</script>`,
    );
  const file =
    page.path === "404.html" ? "dist/404.html" : `dist/${page.path}index.html`;
  await mkdir(resolve(file, ".."), { recursive: true });
  await writeFile(file, output);
}
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((p) => `<url><loc>${escape(canonical(p.path))}</loc></url>`).join("")}</urlset>`,
);
const base = new URL(canonical()).pathname;
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: ${base}\nDisallow: ${base}admin/\nDisallow: /*?preview=\nSitemap: ${canonical("sitemap.xml")}\n`,
);
await writeFile("dist/.nojekyll", "");
console.log(
  `Prerendered ${routes.length} public pages and 404. Drafts excluded.`,
);
