# SOHO Architects

Website for SOHO Architects, an interior and architecture studio based in Kozhikode, Kerala.

Built on Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, Motion 12, Sanity v5, and Resend.

```bash
npm run dev          # dev server (port 3000)
npm run build        # production build (requires real Sanity env)
npm run typecheck    # tsc --noEmit
npm run lint
npm run import:csv   # one-shot: parse Ref/Project Detail.csv, upload images, createOrReplace project docs
```

Sanity Studio is embedded at `/admin` (the public About page lives at `/studio`).

## Working in this repo

See [AGENTS.md](AGENTS.md) for the full project guide — stack details, env vars, repo shape, conventions, design tokens, gotchas, and deployment workflow. The session log (current state, open items, what's done) is in [STATUS.md](STATUS.md).

## Routes

| Path | Purpose |
|---|---|
| `/` | Home — hero + selected work + studio teaser |
| `/projects` | Project index |
| `/projects/[slug]` | Project detail — hero, meta, sections, gallery, nav, sticky CTA |
| `/studio` | About / studio page |
| `/inquiries` | Inquiry form (Resend) |
| `/admin` | Sanity Studio (private) |
| `/dev/preview` | Design-system showcase |

## Theming

Two themes — dark is the default. Toggle lives top-right of the header; preference persists to `localStorage("theme")`. Pre-hydration inline script in `app/layout.tsx` (loaded via `next/script` with `beforeInteractive` strategy) applies the stored theme before paint to avoid flash. Color tokens flip semantically; fixed `--color-light` / `--color-dark` tokens are used for image overlays + the lightbox so they read correctly in both modes.
