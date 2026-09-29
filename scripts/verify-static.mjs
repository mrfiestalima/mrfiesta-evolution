import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((x) => x[1]);
assert.ok(urls.length >= 2);
assert.equal(new Set(urls).size, urls.length);
const root = new URL(urls[0]).pathname;
for (const url of urls) {
  assert.ok(!url.includes("/admin/") && !url.includes("preview="));
  const relative = new URL(url).pathname.slice(root.length);
  const html = await readFile(`dist/${relative}index.html`, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${url}: exactly one H1`,
  );
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${url}"`));
  assert.ok(html.includes("application/ld+json"));
  assert.ok(!html.includes('style="opacity:0'));
  const data = JSON.parse(
    html.match(
      /<script id="site-data" type="application\/json">([\s\S]*?)<\/script>/,
    )[1],
  );
  assert.ok(data.events.every((x) => x.published));
  const plain = html.replace(/<script[\s\S]*?<\/script>/g, "");
  assert.ok(plain.length > 1500, `${url}: substantive static HTML`);
}
assert.match(
  await readFile("dist/admin/index.html", "utf8"),
  /noindex,nofollow/,
);
assert.match(await readFile("dist/404.html", "utf8"), /noindex,follow/);
assert.match(await readFile("dist/robots.txt", "utf8"), /Sitemap:/);
console.log(
  `Verified ${urls.length} static pages, metadata, sitemap, admin and 404.`,
);
