# Off-site SEO checklist — SOHO Architects

Ranking #1–3 for "architects in Calicut" / "best architecture firm in Calicut" is roughly half on-site (code, content, schema) and half off-site (citations, backlinks, reviews, Google Business Profile). The code work makes you *eligible* to rank. This list earns the position.

Tackle these in order. Most items are one-time setup; a few are recurring.

---

## A. Google Business Profile (highest leverage — do this first)

The Calicut local pack is largely decided by GBP signals. Spend an hour here.

- [ ] **Claim / verify the listing** at https://business.google.com — search "SOHO Architects, Malaparamba" or use the studio address. If multiple listings exist, request consolidation.
- [ ] **Primary category:** *Architect*. **Secondary categories:** *Interior designer*, *Architectural designer*. (Up to 9 categories. Add: *Architecture firm*, *Custom home builder* if relevant, *Design agency*.)
- [ ] **NAP must match the website footer exactly** — "SOHO Architects, Golf Link Road, Malaparamba, Kozhikode, Kerala 673009". Even a punctuation difference breaks consistency signals.
- [ ] **Service area** — add Kozhikode, Malappuram, Kannur, Wayanad, Thrissur, Kochi. These mirror the `areaServed` in the website JSON-LD.
- [ ] **Hours** — Mon–Fri 10:00–18:00 IST (matches website).
- [ ] **Website URL** → https://sohoarchitects.in
- [ ] **Phone** → +91 88919 80801 (matches website, matches JSON-LD `telephone`).
- [ ] **Services** — add each service as a listed offering: Residential architecture, Commercial architecture, Interior design, Hospitality design, Heritage / adaptive reuse. Each gets a short description.
- [ ] **Photos** — upload at minimum: studio exterior, studio interior, the SOHO Work Living building, 3–5 completed houses, founders' headshots. Aim for 20+ photos over the first month, geo-tagged from Calicut where possible.
- [ ] **Logo** — upload the wordmark.
- [ ] **Posts** — publish a Post every 2–3 weeks (announcement, project, blog teaser). Posts decay after a week but signal activity.
- [ ] **Q&A** — pre-populate with the same questions from the site's FAQ. Owner answers them.
- [ ] **Reviews** — every happy client should be asked, individually, via a short link (Google generates one). Target: 25+ reviews in the first six months, with a steady cadence after that. Reply to every review.
- [ ] **Booking link** → https://sohoarchitects.in/inquiries
- [ ] **Add the GBP "embed map" iframe URL** to the `NEXT_PUBLIC_GBP_EMBED_URL` env var. The Inquiries page already renders the iframe conditionally — set the env var on Netlify and the map appears.

---

## B. Search Console & Bing Webmaster (verify, submit, monitor)

- [ ] **Google Search Console** at https://search.google.com/search-console — add property for `sohoarchitects.in` (use Domain property, requires DNS TXT).
- [ ] After verification: paste the Google verification code into the `NEXT_PUBLIC_GSC_VERIFICATION` env var on Netlify and redeploy. The `<meta name="google-site-verification">` is already wired in `app/layout.tsx`.
- [ ] Submit the sitemap: `https://sohoarchitects.in/sitemap.xml`
- [ ] Set **International Targeting → Country: India**
- [ ] Use **URL Inspection → Request Indexing** on each of these once published: `/`, `/projects`, `/services`, the three service pages, `/studio`, `/inquiries`, and each project detail page.
- [ ] Enable email alerts for: manual actions, indexing issues, Core Web Vitals failures, security issues.

- [ ] **Bing Webmaster Tools** at https://www.bing.com/webmasters — verify (same TXT DNS or HTML meta), then *Import from GSC* to copy settings in one click. Paste the verification code into `NEXT_PUBLIC_BING_VERIFICATION`.
- [ ] Submit `/sitemap.xml` here too.

---

## C. Citations / Local directories (NAP consistency)

NAP = Name · Address · Phone. The exact-match string must appear identically on every directory. Inconsistencies (e.g. "Kozhikode" on one, "Calicut" on another, or different phone formats) hurt local ranking.

**The canonical NAP**:
```
SOHO Architects
Golf Link Road, Malaparamba
Kozhikode, Kerala 673009
+91 88919 80801
info@sohoarchitects.in
```

Submit / claim listings on:

