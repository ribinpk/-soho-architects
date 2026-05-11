<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# SOHO Architects — project guide

Website for SOHO Architects, an interior and architecture studio based in Kozhikode, Kerala. Replaces an old Framer free-plan site. Heritage Studio Framer template is a **design register reference only** (editorial, serif-led, cream backgrounds, slow motion) — never copy specific layouts, code, or assets from it.

## Stack

| | Version | Notes |
|---|---|---|
| Next.js | 16.2.6 | App Router, Turbopack, async `params` |
| React | 19.2 | |
| Tailwind | 4 | `@theme` design tokens in `app/globals.css` |
| Motion | 12 | Imported from `motion/react` (not `framer-motion`) |
| Sanity Studio | 5.24 | Embedded at `/admin` (not `/studio` — `/studio` is the public About page) |
| next-sanity | 12.4 | `NextStudio` must be loaded via `next/dynamic({ ssr: false })` to avoid `createContext`/`window` SSR errors |
| Resend | 6.12 | Inquiry form sender |
| Hosting | Vercel | Push to `main` auto-deploys |
| CMS dataset | Public | But Sanity v5 still gates reads behind tokens — see Gotchas |

## Commands

```bash
npm run dev          # dev server (port 3000)
npm run build        # production build (requires real Sanity env)
npm run typecheck    # tsc --noEmit
npm run lint
npm run import:csv   # one-shot: parse Ref/Project Detail.csv, upload images, createOrReplace 6 project docs
```

## Env vars

`.env.local.example` is the template. Real values live in `.env.local` (gitignored). Required:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — currently `aaqpdktf`
- `NEXT_PUBLIC_SANITY_DATASET` — `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` — `2025-05-01`
- `SANITY_API_WRITE_TOKEN` — Editor-role token. Also used by the read client server-side (see Gotchas)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — must be on a Resend-verified domain
- `INQUIRY_RECIPIENT_EMAIL`
- `NEXT_PUBLIC_SITE_URL` — production URL

## Repo shape

```
app/
  layout.tsx              root; loads theme bootstrap inline script via next/script
  (site)/                 public site (header + footer layout)
    layout.tsx            wraps with Header + Footer + Cursor
    template.tsx          client; per-route curtain wipe + fade-up
    page.tsx              home (SplitText headline, Marquee strip)
    projects/page.tsx     index
    projects/[slug]/      detail (async params; generateStaticParams catches errors)
                          mounts ScrollProgress, SectionDots, StickyInquireCta
    studio/page.tsx       About / studio page (NOT Sanity Studio)
    inquiries/            form + Resend server action
  admin/[[...tool]]/      Sanity Studio mount
    page.tsx              client; next/dynamic({ssr:false}) loads Studio.tsx
    Studio.tsx            the actual NextStudio + config — never imported server-side
    layout.tsx            own metadata; does NOT re-export from next-sanity/studio
  dev/preview/            design-system showcase page
  sitemap.ts, robots.ts, not-found.tsx
components/
  site/                   Header, Footer, Logo, MobileNav, ProjectCard,
                          InquiryForm (floating labels + shake), InquiryCta,
                          ThemeToggle (sun/moon, top-right of Header)
  project/                ProjectHero (scale + parallax + text drift),
                          ProjectMeta (CountUp on year), ProjectSection,
                          ProjectGallery, GalleryGrid (mobile snap-x carousel),
                          ProjectNav, SectionDots (mobile section indicator),
                          StickyInquireCta (mobile, scroll-aware)
  sanity/                 SanityImage (client), PortableText
  ui/                     Container, Reveal, ImageReveal,
                          Lightbox (pinch-to-zoom + double-tap),
                          Cursor (custom cursor; morphs per context),
                          Magnetic (CTA wrapper, desktop-only pull),
                          Marquee (continuous tagline scroll),
                          ScrollProgress (top hairline, project detail),
                          SplitText (word-by-word stagger), CountUp
  seo/                    JsonLd
lib/
  utils.ts, types.ts, resend.ts
  inquiry/                Zod schema + email template
sanity/
  env.ts, structure.ts
  lib/                    client (server-only), image, queries (GROQ), fetch
  schemas/                project, studioPage, siteSettings, inquiry, blocks/portableText
sanity.config.ts          Studio config (singleton-aware)
scripts/
  import-from-csv.ts      CSV → Sanity importer
Ref/                      source CSV + 114 original images (gitignored)
public/brand/
  logo.png                2480x1276 wordmark
```

## Gotchas (read these before touching the obvious)

