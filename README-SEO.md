# SEO — what was changed, what comes next

This documents the SEO work that shipped on `sohoarchitects.in` — goal is to rank in the top 3 Google results for "architects in Calicut" and related terms. It's the readme for anyone (you, a future developer, a marketing agency) who wants to understand what the site does for SEO and what's left to do.

If you only read one file, read this one.

---

## TL;DR

- Every page now has unique title, meta description, canonical, Open Graph, Twitter Card.
- Sitewide structured data — `ProfessionalService` (LocalBusiness subtype) with full NAP, geo, hours, area served, founders, knows-about. Per-page schemas: `BreadcrumbList`, `Service`, `FAQPage`, `Article`, `CreativeWork`, `ImageObject`, `WebSite`, `Blog`, `CollectionPage`, `ContactPage`, `AboutPage`.
- Four new pages — `/services` hub + three service detail pages targeting "Residential / Commercial / Interior" + "in Calicut" head terms.
- One new content surface — `/insights` blog (Sanity-driven) with full Article schema. 12 briefs ready in `seo/content-briefs.md`.
- Sitemap and robots.txt cover everything. Sitemap is dynamic — new projects and blog posts auto-included.
- Analytics infrastructure wired (GA4, GTM, Clarity, web-vitals) — gated on environment variables so nothing fires until you set the IDs.
- Conversion events instrumented on form submit, phone click, WhatsApp click, email click, portfolio view.
- HSTS + sensible security headers added on Netlify.

The site is **eligible** to rank top 3 now. The position is earned with the off-site work — Google Business Profile, reviews, citations, backlinks. See `seo/off-site-checklist.md`.

---

## File map

Anything in `seo/` is a markdown document for humans. Everything else is code.

```
README-SEO.md                        ← you are here
seo/
  off-site-checklist.md              ← GBP, citations, backlinks, reviews
  content-briefs.md                  ← 12 blog post briefs, full editorial details
  keyword-tracker.md                 ← monthly rank-tracking template
  needs-from-owner.md                ← env vars, brand assets, decisions only the owner can make
  README-MONITORING.md               ← how to monitor rankings in 5 min/week, 30 min/month

lib/seo.ts                           ← schema helpers (org, breadcrumbs, FAQ, service)
lib/analytics.ts                     ← gtag/dataLayer wrapper

components/analytics/                ← Analytics loader, EventTracker, WebVitalsReporter, TrackEvent
components/seo/JsonLd.tsx            ← schema renderer

app/robots.ts                        ← /admin, /dev excluded; sitemap pointer
app/sitemap.ts                       ← static + Sanity-driven dynamic entries
app/manifest.ts                      ← PWA manifest
app/layout.tsx                       ← root metadata, sitewide ProfessionalService schema, Analytics mount
app/(site)/                          ← public site routes — each has page-specific metadata + schemas
app/(site)/services/                 ← new in this work
app/(site)/insights/                 ← new in this work
app/(site)/thank-you/                ← new in this work, noindex

sanity/schemas/insightPost.ts        ← Sanity schema for blog posts
sanity/structure.ts                  ← Studio "Insights" menu item
sanity/lib/queries.ts                ← insightsIndexQuery, insightBySlugQuery, insightSlugsQuery
```

---

## What ranks for what (the cannibalization map)

Every primary keyword has exactly one canonical page. Don't add a second page targeting the same keyword without retiring the first.

| Keyword | Page |
|---|---|
| architects in Calicut / Kozhikode | `/` |
| best architecture firm in Calicut | `/studio` |
| architecture firms in Calicut (plural) | `/projects` |
| residential architects in Calicut | `/services/residential-architects-calicut` |
| commercial architects in Calicut | `/services/commercial-architects-calicut` |
| interior designers in Calicut | `/services/interior-designers-calicut` |
| Long-tail / how-to / cost / when queries | `/insights/<slug>` (one keyword per post) |
| Project-specific terms | `/projects/<slug>` |

If you ever add a new page, check the keyword-tracker first — make sure you're not splitting authority on a query that already has a champion page.

---

## Environment variables (the ones that affect SEO)

All optional. Site works without them — they unlock specific capabilities. Full setup instructions in `seo/needs-from-owner.md`.

| Env var | Effect when set | Effect when missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | All schema URLs, canonicals, OG urls resolve to this host | Falls back to localhost; production must set this |
| `NEXT_PUBLIC_GA4_ID` | GA4 page views + events fire | No analytics from GA4 standalone |
| `NEXT_PUBLIC_GTM_ID` | GTM container loads | No GTM |
| `NEXT_PUBLIC_CLARITY_ID` | Clarity heatmaps + recordings | No Clarity |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google site-verification meta tag | GSC needs DNS verification instead |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing site-verification meta tag | Bing needs DNS verification instead |
| `NEXT_PUBLIC_GBP_EMBED_URL` | Google Maps iframe on `/inquiries` | Iframe hidden |
| `NEXT_PUBLIC_GBP_MAP_URL` | `hasMap` field in LocalBusiness schema | Field omitted |
| `NEXT_PUBLIC_SAMEAS` | `sameAs` array in LocalBusiness schema | Empty array |
| `NEXT_PUBLIC_PRICE_RANGE` | Overrides default `₹₹₹` in schema | Defaults to `₹₹₹` |

---

## Conversion event taxonomy

