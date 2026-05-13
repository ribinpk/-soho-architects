# Needs from owner

Everything in this file is a TODO the code can't fill on its own. The site ships and works without any of these — but each one unlocks a specific capability. Grouped by priority.

## Where these go

All environment variables go into **Netlify → Site settings → Environment variables**. After adding them, trigger a redeploy (Deploys → Trigger deploy → Deploy site). They're picked up at build time.

Any variable starting with `NEXT_PUBLIC_` is exposed to the browser — anything else is server-only. That's intentional: verification meta tags, analytics IDs, and map embed URLs are all public; tokens (Sanity, Resend) are not.

---

## Priority 1 — blocking measurement (do these in week one)

These unlock the ability to know whether the SEO work is working. Without them, the site ranks but you're flying blind.

### Google Search Console verification

1. Go to https://search.google.com/search-console and add a property for `sohoarchitects.in` (use the **Domain** option, not URL prefix — covers `https://`, `http://`, `www.`, and bare-domain all at once).
2. Verification needs a DNS TXT record. GoDaddy → DNS → add the TXT record GSC gives you. Wait 10 minutes, click verify.
3. *Alternatively*, use the HTML meta-tag method. Copy the content value GSC gives you (looks like `google-site-verification: abc123…` — you want just the `abc123…` part).
4. Add to Netlify env: `NEXT_PUBLIC_GSC_VERIFICATION=<the verification string>`
5. Redeploy. Click "Verify" in GSC.

### Bing Webmaster Tools verification

1. Go to https://www.bing.com/webmasters. Sign in with the same Google account.
2. Click **Import sites from GSC** — one-click setup, copies everything across.
3. If that fails, add property manually with the same domain. Bing gives a verification string.
4. Add to Netlify env: `NEXT_PUBLIC_BING_VERIFICATION=<the verification string>`
5. Redeploy. Click "Verify" in Bing.

### Google Analytics 4

1. Go to https://analytics.google.com → Admin → Create property. Name it "SOHO Architects" (or similar).
2. Reporting time zone: India Standard Time. Currency: INR.
3. Skip the "App + Web" data stream; choose **Web** only. Stream URL: `https://sohoarchitects.in`.
4. After creating the stream, copy the **Measurement ID** (format: `G-XXXXXXXXXX`).
5. Add to Netlify env: `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`
6. Redeploy. GA4 will start receiving data within an hour.
7. **Mark these as Key Events (conversions)** in GA4 → Configure → Events → switch the toggle: `contact_form_submit`, `phone_click`, `whatsapp_click`.

### Google Business Profile

The single largest local-SEO lever. Spend an hour here. Full checklist in [`off-site-checklist.md`](off-site-checklist.md) section A.

Minimum: claim listing, set primary category to *Architect*, match NAP to the website footer exactly, add hours, add photos, ask first review.

After GBP is live, two env vars become useful (both Priority 2 — set when you have time):

- `NEXT_PUBLIC_GBP_MAP_URL` — the "Share" link from your GBP listing (looks like `https://maps.app.goo.gl/…`). Goes into the `hasMap` field of LocalBusiness schema.
- `NEXT_PUBLIC_GBP_EMBED_URL` — the **embed** iframe URL from GBP → Share → Embed → copy the `src=...` URL out of the `<iframe>` HTML. Goes into the iframe on the Inquiries page (currently hidden until set).

---

## Priority 2 — strong-but-not-blocking

### Microsoft Clarity (free heatmaps + session recordings)

This is high-value for understanding why visitors don't convert. Genuinely free, no Google footprint.

1. Go to https://clarity.microsoft.com, sign in.
2. Create project: name "SOHO Architects", website `sohoarchitects.in`.
3. Copy the **Project ID** (10-character alphanumeric).
4. Add to Netlify env: `NEXT_PUBLIC_CLARITY_ID=<id>`
5. Redeploy.

### Google Tag Manager (optional)

If you'd rather manage analytics tags without code changes in future, install GTM and route GA4 through it.

