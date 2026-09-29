import type { Asset } from "../data/siteContent";
export type Ordered = { id: string; enabled: boolean };
export type Stat = Ordered & { value: string; suffix: string; label: string };
export type Testimonial = Ordered & {
  name: string;
  comment: string;
  stars: number;
  source: string;
  sourceUrl: string;
  eventId: string;
  avatar: Asset | null;
  video: Asset | null;
};
export type BeforeAfter = Ordered & {
  title: string;
  description: string;
  district: string;
  eventId: string;
  before: Asset | null;
  after: Asset | null;
};
export type Addon = Ordered & {
  name: string;
  price: number | null;
  description: string;
  image: Asset | null;
  compatibleWith: string[];
  priceMode: "fixed" | "from" | "consult";
};
export type AgeGuide = Ordered & {
  title: string;
  description: string;
  activities: string[];
};
export type CorporateClient = Ordered & { name: string; logo: Asset | null };
export type Landing = Ordered & {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { title: string; body: string }[];
  experienceIds: string[];
  asset: Asset | null;
  seoTitle: string;
  seoDescription: string;
  cta: string;
  kind: "service" | "corporate" | "live" | "ages" | "spaces";
};
export type EvolutionContent = {
  stats: Stat[];
  testimonials: Testimonial[];
  beforeAfter: BeforeAfter[];
  addons: Addon[];
  ageGuides: AgeGuide[];
  corporateClients: CorporateClient[];
  landings: Landing[];
  showRecommendation: boolean;
  showBuilder: boolean;
};
export type EventDetails = {
  celebrationType: string;
  guests: number | null;
  space: string;
  experienceId: string;
  challenge: string;
  solution: string;
  result: string;
  services: string[];
  tags: string[];
  testimonial: string;
  cta: string;
  seoTitle: string;
  seoDescription: string;
};