These events fire when set up correctly. Mark the first three as **Key Events** in GA4 for conversion tracking.

| Event | Fires when | Where it's wired |
|---|---|---|
| `contact_form_submit` | Server action returns success | `components/site/InquiryForm.tsx` useEffect on `state.status === 'success'` |
| `phone_click` | Any `tel:` link clicked | Delegated listener via `data-event="phone_click"` attribute |
| `whatsapp_click` | WhatsApp FAB clicked | `data-event="whatsapp_click"` on the FAB |
| `email_click` | Any `mailto:` link clicked | `data-event="email_click"` on the link |
| `portfolio_view` | Any `/projects/[slug]` page rendered | `<TrackEvent name="portfolio_view" />` on project detail |
| `page_view` | Every SPA route change | `EventTracker` `usePathname` effect |
| `web_vitals` | Each Core Web Vital metric reports | `WebVitalsReporter` via `useReportWebVitals` |

If you ever want to track another link or interaction: add `data-event="<event_name>"` and optionally `data-event-source` / `data-event-value`. The global `EventTracker` picks it up. No code changes needed.

---

## What was deliberately NOT done

Things the brief mentioned but I left for the owner / later:

- **No cookie consent banner.** Site targets India, GDPR consent isn't required. If you ever target EU traffic, add one.
- **No newsletter signup.** Explicitly excluded by brief.
- **No social-share buttons.** Excluded by brief and largely a vestigial pattern in 2026.
- **No comments section** on blog posts. Excluded by brief.
- **No automatic `/locations/calicut` page.** Single-studio firm; the homepage IS the Calicut page. Revisit if you ever expand to Bangalore or Kochi.
- **No invention of business details.** Anything that needed a real number (priceRange, founder COA numbers, exact geo, etc.) is either env-overridable or left as TODO with a fallback that's defensible. See `needs-from-owner.md`.
- **No blog post drafts.** 12 briefs are ready; the writing is yours. The studio's voice should not come from me.
- **No paid-tier rank tracker.** GSC's "Average position" is free and accurate within ±1 rank for 80% of needs. Upgrade to SE Ranking / Ahrefs Lite if/when you need daily geo-specific tracking.

---

## How to run a quick health check

A weekly sanity check the owner or a developer can run in under 3 minutes:

```bash
# Site is up + sitemap accessible
curl -sI https://sohoarchitects.in | head -1
curl -s https://sohoarchitects.in/sitemap.xml | head -10
curl -s https://sohoarchitects.in/robots.txt
```

Then in a browser:
- View page source of `/`, search for `application/ld+json` — expect 3+ blocks
- Search the page source for `meta name="description"` — expect a unique description per page
- Open `/inquiries`, submit a test inquiry, confirm you land on `/thank-you`

If any of these breaks, something regressed. Check the most recent deploys on Netlify.

---

## Phased timeline

What was done, in the order it shipped (helpful when looking back at git history):

1. **Audit** — surveyed every page, every meta tag, every schema, every internal link
2. **Keyword map** — assigned one head term per page; defined the cannibalization rules
3. **Phase 3 + 4** — sitewide title/description/canonical/OG/Twitter rewrite, four new service pages, thank-you page, Services nav item, HSTS + security headers, manifest
4. **Phase 5 + 6** — full LocalBusiness/ProfessionalService schema, BreadcrumbList sitewide, FAQPage/Service/Article/CreativeWork/ImageObject schemas, Google Maps embed gating, off-site checklist
5. **Phase 7** — Sanity `insightPost` schema, `/insights` index + detail routes, 12 content briefs
6. **Phase 8 + 9** — GA4/GTM/Clarity loader (env-gated), web-vitals reporter, conversion event taxonomy, keyword tracker, monitoring playbook, needs-from-owner

After this point, the work is no longer code. It's content (blog posts), local listings (GBP, citations), reviews, and backlinks. The site is built; the firm earns the ranking.

---

## Maintenance notes for future developers

A few things that aren't obvious:

- **Schema lives in `lib/seo.ts`.** When in doubt, extend the helpers there rather than inlining a new schema in a page file. Keeps the `@id` anchors consistent.
- **`metadataBase` is required.** Set via `NEXT_PUBLIC_SITE_URL`. Without it, canonicals and OG URLs default to localhost — fine in dev, broken in production.
- **Title format** uses `title: { absolute: '...' }` on most pages to bypass the root template. The template `"%s | SOHO Architects, Calicut"` only fires on titles that opt in (currently: none — every page is explicit). If you want a new page to use the template, set `title: 'Page name'` directly.
- **`data-event` is a public contract.** The global EventTracker listens for clicks on any element with that attribute. Don't repurpose the attribute name for non-analytics use, or you'll fire bogus events.
- **Sitemap is dynamic.** New projects in Sanity → appear in sitemap within 60s (revalidate interval). Same for blog posts. Don't manually edit `app/sitemap.ts` to add content URLs.
- **Analytics scripts are env-gated.** Removing an env var disables tracking — useful for staging. Don't gate on `NODE_ENV` (it makes preview deploys behave inconsistently).
- **Header nav has 4 items** (Projects, Services, Studio, Inquiries). Insights lives in the footer only. If you promote Insights to the header later, edit `components/site/nav-items.ts`.
- **`/admin` is the Sanity Studio. `/studio` is the public About page.** This is unconventional; don't refactor without checking everything.
