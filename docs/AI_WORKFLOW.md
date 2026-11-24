# How AI was used

**Tool:** Claude (Anthropic) — Opus model, in the Claude desktop app with its built-in browser, a cloud Linux
workspace (Node, Python, headless Chrome) and access to my project folder.

## Prompt

The task was started by pasting the assignment email from Blutec AI into Claude, verbatim (the "Clone the Complete
Website … https://puppy.instabizweb.com/ … Deploy the website … GitHub repository … Loom video" brief), followed by
my repository link `Siddhi-Karhekar/Bluetec`. Claude then asked one question — permission for its browser to save a
snapshot of the reference site (HTML, CSS, fonts, images) to my Downloads folder — which I approved.

## What the AI did, step by step

1. **Inspected the reference** in a real browser: page list, computed fonts/colours, the compiled stylesheet
   (Tailwind v4 theme tokens + ~95 KB of custom illustration/animation CSS), and the data embedded in the Next.js
   RSC payload (15 available puppies with media, 64 family photos, 9 FAQs). Interactive parts that only exist
   client-side (puppy filters, empty states, the posted-letter flow) were explored by clicking through them.
2. **Captured assets** (photos, videos, fonts, logo) and the server-rendered HTML of every page into one archive.
3. **Scaffolded** Next.js 15 + TypeScript + Tailwind v4, moved the design tokens into `@theme`, self-hosted fonts.
4. **Ported markup** with two small helper scripts (`scripts/porting/`) to get a first JSX draft, then refactored by
   hand: typed data in `data/*.json`, `.map()` instead of copied lists, a single rigged `Teddy` SVG with pose
   presets, shared `Photo`, `Lightbox`, icons.
5. **Re-implemented behaviour** the reference does in JS: page-transition curtain, header hide-on-scroll, mobile
   menu, reveal-on-scroll, pinned horizontal door treadmill, chat replay, hero line-up, tabs, galleries, FAQ
   search/unfold, puppy filters in the URL, contact letter animation, enquiry API with shared validation.
6. **Verified** with `tsc`, ESLint, `next build`, side-by-side screenshots against the reference (desktop + mobile)
   and a Playwright suite (32 passing runs: 16 checks × desktop/mobile).