- [ ] **JustDial** — the dominant local-services directory in India; high-intent traffic for "architects Calicut".
- [ ] **Sulekha** — second-largest Indian local-services directory.
- [ ] **IndiaMART** — useful for commercial/institutional leads.
- [ ] **Houzz India** — strong for residential intent; portfolio uploads matter here.
- [ ] **Architizer** — international architecture directory; portfolio profile.
- [ ] **ArchDaily firm directory** — if accepted, this is one of the strongest backlinks in the architecture vertical.
- [ ] **Dezeen Showroom** — premium directory; submission-only.
- [ ] **Indian Institute of Architects (IIA) Kerala chapter** — practitioner listing.
- [ ] **Council of Architecture (COA) India** — confirm both founders' registration numbers are listed.
- [ ] **Google Maps** (already covered by GBP).
- [ ] **Apple Maps Connect** — small but free, covers iPhone users.
- [ ] **Bing Places** — same data as GBP, separate property.

Watch out for: paid "premium listings" — usually a waste unless the directory genuinely drives leads in your category. JustDial and Houzz India are the two where paid placement often makes sense.

---

## D. Backlinks (the long game)

Domain authority is the single largest lever for the head term. Aim for *editorial* backlinks from publications in three buckets:

### Architecture / design press

- [ ] **ArchDaily, Dezeen, Designboom, Architectural Digest India, Domus India, Stir World, Architect's Newspaper** — pitch a completed house. Each accepts project submissions with photography. ArchDaily's submission form: https://www.archdaily.com/submit-a-project. ADI accepts work via their submissions portal.
- [ ] **The Architects Diary** — Indian architecture publication, lower barrier.
- [ ] **GoodHomes / Better Interiors / Inside Outside** — Indian interiors publications.
- [ ] **Surface India**, **Platform**, **Indian Architect & Builder** — niche but well-cited.

A successful publication of one Valley House / Mathamangalam House / Payyavoor House feature is worth more than dozens of directory listings.

### Local Kerala / Calicut press

- [ ] **The Hindu — Kerala / Property pages**, **Manorama Online**, **Mathrubhumi**, **Madhyamam**, **Asianet** — pitch local-interest stories: "Why I returned to Calicut to build my practice", "Designing for the Malabar monsoon", studio retrospective on 15 years.
- [ ] **Yentha (Kerala lifestyle)**, **Calicut local blogs**, **The Better India** — softer angles.

### Adjacent professionals (link exchange / referral)

- [ ] **Landscape designers, structural engineers, hospitality operators** you've worked with — exchange portfolio links where genuine.
- [ ] **Real-estate developers** in Calicut who use you for design — get listed on their architect-of-record pages.
- [ ] **Photographer credits** — the architecture photographer's portfolio page often links back. Ensure links are present.

### What NOT to do

- [ ] Avoid paid link networks, PBN guest-post farms, and "1000 backlinks for ₹500" services. Google catches these; the resulting penalty is hard to undo.
- [ ] No reciprocal link "exchanges" with unrelated sites.
- [ ] No anchor-text stuffing ("best architects in Calicut" as anchor on every link). Vary anchor text — brand name, URL, descriptive phrases.

---

## E. Content / social signals (lower priority, ongoing)

- [ ] **Instagram** — already implied; keep it active. Geo-tag posts to Kozhikode. Cross-post project completion announcements to the blog (Phase 7).
- [ ] **LinkedIn (company page)** — useful for commercial leads. Post studio updates, hiring, project completions.
- [ ] **YouTube** — even one or two project walk-throughs (3–5 min) is high-leverage. Embeds back to project pages on the site.
- [ ] **Pinterest** — surprisingly relevant for residential research traffic in India. Each project gets a board.

Update the `NEXT_PUBLIC_SAMEAS` env var with a comma-separated list of profile URLs — the JSON-LD `sameAs` array picks them up automatically:

```
NEXT_PUBLIC_SAMEAS=https://www.instagram.com/sohoarchitects,https://www.linkedin.com/company/sohoarchitects,https://www.houzz.in/professionals/architects-and-building-designers/soho-architects
```

---

## F. Reviews (the trust signal)

- [ ] Ask every project handover client for a Google review. Make it easy — send the GBP review link by WhatsApp.
- [ ] Reply to every review (positive or critical) within a week. Replies are public and improve trust signals.
- [ ] Houzz India reviews carry weight in the design vertical specifically.
- [ ] Don't buy reviews. The pattern is detectable and the penalty is severe.

---

## Cadence

| Cadence | Tasks |
|---|---|
| One-time setup (first 30 days) | Claim GBP, submit sitemaps, build top 8 citations, set sameAs |
| Weekly (5 min) | Reply to new reviews / Q&A. Check GSC for any new errors. |
| Monthly (30 min) | One GBP post. One new citation OR backlink pitch. Review GSC Performance for keyword movement. |
| Quarterly (2 hours) | Pitch one project to architectural press. Refresh top-performing blog posts. Competitor SERP check. |

The line that fails most firms in this category is the *backlink pitch*. One published feature on ArchDaily India is worth more than a year of citation building. Make it a quarterly habit.
