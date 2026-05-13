# SEO monitoring playbook

How to know whether the SEO work is actually working — in 5 minutes a week, 30 minutes a month.

## Quick links you'll need

Bookmark these:

- **Google Search Console** — https://search.google.com/search-console
- **Google Analytics 4** — https://analytics.google.com
- **Microsoft Clarity** — https://clarity.microsoft.com
- **Google Business Profile** — https://business.google.com
- **Bing Webmaster Tools** — https://www.bing.com/webmasters
- **PageSpeed Insights** — https://pagespeed.web.dev/
- **Schema validator** — https://validator.schema.org/

If any of these isn't set up yet, see `needs-from-owner.md`.

---

## Weekly — 5 minutes

Do this every Monday morning over coffee. Catches problems while they're small.

- **GSC** → Overview → any new errors? (Manual actions, indexing, Core Web Vitals, mobile usability, security.) If yes, click in and read.
- **GA4** → Reports → Acquisition → Traffic acquisition. Look at the "Organic Search" row. Is sessions roughly flat-or-up vs. last week? A drop of >25% week-over-week is a flag — investigate before assuming the worst (often it's just seasonality).
- **GBP** → are there new reviews? Reply to every one. New questions in Q&A? Answer them.

If anything looks alarming, jump to the deep-dive sections below.

---

## Monthly — 30 minutes

First of every month. Catches trends, sets priorities for the next month.

### 1. Rank check (10 min)

Open [keyword-tracker.md](keyword-tracker.md). For each row:

1. GSC → Performance → set date to "Last 28 days"
2. Toggle "Average position" ON
3. Filter Queries → contains → paste the keyword
4. Read the Average position value, write it in the next month's column

If a primary keyword has dropped >5 positions month-over-month, that's a real signal. Investigate:
- Did Google push an algorithm update? (Check https://moz.com/google-algorithm-change)
- Did a competitor publish something major?
- Did you change anything on that page recently?

### 2. Traffic + conversions (10 min)

GA4 → Reports → Engagement → Events. Look at the count for:
- `contact_form_submit` — how many inquiries from the site this month?
- `phone_click` — how many phone clicks?
- `whatsapp_click` — how many WhatsApp clicks?
- `portfolio_view` — how many project page views?

GA4 → Reports → Acquisition → Traffic acquisition → filter by Organic Search:
- Sessions month-over-month
- Engagement rate (>50% is healthy)
- Conversions (the events above, if marked as Key Events in GA4 settings)

GA4 → Reports → Engagement → Landing page → filter Organic Search:
- Which pages are pulling in traffic?
- Any new landing pages that weren't there last month?

### 3. Indexing health (5 min)

GSC → Pages:
- "Indexed" count should match (or be very close to) the sitemap count (current = home, projects index, services hub, 3 service detail, studio, inquiries, 6 projects, plus any blog posts you've shipped).
- "Not indexed" — click in. Common reasons:
  - "Discovered – currently not indexed" → no action; Google will get to it
  - "Crawled – currently not indexed" → consider adding internal links to that page
  - "Page with redirect" / "Alternate page with proper canonical tag" → usually fine
  - "Soft 404" / "Server error" → real problem, investigate

### 4. Core Web Vitals (5 min)

GSC → Experience → Core Web Vitals:
- Any URLs slipped into "Needs improvement" or "Poor"?
- Compare to last month — has the count grown?

If it has, run https://pagespeed.web.dev/ against the worst URL and read the recommendations. Common regressions:
- Large image added recently → check next/image is being used + correct `sizes`
- New third-party script → check it's loaded with `strategy="afterInteractive"` or later
- New animation → check it respects `prefers-reduced-motion`

### 5. Backlinks check (5 min — but the real work is *earning* backlinks, not checking them)

GSC → Links → External links. Note:
- Total external links count (slowly grows)
- New "linking sites" this month (each one is a potential celebration or a low-quality link to disavow)
- Top linking pages — which pages on your site attract links?

Any new backlinks from architectural press (ArchDaily, Dezeen, etc.) are the most valuable signal here.

---

## Quarterly — 2 hours

Every three months. Bigger-picture review.

### Content audit

GA4 → Reports → Engagement → Pages and screens. Filter to last 90 days:
- Which pages get traffic? Are there any zero-traffic pages?
- For each blog post older than 6 months: is it still getting visits? If not, can it be updated, merged, or quietly removed?
- For top-performing posts: refresh the published date and update any facts that have moved.

### Competitor SERP check

Open an incognito tab. Set location to Calicut (use a Calicut-IP-VPN or ask a friend in Calicut). Search:
- "architects in Calicut"
- "best architecture firm in Calicut"
- "residential architects in Calicut"
- "interior designers in Calicut"

For each, screenshot the top 3 results. Note for each:
- Who they are
- What's special about their listing (5-star reviews? Rich snippets? Site links?)
- What's on their landing page that yours doesn't have

The gap analysis is the brief for the next quarter's work.

### Schema validation

For each major page type — home, services hub, service detail, project detail, blog post — paste the URL into https://validator.schema.org/ and check for warnings or errors. Schema doesn't break silently — Google just stops using it.

### Review velocity

Compare your Google Business Profile review count to top 3 competitors. If they're pulling ahead, the next quarter's #1 job is asking happy clients for reviews.

---

## What "good" looks like, by milestone

### End of month 1
- All target pages indexed (you'll see them in GSC Pages report)
- Sitemap submitted and "Success" in GSC
- Brand-name searches ("SOHO Architects") rank #1
- GA4 receiving data, events firing
- Web vitals all green
- GBP claimed, first 5 reviews requested

### End of month 3
- 30+ organic sessions/week from non-brand searches
- 1–2 form submissions/month from organic
- Page 2 ranking on at least one primary keyword
- 3 blog posts published
- 8 citations live (JustDial, Sulekha, Houzz India, etc.)
- 10+ Google reviews

### End of month 6
- 100+ organic sessions/week
- 5+ form submissions/month from organic
- Page 1 ranking for at least one primary keyword
- 1 published feature in architectural press (ArchDaily / Dezeen / ADI / etc.)
- 8+ blog posts published
- 20+ Google reviews

### End of month 12
- 500+ organic sessions/week
- 15+ form submissions/month from organic
- Top 3 ranking for at least one primary keyword
- 3+ published features in architectural press
- 12+ blog posts published, 2+ being refreshed quarterly
- 40+ Google reviews

These are *targets, not predictions*. The architecture vertical is competitive in Kerala; some firms hit these earlier, some later. The trajectory is what matters — if the line is going up, you're doing this right.

---

## When something goes wrong

### Sudden traffic drop (>50% w/w)

1. Check GSC → Manual Actions. Anything there?
2. Check GSC → Security & Manual Actions → Security issues
3. Check GA4 for any tracking errors (sometimes a deploy breaks gtag — fewer events, looks like traffic drop)
4. Check the home page in an incognito tab — does it render?
5. Run https://search.google.com/test/mobile-friendly on the home page

If 1–5 are clean and the drop persists, it's likely a Google algorithm update. Don't panic-edit the site — wait 2 weeks. Most updates reverse partially in that window.

### Ranking drops on one specific keyword

Usually: a competitor published a better page, or Google decided your page no longer matches the intent.

1. Search the keyword in incognito. Look at the top 3 results — what are they doing that you aren't?
2. Read the top result top-to-bottom. Where's it more comprehensive? More current? More authoritative?
3. Improve your page to match-and-beat, then resubmit via GSC URL Inspection → Request Indexing.

### "Indexed, though blocked by robots.txt"

Means a page is in the index but blocked. Fix by either:
- Removing the URL from robots.txt disallow (if you actually want it indexed)
- OR removing the page from any internal links (if you don't)

### CWV "Needs improvement" / "Poor"

Run pagespeed.web.dev on the URL. Common causes specific to this codebase:
- A recently-added large unoptimised image → use the SanityImage component, not a raw `<img>`
- A new third-party script added without `strategy="afterInteractive"` or lazy-loading
- A new animation that doesn't gate on `prefers-reduced-motion`

---

## What I'd worry about, in order

In rough priority order, if you only have time for one thing:

1. **Review velocity on GBP.** Top 3 in the local pack is mostly decided here.
2. **One architectural press feature per quarter.** Single biggest backlink lever in this vertical.
3. **One new blog post per month.** Compounding long-tail traffic.
4. **Replying to every review within a week.** Free trust signal.

If you have time for none of these, do the GBP one. Everything else compounds slower.