1. Go to https://tagmanager.google.com → Create container → "Web" → for `sohoarchitects.in`.
2. Copy the **Container ID** (format: `GTM-XXXXXXX`).
3. Add to Netlify env: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`
4. Inside GTM, install GA4 as a tag (Tag → New → GA4 Configuration → paste Measurement ID).
5. **If you're using GTM, you can leave `NEXT_PUBLIC_GA4_ID` empty** — GTM owns GA4 firing. Or set both — they coexist but you'll get duplicate page-views unless GTM is configured carefully. Pick one.

### Social profile URLs

Power the schema `sameAs` array (signals to Google that this entity is the same as your social profiles).

Add to Netlify env: `NEXT_PUBLIC_SAMEAS=<comma-separated URLs>`

Example:
```
NEXT_PUBLIC_SAMEAS=https://www.instagram.com/sohoarchitects,https://www.linkedin.com/company/sohoarchitects,https://www.houzz.in/professionals/architects-and-building-designers/soho-architects
```

### Price range

The site defaults to `₹₹₹` for the schema `priceRange` field. Override if you'd rather signal `₹₹` (more accessible) or `₹₹₹₹` (premium-only):

`NEXT_PUBLIC_PRICE_RANGE=₹₹₹₹`

---

## Priority 3 — visual / brand assets

### Apple touch icon

iOS users who "Add to Home Screen" see this. Default browser icon is a square crop of a screenshot, which looks shabby.

- File: `/public/brand/apple-touch-icon.png`
- Size: 180 × 180 px
- Format: PNG, no transparency
- Visual: a simplified version of the SOHO mark (no horizontal wordmark — too thin at this size). Cream background, ink mark, with breathing room around the edge (~10% padding).

Drop the file into `/public/brand/` and redeploy. The layout already references it.

### Default Open Graph image

When the homepage is shared on WhatsApp / LinkedIn / Twitter, this is the preview image. Right now per-project shares work great (cover image is used), but home / studio / services shares fall back to text-only.

- File: `/public/brand/og-default.jpg`
- Size: 1200 × 630 px
- Format: JPG (smaller than PNG for photographic content)
- Visual: a photographed scene — recommend a wide shot of one of the courtyards (Payyavoor) or the studio's own building, with breathing room for OG-image cropping that some platforms do.

After adding the file, append this to `app/layout.tsx`'s OpenGraph block (or ask the developer to wire it):

```ts
images: [{ url: '/brand/og-default.jpg', width: 1200, height: 630 }]
```

### Studio geo coordinates (verify)

`lib/seo.ts` currently uses approximate coordinates for Malaparamba: **11.298, 75.7958**. These are good enough for Google to cross-reference with your GBP pin, but precise is better:

1. Once GBP is claimed, find your pin's exact coordinates (right-click pin on Google Maps → "What's here?").
2. Update `STUDIO_GEO` in `lib/seo.ts` to match exactly.

---

## Priority 4 — content the studio creates

These aren't env vars, they're editorial work that lives in Sanity (`/admin`).

### First three blog posts

The 12 content briefs live in [`content-briefs.md`](content-briefs.md). Recommend starting with these three — they're the highest-converting:

1. Post 1 — Cost of Building a House in Calicut in 2026
2. Post 4 — How to Choose an Architect in Calicut
3. Post 9 — Architect Fees in Calicut, Explained

For each, write 1,200+ words in Sanity → Insights → Create new. The brief tells you what H2s to use, what FAQs to add, what to link to.

### Cover-image alts on existing projects

The site reads `cover.alt` from Sanity. Most existing projects were imported from a CSV — their alt fields might be empty or generic. Best practice: open each project in `/admin` and write a one-line alt that describes the image and includes location (e.g. "Mathamangalam House, Kannur — laterite verandah in afternoon light").

This is the single highest-leverage image-SEO win and takes about 10 minutes for all six projects.

### Press, awards, founder credentials on the Studio page

The studio page reads `team` and `press` from Sanity. Right now it falls back to hardcoded values in `studio/page.tsx`. To activate the CMS-driven version (and improve E-E-A-T signals):

- Open `/admin` → Studio page → fill in team headshots, bios with COA / IIA registration numbers, links to publications they've been featured in.
- Add to Press: every award, every published feature, with the source URL.

---

## Summary checklist (paste into your task tracker)

- [ ] **P1** Google Search Console verification (DNS or `NEXT_PUBLIC_GSC_VERIFICATION` env)
- [ ] **P1** Submit sitemap to GSC
- [ ] **P1** Bing Webmaster Tools verification (`NEXT_PUBLIC_BING_VERIFICATION`)
- [ ] **P1** GA4 property + `NEXT_PUBLIC_GA4_ID`
- [ ] **P1** Mark `contact_form_submit`, `phone_click`, `whatsapp_click` as Key Events in GA4
- [ ] **P1** Claim & optimise Google Business Profile (categories, NAP, hours, photos, first reviews)
- [ ] **P2** Microsoft Clarity (`NEXT_PUBLIC_CLARITY_ID`)
- [ ] **P2** `NEXT_PUBLIC_GBP_EMBED_URL` for the map on the Inquiries page
- [ ] **P2** `NEXT_PUBLIC_GBP_MAP_URL` for schema `hasMap`
- [ ] **P2** `NEXT_PUBLIC_SAMEAS` with social profile URLs
- [ ] **P2** (optional) `NEXT_PUBLIC_GTM_ID` if you want GTM
- [ ] **P3** `/public/brand/apple-touch-icon.png` (180×180)
- [ ] **P3** `/public/brand/og-default.jpg` (1200×630)
- [ ] **P3** Verify studio geo coordinates against GBP pin
- [ ] **P4** Three highest-leverage blog posts published from `content-briefs.md`
- [ ] **P4** Improve cover-image alts on existing six projects
- [ ] **P4** Fill Studio page singletons in Sanity (team, press, awards)

Nothing here is urgent. Most can be done over a quiet weekend. P1 work is what unlocks the ranking measurements — do that first.
