import type { Experience } from "./siteContent";
export const ageOptions = [
  "6-8",
  "9-11",
  "12-14",
  "15-17",
  "Adultos",
  "Empresa/colegio",
];
export const preferenceOptions = [
  "Bailar",
  "Karaoke",
  "Juegos",
  "Just Dance",
  "Animación",
  "Pista LED",
  "Todo",
];
export const guestOptions = ["1-15", "16-30", "31-50", "51+"];
export const spaceOptions = [
  "Casa",
  "Departamento",
  "Salón",
  "Local",
  "Exterior",
  "Aún no sé",
];
export type Answers = {
  age: string;
  preferences: string[];
  guests: string;
  space: string;
};
export const profiles: Record<
  string,
  { ages: string[]; preferences: string[] }
> = {
  home: {
    ages: ["6-8", "9-11"],
    preferences: ["Animación", "Juegos", "Just Dance"],
  },
  neon: {
    ages: ["9-11", "12-14"],
    preferences: ["Animación", "Juegos", "Just Dance"],
  },
  chicoteca: {
    ages: ["12-14", "15-17", "Adultos"],
    preferences: ["Bailar", "Karaoke"],
  },
  "club-led": {
    ages: ["12-14", "15-17", "Adultos"],
    preferences: ["Bailar", "Pista LED"],
  },
  led: {
    ages: ["9-11", "12-14", "15-17"],
    preferences: ["Pista LED", "Animación", "Todo"],
  },
  decoration: {
    ages: ["9-11", "12-14", "15-17"],
    preferences: ["Pista LED", "Todo"],
  },
};
export function recommend(experiences: Experience[], answers: Answers) {
  if (
    !ageOptions.includes(answers.age) ||
    !guestOptions.includes(answers.guests) ||
    !spaceOptions.includes(answers.space) ||
    !answers.preferences.length ||
    answers.preferences.some((p) => !preferenceOptions.includes(p))
  )
    return [];
  if (answers.age === "Empresa/colegio") return [];
  return experiences
    .filter((x) => x.enabled)
    .map((x) => {
      const profile = profiles[x.id];
      const ages = x.ages ?? profile?.ages ?? [];
      const preferences = x.preferences ?? profile?.preferences ?? x.tags;
      let score = ages.includes(answers.age) ? 4 : 0;
      score +=
        answers.preferences.filter((p) => preferences.includes(p)).length * 3;
      if (
        answers.preferences.includes("Todo") &&
        ["led", "decoration"].includes(x.id)
      )
        score += 4;
      if (
        ["12-14", "15-17"].includes(answers.age) &&
        answers.preferences.includes("Bailar") &&
        answers.preferences.includes("Karaoke") &&
        x.id === "home"
      )
        score += 8;
      if (
        answers.space === "Departamento" &&
        ["home", "chicoteca"].includes(x.id)
      )
        score += 1;
      if (
        x.guests &&
        Number(answers.guests.split("-")[0].replace("+", "")) > x.guests
      )
        score -= 5;
      return {
        experience: x,
        score,
        reason:
          preferences
            .filter((p) => answers.preferences.includes(p))
            .join(" + ") || "Alternativa para comparar con tu grupo",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
