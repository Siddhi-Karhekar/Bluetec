# TeddyPups U.A.E. — website clone

A full, responsive clone of **[puppy.instabizweb.com](https://puppy.instabizweb.com/)** built with
Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS v4 — created for the Blutec AI technical round.

- **Live:** _add your Vercel URL here_
- **Reference:** https://puppy.instabizweb.com/

> All brand content, photos and copy belong to the reference site's owner and are used only for this
> assessment.

---

## What's included

| Page              | Route             | Highlights                                                                                                                                                                                                           |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home              | `/`               | Puppy line-up peeking over a quilt, pinned horizontal "Meet the pups" door treadmill, two-ways signpost, WhatsApp chat that replays as you scroll, passport stamps, photo wall house, night-time FAQ, front door CTA |
| Available puppies | `/puppies`        | Hand-drawn sketch cards, sticker-chip filters (where / breed / boy or girl) kept in the URL, empty state, "gone home" strip                                                                                          |
| Puppy profile     | `/puppies/[slug]` | 42 statically generated profiles: photo book + thumbnails + full-screen viewer (photos & videos), name tag, "the way home" trail, enquiry form, previous/next pup, reading ribbon, JSON-LD breadcrumbs               |
| Gone home         | `/gone-home`      | "Ticket home" cards for every adopted puppy                                                                                                                                                                          |
| Happy families    | `/happy-families` | 64-photo polaroid wall with lightbox (keyboard + swipe)                                                                                                                                                              |
| How it works      | `/how-it-works`   | Accessible "In Dubai / Imported" tab switch, promise stamps, delivery, why-us                                                                                                                                        |
| FAQ               | `/faq`            | Cork-board notes that unfold, live search with highlighted matches                                                                                                                                                   |
| Visit & contact   | `/contact`        | "Dear TeddyPups" fill-in-the-blanks letter that folds into an envelope and drops in a mailbox                                                                                                                        |
| Extras            |                   | Page-transition blanket ("curtain"), mobile menu dialog, sticky mobile WhatsApp/Call bar, clickable Teddy mascot, custom 404, sitemap, robots, OG metadata                                                           |

## Tech stack

- **Next.js 15** (App Router, React Server Components, SSG for profiles, a Route Handler for enquiries)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** with the original design tokens in `@theme` (toffee / honey / cocoa / milk palette)
- **next/font/local** — self-hosted variable fonts: Fraunces (headings, `SOFT`/`WONK` axes), Figtree (body), Shantell Sans (handwriting)
- **Playwright** smoke tests (desktop + mobile)
- ESLint + Prettier, deployed on **Vercel**

No UI library and no animation library — motion is CSS (keyframes, transitions, scroll-driven animations) plus a few
small, dependency-free client "behaviours".

## Project structure

```
app/
  layout.tsx            fonts, metadata, header/footer/curtain, behaviours
  page.tsx              home (composes components/home/*)
  puppies/page.tsx      listing + filters (server-rendered from URL params)
  puppies/[slug]/       42 static puppy profiles (generateStaticParams)
  gone-home, happy-families, how-it-works, faq, contact
  api/enquiry/route.ts  POST endpoint, shared validation + honeypot
  globals.css           Tailwind import, @theme tokens, custom @utility classes
  styles/               base.css · components.css (btn, chip, boards…) · scenes.css (illustrations & motion)
components/
  layout/               SiteHeader (scroll state + mobile <dialog>), SiteFooter, StickyBar, Curtain
  home/                 one component per home "scene"
  puppies/              Sketch card, PuppyFilters, PuppyGallery, EnquiryForm
  families/, faq/, contact/, ui/Lightbox.tsx
  behaviours/           progressive-enhancement modules (reveal, scenes, treadmill, chat, lineup, switch, ribbon…)
  Teddy.tsx             the mascot as one rigged SVG with pose presets (sit/stand/peek/play/basket)
  Photo.tsx, icons.tsx, Twinkles.tsx
lib/
  puppies.ts            typed data access, filters, neighbours, labels
  sketch.ts             seeded procedural "hand-drawn" frames for puppy cards
  content.ts, site.ts, enquiry.ts
data/                   puppies.json (42), families.json (64 photos), faqs.json (9)
public/media            puppy & family photos, videos
tests/smoke.spec.ts     Playwright journeys
scripts/porting/        one-off helpers used while porting markup (see its README)
```

## Key implementation decisions

1. **Server-first, progressive enhancement.** Every page is fully rendered on the server and readable without JS.
   Interactivity is layered on: real React state where the UI is app-like (filters, FAQ board, galleries, forms,
   menu, curtain), and tiny DOM "behaviours" (`components/behaviours/*`) that only toggle `data-*` attributes the
   stylesheet already understands (`data-revealed`, `data-here`, `data-open`, `data-pinned`…). Each behaviour
   returns a cleanup and re-runs on client navigation.
2. **Data-driven content.** Puppies, family photos and FAQs live in typed JSON; components map over them. Adding a
   puppy = one JSON entry, and its profile, card, door, ticket, sitemap entry and form option all appear.
3. **One rigged mascot.** Teddy appears ~15 times in 5 poses. Instead of 15 copies of a 9 KB SVG, `Teddy.tsx` holds
   the drawing once and each pose is just a table of transforms per body part.
4. **Procedural sketches.** The wobbly outlines, watercolour washes and doodles around puppy cards are generated
   from a PRNG seeded by the puppy's slug — unique per card but identical on server and client (no hydration
   mismatch).
