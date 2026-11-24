import families from "@/data/families.json";
import faqs from "@/data/faqs.json";

export type FamilyPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  color: string;
};

export const familyPhotos = families.photos as FamilyPhoto[];
export const homeWallPhotos = families.home.map((h) => familyPhotos.find((p) => p.src === h.src)!);

export type Faq = { id: string; question: string; answer: string };
export const FAQS = faqs as Faq[];

/** Polaroid styling cycles used on every photo wall. */
const TILTS = ["-2.2deg", "1.6deg", "-0.9deg", "2.4deg", "-1.5deg", "0.8deg", "-2.6deg", "1.2deg"];
const TAPE_COLORS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];
const TAPE_KINDS = [
  ["center"],
  ["left"],
  ["right"],
  ["tl", "tr"],
  ["center"],
  ["right"],
  ["left"],
  ["center"],
];

export function polaroidLook(i: number) {
  return {
    tilt: TILTS[i % TILTS.length],
    tape: TAPE_COLORS[i % TAPE_COLORS.length],
    tapes: TAPE_KINDS[i % TAPE_KINDS.length],
  };
}

export const TESTIMONIAL = {
  quote:
    "TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.",
  name: "Sarah M.",
  place: "Dubai, UAE",
};
