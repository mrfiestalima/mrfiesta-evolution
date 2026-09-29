import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultContent,
  upgradeContent,
  validateContent,
} from "../src/data/siteContent";
import { recommend, type Answers } from "../src/data/recommendationRules";
import { calculateParty, priceNumber } from "../src/data/partyBuilder";
import { messages, whatsappUrl } from "../src/lib/whatsapp";
import { pages, resolvePage } from "../src/lib/routes";
import { routePath } from "../src/lib/site";
import { pageSeo, seoHead, safeJson } from "../src/lib/seo";
import { validateEventDetails, emptyEventDetails } from "../src/data/evolution";
import { contentUsage } from "../supabase/functions/_shared/assetUsage";
import type { Addon } from "../src/types/evolution";
import type { Celebration } from "../src/types/celebrations";
const answers: Answers = {
  age: "12-14",
  preferences: ["Bailar", "Karaoke"],
  guests: "16-30",
  space: "Casa",
};
test("Teen music example recommends Chicoteca, animation alternative, then LED; max three", () => {
  const result = recommend(defaultContent.experiences, answers);
  assert.deepEqual(
    result.map((x) => x.experience.id),
    ["chicoteca", "home", "club-led"],
  );
  assert.equal(
    recommend(defaultContent.experiences, {
      ...answers,
      age: "Empresa/colegio",
    }).length,
    0,
  );
  assert.equal(
    recommend(defaultContent.experiences, { ...answers, preferences: [] })
      .length,
    0,
  );
  assert.equal(
    recommend(
      defaultContent.experiences.map((x) => ({ ...x, enabled: false })),
      answers,
    ).length,
    0,
  );
  assert.ok(
    !recommend(
      defaultContent.experiences.map((x) => ({
        ...x,
        enabled: x.id !== "chicoteca",
      })),
      answers,
    ).some((x) => x.experience.id === "chicoteca"),
  );
});
test("Builder excludes incompatible, disabled and duplicate extras; consult never becomes a price", () => {
  const base = defaultContent.experiences.find((x) => x.id === "chicoteca");
  const addon: Addon = {
    id: "photo",
    name: "Foto",
    enabled: true,
    description: "",
    image: null,
    price: 100,
    priceMode: "fixed",
    compatibleWith: ["chicoteca"],
  };
  const extras = [
    addon,
    { ...addon, id: "consult", priceMode: "consult" as const, price: null },
    { ...addon, id: "bad", compatibleWith: ["other"] },
    { ...addon, id: "off", enabled: false },
  ];
  const result = calculateParty(base, extras, [
    "photo",
    "photo",
    "bad",
    "off",
    "consult",
    "unknown",
  ]);
  assert.equal(result.total, 690);
  assert.equal(result.addons.length, 2);
  assert.equal(result.consult, true);
  assert.equal(calculateParty(undefined, extras, []).total, null);
  assert.equal(
    calculateParty(base, [{ ...addon, priceMode: "from" }], ["photo"]).from,
    true,
  );
  assert.equal(priceNumber("S/1,290"), 1290);
  assert.equal(priceNumber("Desde S/590"), 590);
  assert.equal(priceNumber("Consultar"), null);
  assert.equal(priceNumber("S/1,,2"), null);
});
test("WhatsApp preserves configured phone and context while encoding special characters", () => {
  const message = messages.recommendation({
    Edad: "12-14",
    Preferencias: "Baile + Karaoke",
    Distrito: "Breña & Lima",
    Experiencia: "Chicoteca",
  });
  const url = new URL(whatsappUrl(message, "51912345678"));
  assert.equal(url.pathname, "/51912345678");
  assert.equal(url.searchParams.get("text"), message);
  assert.throws(() => whatsappUrl(message, "javascript:bad"));
});
test("Backward-compatible upgrade retains existing content and disabled packages", () => {
  const old = structuredClone(defaultContent);
  delete old.evolution;
  old.experiences = old.experiences.slice(0, 4);
  old.experiences[0].enabled = false;
  const migrated = upgradeContent(old);
  assert.equal(migrated.contact.phone, old.contact.phone);
  assert.equal(migrated.experiences[0].enabled, false);
  assert.equal(migrated.experiences.length, 6);
  assert.equal(old.experiences.length, 4);
  assert.equal(upgradeContent(migrated), migrated);
  assert.doesNotThrow(() => validateContent(migrated));
});
test("Content validation rejects unsafe URLs, conflicting slugs, invalid prices and image types", () => {
  const content = () => structuredClone(defaultContent);
  let c = content();
  c.evolution!.landings[0].slug = "../admin";
  assert.throws(() => validateContent(c));
  c = content();
  c.evolution!.landings[0].slug = c.evolution!.landings[1].slug;
  assert.throws(() => validateContent(c));
  c = content();
  c.evolution!.addons = [
    {
      id: "a",
      enabled: true,
      name: "A",
      description: "",
      image: null,
      compatibleWith: [],
      priceMode: "fixed",
      price: -5,
    },
  ];
  assert.throws(() => validateContent(c));
  c = content();
  c.evolution!.corporateClients = [
    {
      id: "a",
      enabled: true,
      name: "A",
      logo: { id: "x", name: "x", url: "javascript:alert(1)", type: "image" },
    },
  ];
  assert.throws(() => validateContent(c));
  assert.throws(() =>
    validateEventDetails({ ...emptyEventDetails, guests: -1 }),
  );
  assert.throws(() =>
    validateEventDetails({ ...emptyEventDetails, services: ["x".repeat(301)] }),
  );
});
test("Routes exclude drafts/disabled content and respect subdirectory/custom domain bases", () => {
  const event = {
    id: "1",
    slug: "case",
    title: "Celebración",
    published: true,
    media: [],
  } as unknown as Celebration;
  const all = pages(defaultContent, [
    event,
    { ...event, id: "2", slug: "draft", published: false },
  ]);
  assert.ok(all.some((x) => x.path === "eventos/case/"));
  assert.ok(
    !all.some((x) => x.path.includes("draft") || x.path.includes("admin")),
  );
  assert.equal(new Set(all.map((x) => x.path)).size, all.length);
  assert.equal(
    resolvePage("eventos/case/", defaultContent, [event]).kind,
    "event",
  );
  assert.equal(resolvePage("missing", defaultContent, []).kind, "notFound");
  assert.equal(
    routePath("/mrfiesta-evolution/chicoteca-lima/"),
    "chicoteca-lima",
  );
  assert.equal(routePath("/chicoteca-lima/", "/"), "chicoteca-lima");
  assert.equal(routePath("/mrfiesta-evolution/%xx"), "404");
});
test("SEO is unique, canonical, escaped and does not emit invented ratings", () => {
  const routes = pages(defaultContent, []);
  const titles = routes.map((x) => pageSeo(x, defaultContent).title);
  assert.equal(new Set(titles).size, titles.length);
  const p = routes.find((x) => x.kind === "landing")!;
  assert.match(seoHead(p, defaultContent), /rel="canonical"/);
  assert.match(seoHead(p, defaultContent), /BreadcrumbList/);
  assert.ok(!seoHead(p, defaultContent).includes("aggregateRating"));
  const injected = structuredClone(defaultContent);
  injected.copy.heroDescription = "</script><script>alert(1)</script>";
  assert.ok(!safeJson(injected).includes("</script>"));
  assert.match(
    seoHead({ kind: "home", path: "" }, injected),
    /&lt;\/script&gt;/,
  );
});
test("Library usage includes new modules and secondary experience assets", () => {
  const asset = {
    id: "a",
    name: "Logo",
    url: "https://example.com/logo.png",
    type: "image" as const,
  };
  const c = structuredClone(defaultContent);
  c.evolution!.corporateClients = [
    { id: "a", name: "Company", enabled: false, logo: asset },
  ];
  c.experiences[0].image = asset;
  assert.equal(contentUsage(c, asset.url).length, 2);
});
