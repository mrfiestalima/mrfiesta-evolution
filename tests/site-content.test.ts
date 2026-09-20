import test from "node:test";
import assert from "node:assert/strict";
import { defaultContent, validateContent } from "../src/data/siteContent";

test("default site is valid and supports hiding every experience", () => {
  const c = structuredClone(defaultContent);
  assert.equal(validateContent(c), c);
  c.experiences.forEach((item) => (item.enabled = false));
  assert.doesNotThrow(() => validateContent(c));
});
test("published content rejects unsafe media and social URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com/file.mp4",
    "https://user:secret@example.com/a",
  ]) {
    const c = structuredClone(defaultContent);
    c.heroAsset = { id: "test", name: "Test", type: "video", url };
    assert.throws(() => validateContent(c));
    c.heroAsset = null;
    c.contact.instagram = url;
    assert.throws(() => validateContent(c));
  }
});
test("contact number is validated before it is used by every WhatsApp link", () => {
  for (const phone of [
    "",
    "+51 977 783 926",
    "51977783926?text=other",
    "00000000",
  ]) {
    const c = structuredClone(defaultContent);
    c.contact.phone = phone;
    assert.throws(() => validateContent(c), /WhatsApp/);
  }
});
test("invalid stored documents and oversized content are rejected", () => {
  for (const value of [null, {}, [], { version: 2 }])
    assert.throws(() => validateContent(value));
  const c = structuredClone(defaultContent);
  c.copy.heroDescription = "x".repeat(3001);
  assert.throws(() => validateContent(c));
});
test("duplicate IDs cannot corrupt item selection or ordering", () => {
  const c = structuredClone(defaultContent);
  c.experiences[1].id = c.experiences[0].id;
  assert.throws(() => validateContent(c));
});
test("editing a draft does not mutate default/public fallback", () => {
  const c = structuredClone(defaultContent);
  c.copy.heroTitle = "Borrador";
  c.experiences[0].price = "Consultar";
  assert.equal(defaultContent.copy.heroTitle, "LA FIESTA");
  assert.equal(defaultContent.experiences[0].price, "S/750");
});