1. **Sanity Studio at `/admin`, not `/studio`.** `/studio` is the site's public About page.
2. **`next-sanity/studio` must be lazy-loaded.** Importing it server-side hits `createContext`/`window` errors. See `app/admin/[[...tool]]/page.tsx` for the `next/dynamic({ssr:false})` pattern.
3. **Public Sanity dataset still needs a token.** Sanity v5 gates document reads even on "Public" datasets. `sanity/lib/client.ts` uses `SANITY_API_WRITE_TOKEN` server-side as a read token. Site reads happen in server components only — no token reaches the browser (`server-only` import enforces this).
4. **`SanityImage` is `"use client"`.** It passes a `loader` function to `next/image`; functions can't cross the server→client boundary, so the whole module is client-side.
5. **CSV importer is idempotent.** Each project uses `_id: project.<slug>` with `createOrReplace`. Re-running updates rather than duplicating. Image uploads cached at `sanity-import-cache/url-to-asset.json` (gitignored).
6. **HTML body fields in the CSV embed `<img>` tags pointing at `framerusercontent.com`.** The importer downloads each, preferring local files in `Ref/` by hash. Once the old Framer site goes offline, only locally-cached images remain — re-running won't re-fetch missing remotes.
7. **No Next.js loader function in image components called from server components.** Either mark the wrapper `"use client"` or skip the loader prop.
8. **Theme is set on `<html data-theme="...">`, not a class.** Dark is the default. The pre-hydration bootstrap script in `app/layout.tsx` loads via `next/script` with `strategy="beforeInteractive"` — it reads `localStorage("theme")` and applies the preference before paint.
9. **CSS var() updates can stick when JS changes the source variable mid-transition.** The `ThemeToggle` adds a `no-theme-transition` class for one frame around the swap to force the browser to commit the new resolved values. Don't remove this — toggling without it leaves stale resolved colors on body/header until a forced reflow.
10. **Fixed (non-flipping) colors for image overlays.** Use `text-light` / `bg-dark` (or `text-light/70`, `from-dark/65`, etc.) on anything that must stay legible *over photography* (hero overlay, lightbox bg, image caption pills). The semantic `cream`/`ink` tokens flip with theme, so they don't work for those cases.
11. **Most fancy animations rely on `motion/react`. Don't import from `framer-motion`** — they're related libraries but the package names differ. Animations that should respect reduced-motion either gate on `useReducedMotion()` (e.g., template curtain) or skip rendering entirely (e.g., `Cursor`, `Magnetic`).
12. **Reveal animations + IntersectionObserver get disrupted by forced reflow.** If you touch DOM in a way that triggers `display:none → ''` cycles on `<html>`, `whileInView` triggers reset. The theme toggle avoids this — don't reintroduce it.

## Design tokens

In `app/globals.css` under `@theme` (light defaults) with overrides in `[data-theme="dark"]`. Key tokens:

- **Semantic colors (flip with theme):** `cream`, `paper`, `surface`, `hairline`, `ink`, `ink-soft`, `mute`, `mute-soft`
- **Fixed colors (never flip):** `light` (#f5f1ea), `dark` (#13110f) — use on photo overlays + lightbox
- Fonts: `font-serif` (Fraunces), `font-sans` (Inter)
- Type: `text-display`, `text-headline`, `text-title`, `text-subtitle`, `text-body-lg`, `text-eyebrow`
- Motion: `--ease-soft`, `--ease-editorial`, `--duration-quick/soft/cinematic`
- Utilities: `.eyebrow`, `.with-dropcap`, `.press` (tactile press: scale 0.97 on `:active`, stronger on coarse pointer), `.shake` (40 keyframe error shake), `.no-theme-transition` (kill transitions for one frame during theme swap)

## Theming

Two themes — dark default. State stored on `<html data-theme="dark|light">`. Toggle in `components/site/ThemeToggle.tsx` (header top-right). Persists to `localStorage("theme")`. Pre-hydration script (loaded via `next/script` with `beforeInteractive` strategy) applies the stored preference before paint to avoid flash.

When adding a new themed surface or text:
- Use semantic tokens (`bg-cream`, `text-ink`, `border-hairline`, etc.) — they flip automatically.
- Use fixed tokens (`bg-dark`, `text-light`) **only** when the element overlays photography or otherwise needs to look the same in both modes.

The Logo is monochrome and inverts in dark mode via the `.logo-image` class + `[data-theme="dark"]` selector in `globals.css` (`filter: invert(1) hue-rotate(180deg)`). If we ever add color or a dedicated light-variant asset, swap this approach.

## Animation primitives

- **`Reveal` / `ImageReveal`** — in-view fade-up / clip-path reveal. Both client.
- **`SplitText`** — word-by-word stagger for editorial headlines (e.g., home hero). Uses `motion` variants + clipped `inline-block` wrappers.
- **`CountUp`** — counts from `to - span` up to `to` on first scroll into view. Used on `ProjectMeta` year.
- **`Magnetic`** — wraps a single interactive element; pulls it toward the cursor on `(pointer: fine)` + non-reduced-motion only. Used on primary CTAs in `InquiryCta`.
- **`Marquee`** — continuously-scrolling tagline strip; duplicates content for seamless loop.
- **`ScrollProgress`** — spring-tracked 2px hairline at top, mounted on project detail pages.
- **`Cursor`** — custom cursor mounted in `(site)/layout.tsx`. Renders only when `(pointer: fine)` and not `(prefers-reduced-motion: reduce)`. Native cursor hidden via `html.custom-cursor-on` class. Morphs per context: default dot (1×) → hover ring (2.6×) over interactive elements → image (3.5×) over `img/picture/video` → text I-beam (0.28×3 / 2.4×) over `[data-cursor="text"]` → view pill (5.5×) over `[data-cursor="view"]`. Explicit `data-cursor` always wins.
- **`SectionDots`** — mobile-only floating section indicator on project detail; observes section IDs (`overview`, `approach`, `details`, `gallery`) and highlights the one in view. Hidden until scrolled past 40% of viewport height.
- **Page curtain** — `app/(site)/template.tsx` plays a 0.75s clipPath curtain wipe + 0.55s content fade-up on route mount. Skips both via `useReducedMotion()` (same DOM, just zero-duration transitions, to avoid hydration mismatch).

## Mobile conventions

- Tap targets ≥ 44px on header, footer nav, lightbox close, mobile-nav close (`size-11` or `min-h-11`).
- Inputs are at least 16px on `< 768px` via a global rule in `@layer base` so iOS doesn't zoom on focus.
- Hero uses `h-[70dvh] md:h-[88dvh]` so the address bar collapse doesn't jump.
- Gallery on mobile is a horizontal `snap-x snap-mandatory` carousel with momentum scroll + `overscroll-x-contain`; reverts to a 2-col grid at `md`.
- `StickyInquireCta` slides in from the bottom on scroll-up after 480px (mobile only). Direction tracked with up/down thresholds to ignore layout-shift jitter.
- `MobileNav` uses a spring slide, staggers nav items in, respects safe-area insets, locks body scroll while open.
- Lightbox supports pinch-to-zoom on mobile (pointer-event-based, scales 1–4×) and double-tap to toggle 2× zoom. While zoomed, swipe-to-navigate is disabled.

## Conventions

- Mobile-first. Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- Server components by default; `"use client"` only where needed (state, refs, motion hooks, browser APIs).
- Each page calls Sanity via `sanityFetch<T>(query, { tags })` from `sanity/lib/fetch.ts`. `revalidate = 60` at the page level.
- `generateStaticParams` for `[slug]` routes wraps Sanity calls in try/catch returning `[]` — keeps builds resilient when Sanity is briefly unreachable.
- All in-view reveals use `Reveal` (fade-up) or `ImageReveal` (clip-path top-down). Both client.
- Cross-page transitions: `app/(site)/template.tsx` (curtain wipe + content fade-up).
- Studio content: Site Settings and Studio Page are **singletons** — see `sanity/structure.ts`.
- Project sections have a per-section `layoutVariant` ("standard", "full-bleed", "stacked") on the Sanity schema; the `ProjectSection` component renders each variant differently. GROQ coalesces missing values to `"standard"`.
- Interactive elements (links, buttons) take the `press` utility class for tactile feedback. Primary CTAs may additionally be wrapped in `Magnetic` for cursor pull (desktop only).
- Project detail pages set `id` props on each section (`overview`, `approach`, `details`, `gallery`) so `SectionDots` can target them.

## Workflows

**Seeding content from CSV** (first time on a fresh Sanity project):
1. Fill `.env.local` with project id + write token
2. `npm run import:csv` → 6 projects, ~76 images, idempotent
3. Open `/admin` → review, swap covers with hi-res via Studio, fill Site Settings + Studio Page singletons

**Deploying:**
1. Push to `main` on GitHub (`ribinpk/-soho-architects`, leading hyphen)
2. Vercel auto-builds; first time, paste env vars into Vercel project settings
3. After first deploy, add Vercel URL to Sanity → API → CORS origins (or Studio won't load on the deployed URL)
4. Update `NEXT_PUBLIC_SITE_URL` once production domain is set, redeploy

## What this codebase is NOT

- Not a 1:1 port of Heritage Studio Framer template — design reference register only
- Not configured to use sanity-codegen — manual types in `lib/types.ts`
- Not multi-language; English only
- No analytics / cookie banner / newsletter (intentional)