5. **URL as state for filters.** `/puppies?collection=korean-teacup&gender=male` is shareable and rendered on the
   server; the chips just `router.replace` the query.
6. **The pinned treadmill.** On wide screens the section height is set to `track width − viewport + 100vh`, the stage
   is `position: sticky`, and scroll progress translates the track; the door nearest the centre opens. On small
   screens / reduced motion it falls back to a grid.
7. **Accessibility.** Native `<dialog>` for menu & viewers (focus trap, Esc), ARIA tabs with arrow-key support,
   `aria-expanded` notes with `inert` closed answers, live regions for counts, skip link, `prefers-reduced-motion`
   respected everywhere.
8. **Forms.** Validation is shared (`lib/enquiry.ts`) between client and the `/api/enquiry` route; a hidden honeypot
   field drops bots. The endpoint logs the enquiry — wiring it to email/CRM is a one-line change.

## Security

This is a public brochure site: there are no user accounts, admin area, database, payments or third-party API
keys, so there is nothing to log in to and no per-user data to leak. What is in place:

- **No secrets in the repo.** Nothing secret is needed; `.env*` files are git-ignored. The only env var,
  `NEXT_PUBLIC_SITE_URL`, is public by design.
- **Enquiry API (`/api/enquiry`)** — the only server endpoint:
  - same-origin only (cross-site POSTs get `403`) and no CORS headers, so other sites can't call it from a browser
    or read its responses
  - JSON only (`415` otherwise), 10 KB body cap, per-IP rate limit (5/min → `429`)
  - shared client/server validation with length limits; unknown puppy ids rejected; honeypot field for bots
  - never logs names, phone numbers or emails, and never returns stack traces
- **Security headers** on every response (`next.config.ts`): Content-Security-Policy (self-only sources,
  `frame-ancestors 'none'`, `object-src 'none'`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`; `X-Powered-By` removed.
- **No unsafe HTML.** User input is only ever rendered as text by React; the single `dangerouslySetInnerHTML` is
  static JSON-LD with `<` escaped.
- **Dependencies:** `npm audit` reports 0 vulnerabilities (a vulnerable transitive `postcss` is pinned via
  `overrides`).
- **Tests** cover the API hardening and headers (`tests/smoke.spec.ts`).

The in-memory rate limiter is per server instance; for real traffic it would move to a shared store
(e.g. Redis) or Vercel's firewall rate-limit rules.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

Quality checks:

```bash
npm run lint
npm run typecheck
npx playwright install chromium   # first time only
npm run test:e2e                  # 16 checks × desktop + mobile
```

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel → **Add New… → Project** → import the repo (framework auto-detected as Next.js, no settings needed).
3. Optional env var: `NEXT_PUBLIC_SITE_URL=https://<your-domain>` (used for canonical URLs, sitemap, JSON-LD).
4. Deploy — every push to `main` redeploys.

## Known differences from the reference

- The reference has a free-roaming Teddy that walks between sections following your scroll; in this clone Teddy
  sits at each of his spots (breathing, blinking and answering when clicked) instead of roaming.
- Enquiries are validated and accepted by the API route but not forwarded anywhere (the reference posts to its own
  backend).
- Photos are served as pre-optimised static files rather than through `next/image` resizing.
