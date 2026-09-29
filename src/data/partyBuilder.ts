import type { Experience } from "./siteContent";
import type { Addon } from "../types/evolution";
export function priceNumber(price: string): number | null {
  const match = price.match(
    /^\s*(?:desde\s*)?S\/\s*((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?)\s*$/i,
  );
  return match ? Number(match[1].replaceAll(",", "")) : null;
}
export const money = (value: number) =>
  `S/${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
export const displayPrice = (price: string) =>
  priceNumber(price) === null
    ? price
    : `${/^desde/i.test(price) ? "Desde " : ""}${money(priceNumber(price)!)}`;
export const compatibleAddons = (addons: Addon[], id: string) =>
  addons.filter(
    (a) =>
      a.enabled &&
      (!a.compatibleWith.filter((x) => x.trim()).length ||
        a.compatibleWith.includes(id)),
  );
export function calculateParty(
  base: Experience | undefined,
  addons: Addon[],
  selected: string[],
) {
  if (!base || !base.enabled)
    return { base: null, addons: [], total: null, consult: true, from: false };
  const chosen = compatibleAddons(addons, base.id).filter((a) =>
    new Set(selected).has(a.id),
  );
  const price = priceNumber(base.price);
  return {
    base,
    addons: chosen,
    total:
      price === null
        ? null
        : Math.round(
            (price +
              chosen.reduce(
                (n, a) => n + (a.priceMode === "consult" ? 0 : (a.price ?? 0)),
                0,
              )) *
              100,
          ) / 100,
    consult: price === null || chosen.some((a) => a.priceMode === "consult"),
    from:
      /^desde/i.test(base.price) || chosen.some((a) => a.priceMode === "from"),
  };
}
