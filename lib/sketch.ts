/**
 * Procedural "hand-drawn" frames for the puppy sketch cards.
 *
 * Every card gets a wobbly blob (watercolour wash, photo mask and ink
 * outline) plus a few doodles. Shapes are generated from a seeded PRNG keyed
 * on the puppy's slug, so each card always looks the same between renders
 * (no hydration mismatch) while no two cards look alike.
 */

/** Small, fast deterministic PRNG. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

type Pt = [number, number];
const f = (n: number) => n.toFixed(2);

/** Closed blob around (50,50): a few low-frequency waves plus jitter. */
function blobPoints(rand: () => number, r: number, wobble: number, n = 40): Pt[] {
  const waves = [2, 3, 5].map((k) => ({ k, a: (rand() * 2 - 1) * wobble, p: rand() * Math.PI * 2 }));
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    let rr = r;
    for (const w of waves) rr += w.a * Math.sin(w.k * t + w.p);
    rr += (rand() * 2 - 1) * wobble * 0.06;
    return [50 + rr * Math.cos(t), 50 + rr * Math.sin(t)];
  });
}

/** Catmull-Rom spline through the points, as cubic Béziers. */
function smooth(pts: Pt[], closed = true) {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1),
      p1 = at(i),
      p2 = at(i + 1),
      p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

const DOODLES = ["swirl", "paw", "whiskers", "dots", "sparkle", "heart"] as const;
export type DoodleKind = (typeof DOODLES)[number];
const INKS = ["#c2622b", "#a24a1a", "#2a170e", "#d4893f"];
const WASHES = ["#f2be6b", "#bfddf5", "#fbe3b4", "#e8c39a", "#f9cdbf"];

/** Doodles sit just outside the frame: left edge, top-left corner, right edge. */
const ANCHORS: Array<(r: () => number) => Pt> = [
  (r) => [-8.5 + r() * 4.5, 38 + r() * 34],
  (r) => [6 + r() * 20, -4 + r() * 25],
  (r) => [100 + r() * 8, 36 + r() * 40],
];

export type Doodle = { kind: DoodleKind; color: string; transform: string };

export type SketchArt = {
  tilt: string;
  wash: string;
  washShift: string;
  washPath: string;
  maskPath: string;
  inkPath: string;
  retracePath: string;
  doodles: Doodle[];
};

export function sketchArt(key: string): SketchArt {
  const rand = mulberry32(hash(key));
  const ink = blobPoints(rand, 49.6, 1.4);
  // retrace: a second pass over ~a quarter of the outline, slightly off
  const start = 9 + Math.floor(rand() * 8);
  const seg = ink
    .slice(start, start + 12)
    .map(([x, y]): Pt => [x + (rand() - 0.5) * 1.6, y + (rand() - 0.5) * 1.6]);
  const anchors = [...ANCHORS].sort(() => rand() - 0.5).slice(0, 2 + (rand() > 0.55 ? 1 : 0));
  return {
    tilt: `${((rand() * 2 - 1) * 2.4).toFixed(2)}deg`,
    wash: WASHES[Math.floor(rand() * WASHES.length)],
    washShift: `${((rand() * 2 - 1) * 4.5).toFixed(1)}% ${(3 + rand() * 4).toFixed(1)}%`,
    washPath: smooth(blobPoints(rand, 46.5, 1.8)),
    maskPath: smooth(blobPoints(rand, 47, 1.3)),
    inkPath: smooth(ink),
    retracePath: smooth(seg, false),
    doodles: anchors.map((a) => {
      const [x, y] = a(rand);
      return {
        kind: DOODLES[Math.floor(rand() * DOODLES.length)],
        color: INKS[Math.floor(rand() * INKS.length)],
        transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${Math.round((rand() * 2 - 1) * 25)}) scale(${(0.85 + rand() * 0.35).toFixed(2)})`,
      };
    }),
  };
}

/** The blob as a CSS mask-image data URI (stretched to the photo box). */
export function maskUrl(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
