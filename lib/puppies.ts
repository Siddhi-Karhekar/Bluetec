import data from "@/data/puppies.json";

export type Media = {
  kind: "image" | "video";
  src: string;
  alt: string;
  pos: string;
  color: string | null;
  width?: number;
  height?: number;
  /** Video file when kind === "video" (src is then the poster frame). */
  video?: string;
  duration?: number | null;
};

export type Puppy = {
  id: string;
  slug: string;
  name: string;
  breed: string;
  gender: string;
  age: string;
  origin: "local" | "imported";
  status: "available" | "gone";
  breeds: string[];
  /** Curated groups, e.g. "korean-teacup". */
  collections: string[];
  /** "male" | "female" | "male-female" (a pair/litter). */
  sex: string;
  cover: Omit<Media, "kind">;
  media: Media[];
  /** Dominant colour of the cover photo, used to tint the profile page. */
  tint: string;
};

const all = data.puppies as Puppy[];
const bySlug = new Map(all.map((p) => [p.slug, p]));

export const availablePuppies = data.available.map((s) => bySlug.get(s)!);
export const gonePuppies = data.gone.map((s) => bySlug.get(s)!);
export const allPuppies = all;

export function getPuppy(slug: string) {
  return bySlug.get(slug);
}

/** A puppy has its own name when it isn't just listed by breed. */
export const hasName = (p: Puppy) => p.name !== p.breed;

export const hasVideo = (p: Puppy) => p.media.some((m) => m.kind === "video");

/** Previous / next puppy within the same list (wraps around). */
export function neighbours(p: Puppy) {
  const list = p.status === "available" ? availablePuppies : gonePuppies;
  const i = list.findIndex((x) => x.slug === p.slug);
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export const BREEDS = [
  { slug: "maltipoo", name: "Maltipoo" },
  { slug: "pomeranian", name: "Pomeranian" },
  { slug: "poodle", name: "Poodle" },
  { slug: "cavapoo", name: "Cavapoo" },
  { slug: "shih-tzu", name: "Shih Tzu" },
] as const;

export type PuppyFilter = { origin?: string; collection?: string; breed?: string; gender?: string };

export const COLLECTIONS = [{ slug: "korean-teacup", name: "Korean Teacup" }] as const;

/** Read a filter from URL search params, ignoring unknown values. */
export function parseFilter(sp: Record<string, string | string[] | undefined>): PuppyFilter {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const origin = one("origin");
  const collection = one("collection");
  const breed = one("breed");
  const gender = one("gender");
  return {
    origin: origin === "local" || origin === "imported" ? origin : undefined,
    collection: COLLECTIONS.some((c) => c.slug === collection) ? collection : undefined,
    breed: BREEDS.some((b) => b.slug === breed) ? breed : undefined,
    gender: gender === "male" || gender === "female" ? gender : undefined,
  };
}

export function filterPuppies(list: Puppy[], f: PuppyFilter) {
  return list.filter(
    (p) =>
      (!f.origin || p.origin === f.origin) &&
      (!f.collection || p.collections.includes(f.collection)) &&
      (!f.breed || p.breeds.includes(f.breed)) &&
      (!f.gender || p.sex === f.gender || p.sex === "male-female"),
  );
}

/** "boy", "girl", "boy & girl" */
export const genderWord = (p: Puppy) => p.gender.toLowerCase();

/** Alt text for a puppy's cover photo. */
export const coverAlt = (p: Puppy) => p.cover.alt || p.media[0]?.alt || `${p.name} puppy`;
