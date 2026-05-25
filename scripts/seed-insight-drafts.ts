/**
 * One-off: seed 5 Insights posts as Sanity DRAFTS, ready for studio review.
 *
 * Posts target commercial-intent queries that prospective clients in
 * Calicut/Kozhikode actually search. Each is written in the studio voice
 * (declarative, specific, lightly editorial). The studio reviews each in
 * /admin, swaps the placeholder cover image for a post-specific one, edits
 * anything that isn't accurate to current practice, then publishes.
 *
 * Drafts: doc `_id` is prefixed `drafts.`. They won't appear on /insights
 * until published from Studio. Re-running is idempotent (createOrReplace).
 *
 * Run: npx tsx scripts/seed-insight-drafts.ts
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";

loadEnv({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-01",
  token,
  useCdn: false,
});

const k = () => randomUUID().slice(0, 12);

// Existing project cover asset refs — used as placeholders for draft posts
// until the studio swaps in post-specific imagery via Studio.
const COVER_REFS = {
  soho: "image-a40c76e1e4ec279efc2bdc7a8b688594e68bf497-4502x3000-jpg",
  valley: "image-5fd318619737ee9c5eda5dbcd0da67c271d66f8d-5965x3977-jpg",
  mathamangalam:
    "image-3adf09a3480e61c84d07e04c5cc0af9292cd31e7-6000x4000-jpg",
  payyavoor:
    "image-5baa3b7098b0db9fd84cc63b683817e0f4d0e3d6-2880x1893-jpg",
  solace: "image-32fe3ca3539e76ac20b0acf98a042bd7f4e74c7f-4652x5815-jpg",
  la_vie: "image-8cb635475ef8d3b739cca360c0217a2d94677a04-5144x3396-jpg",
};

// ---------- Portable-text helpers ----------

type Span = { _key: string; _type: "span"; marks: string[]; text: string };
type LinkMark = {
  _key: string;
  _type: "link";
  href: string;
};
type Block = {
  _key: string;
  _type: "block";
  style: string;
  markDefs: LinkMark[];
  children: Span[];
};

function p(text: string): Block {
  return {
    _key: k(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: k(), _type: "span", marks: [], text }],
  };
}

function h2(text: string): Block {
  return {
    _key: k(),
    _type: "block",
    style: "h2",
    markDefs: [],
    children: [{ _key: k(), _type: "span", marks: [], text }],
  };
}

function h3(text: string): Block {
  return {
    _key: k(),
    _type: "block",
    style: "h3",
    markDefs: [],
    children: [{ _key: k(), _type: "span", marks: [], text }],
  };
}

/**
 * Build a paragraph with one inline link.
 * Splits the text on `linkText`; the link wraps the matching span.
 */
function pLink(text: string, linkText: string, href: string): Block {
  const i = text.indexOf(linkText);
  if (i === -1) return p(text);
  const before = text.slice(0, i);
  const after = text.slice(i + linkText.length);
  const linkKey = k();
  return {
    _key: k(),
    _type: "block",
    style: "normal",
    markDefs: [{ _key: linkKey, _type: "link", href }],
    children: [
      { _key: k(), _type: "span", marks: [], text: before },
      { _key: k(), _type: "span", marks: [linkKey], text: linkText },
      { _key: k(), _type: "span", marks: [], text: after },
    ],
  };
}

function quote(text: string): Block {
  return {
    _key: k(),
    _type: "block",
    style: "blockquote",
    markDefs: [],
    children: [{ _key: k(), _type: "span", marks: [], text }],
  };
}

// ---------- Post drafts ----------

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  coverRef: string;
  author: string;
  authorRole: string;
  readingMinutes: number;
  body: Block[];
  faqs?: { q: string; a: string }[];
  relatedServices?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

const DRAFTS: Draft[] = [
  // ---------------------------------------------------------------------
  // 1. Cost of an architect-designed house in Calicut (commercial intent)
  // ---------------------------------------------------------------------
  {
    slug: "cost-of-architect-designed-house-calicut",
    title:
      "How much does it cost to build an architect-designed house in Calicut?",
    excerpt:
      "What an architect actually charges in Kozhikode, what the build itself runs, and what shifts the number — written for people quietly planning a house in Kerala.",
    coverRef: COVER_REFS.valley,
    author: "Ar. Suhail AK",
    authorRole: "Co-founder & Principal Architect",
    readingMinutes: 9,
    seoTitle:
      "Cost of an Architect-Designed House in Calicut — A 2026 Guide | SOHO Architects",
    seoDescription:
      "A working architect in Calicut on what a house actually costs in 2026 — architect's fee, build cost per square foot, interiors, contingencies, and what shifts the number.",
    relatedServices: ["/services/residential-architects-calicut"],
    body: [
      p(
        "We get asked this on almost every first call. The honest answer is that there isn't a single number — there's a range, and where you land in that range depends on the site, the structural system, the finishes, and how much of the work you want one studio to see through. But we can do better than \"it depends.\" Here is what the math looks like for a house designed and built by an architect in Calicut, in 2026.",
      ),
      h2("Two numbers, not one"),
      p(
        "A house has two cost lines that often get confused — the architect's fee and the build cost. They're separate. The architect's fee is what we charge for design, drawings, and site supervision. The build cost is what the contractor charges to actually build it, plus materials.",
      ),
      p(
        "In Kerala, architect fees for residential work typically sit between 6 and 10 percent of the build cost. Where you land depends on scope. A house where we do schematic design only and hand the rest to a draftsman comes in lower. A house where we draw every joint, supervise the site fortnightly, and oversee interiors and landscape is at the top of the range. Our own work is usually 8 to 10 percent, because we do all of it.",
      ),
      h2("Build cost, per square foot"),
      p(
        "Build cost varies more than fees do. In Calicut today, a basic build — RCC frame, brick infill, standard tiles, modest finishes — runs roughly ₹2,000 to ₹2,400 per square foot. A mid-range house with better joinery, vitrified tile or oxide floors, decent sanitaryware, and some custom carpentry runs ₹2,800 to ₹3,800 per square foot. A premium build with imported finishes, full custom joinery, structural complexity, or extensive interiors can cross ₹5,000 per square foot, sometimes more.",
      ),
      p(
        "For a 3,000 square foot house in Kozhikode at mid-range build quality, the build cost is roughly ₹95 lakh to ₹1.15 crore. Add 8 to 9 percent for the architect's fee, and the total comes to roughly ₹1.05 to ₹1.25 crore. That's the working number we'd put in a first-meeting conversation.",
      ),
      h2("What moves the number"),
      p(
        "Five things shift the build cost more than anything else.",
      ),
      p(
        "Site. A flat, road-front plot near the city is cheap to build on. A sloped plot, a plot with poor soil, a plot far from material sources — each adds to the cost. We've worked on hillsides in Wayanad that needed retaining walls before the house could begin; those alone added 10 percent.",
      ),
      p(
        "Structural system. A regular RCC frame is the default. Once you add steel, large spans, cantilevers, double-height volumes, or a basement, the structural cost climbs sharply. Heritage-style construction with thick walls and tile roofs reads simpler but is often more expensive per square foot.",
      ),
      p(
        "Finishes. The same plan can be built three ways — basic, mid, premium — and the finishes alone account for most of the gap. Italian marble versus local granite, custom teak versus rubberwood, brass hardware versus pressed steel. Each decision compounds.",
      ),
      p(
        "Interiors. Most clients ask us to stay through interiors. A full interior package — joinery, lighting, soft goods, art — typically adds 25 to 40 percent on top of the build cost. It is not a small line item.",
      ),
      p(
        "Time. The longer a build runs, the more it costs in finance and supervision. A house that should take 14 months and ends up taking 22 absorbs the difference somewhere — usually the contingency.",
      ),
      h2("The cost of NOT working with an architect"),
      p(
        "We are obviously biased here. But the question we get most often is whether the architect's fee is worth it. The honest answer: on a small build with a competent contractor and standard expectations, maybe not. On anything else — a difficult site, an ambitious plan, a client who wants the house to feel resolved rather than assembled — the fee is usually the cheapest part of the project.",
      ),
      pLink(
        "We've seen builds without architects come in 15 to 25 percent over budget because the contractor priced an early sketch and the actual house drifted. A worked-out set of drawings prevents that drift. We've also seen builds that came in on budget but were unlivable in the monsoon, or unbearable in April, because nobody studied the light or the wind. Those don't show up in the build cost — they show up later, every year, in the way the house refuses to be enjoyed. If you want a fuller picture of what we actually do across a residential project, the residential architects in Calicut page walks through it.",
        "residential architects in Calicut",
        "/services/residential-architects-calicut",
      ),
      h2("Contingency"),
      p(
        "Always carry 8 to 10 percent contingency on the total. Sites surprise you. So do governments. We don't draw against the contingency — it sits there in case the foundation needs an extra metre of fill, or the imported tap takes four months instead of two.",
      ),
      h2("When to talk about money"),
      p(
        "At the first meeting. Before any drawing. We'd rather know your real budget than design to a number that isn't there, and then have to redraw when reality lands. Bring the plot, the brief, and what you can actually spend — we will tell you what is possible, and what is not, before we ask you to commit to anything.",
      ),
    ],
    faqs: [
      {
        q: "What is the cheapest a house in Calicut can be built for in 2026?",
        a: "A basic 1,500 sq ft house with RCC frame, modest finishes, and a competent contractor can be built for around ₹30 to ₹35 lakh in build cost as of 2026, plus the architect's fee. That assumes a flat, accessible plot and no significant interior work. Anything more complex moves the number up.",
      },
      {
        q: "Is an architect's fee negotiable in Kerala?",
        a: "Sometimes — but not as much as people expect. A reputable architect's fee covers staff, drawings, and site time that all has a real cost. We can scope the work down (schematic only, no supervision, etc.) if that's what's needed, but discounting the percentage on the same scope usually means we're cutting corners somewhere downstream.",
      },
      {
        q: "When do we pay the architect?",
        a: "In stages, against milestones. Typically: a small portion at signing, a portion at schematic design, a portion at design development, a portion when working drawings are issued, and the rest spread across construction supervision. Nothing is paid in advance for work not yet done.",
      },
      {
        q: "Does an architect-designed house actually cost less in the long run?",
        a: "Often yes, because the build is more accurate the first time, finishes are specified correctly, and the house actually works in the climate (which lowers running costs). But the savings show up over years, not on day one. The day-one number is higher than a contractor-only build.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // 2. How to choose an architect in Kozhikode (commercial intent)
  // ---------------------------------------------------------------------
  {
    slug: "how-to-choose-an-architect-in-kozhikode",
    title: "How to choose an architect in Kozhikode",
    excerpt:
      "We are architects in Calicut and this is biased, but it is also written by people who get asked this question every week. Ten things to look for, and three to walk away from.",
    coverRef: COVER_REFS.mathamangalam,
    author: "Ar. Varun Gopal",
    authorRole: "Co-founder & Principal Architect",
    readingMinutes: 8,
    seoTitle:
      "How to Choose an Architect in Kozhikode — 10 Things to Check | SOHO Architects",
    seoDescription:
      "Picking the right architect in Kozhikode (Calicut) is the most important early decision in any house project. Ten things to check before you sign, three reasons to walk away.",
    relatedServices: ["/services/residential-architects-calicut"],
    body: [
      p(
        "Choosing an architect is the most consequential decision you'll make on a house. The plot matters. The contractor matters. The budget matters. But the architect is the person who decides what the house is, where it sits, how it weathers, and how it lives. Pick well and the rest gets easier. Pick badly and the whole project carries the mistake.",
      ),
      p(
        "We are architects in Kozhikode, so this is unavoidably biased. But the criteria below are how we'd choose if we were on the other side of the table.",
      ),
      h2("1. Look at completed work, not renders"),
      p(
        "Renders are not buildings. A good portfolio of finished houses tells you what the architect actually delivers — not what their best 3D artist can image. Ask to see at least three completed projects. Visit one if possible. Photographs flatter; sites tell the truth.",
      ),
      h2("2. Check whether they design for Kerala"),
      p(
        "Most parts of India can borrow ideas from elsewhere. Kerala mostly cannot. The monsoon is too heavy, the light too strong, the humidity too persistent. An architect who hasn't worked here will get the small things wrong — eaves too short, openings facing the wrong way, materials that fade in two seasons. Look at their built work and ask yourself: do these houses look like they belong in Malabar?",
      ),
      h2("3. Ask who actually does the work"),
      p(
        "Many firms are sold on the principal's portfolio and delivered by associates the client never meets. There is nothing wrong with a team — every studio has one — but make sure the person you trust is also the person making the decisions. Ask which partner will be on your project, how often they'll be on site, and who signs off on the drawings.",
      ),
      h2("4. Match the studio size to the project"),
      p(
        "A large multinational firm running a 2,500 sq ft house often charges more, moves slower, and assigns juniors. A one-person studio handling a 30,000 sq ft commercial brief can be overwhelmed. Look for a studio that does work at your scale — and a few projects slightly above it.",
      ),
      h2("5. Read their writing or hear them speak"),
      p(
        "An architect's voice tells you how they think. Read the about page, the project descriptions, the published interviews if any. Watch a talk if there's one. The way they explain a building is usually how they design it — clearly, with care, or vaguely, with jargon.",
      ),
      h2("6. Talk about money on day one"),
      p(
        "A reputable architect will discuss fees and rough build costs at the first meeting, before any drawing begins. Be wary of anyone who says they'll \"figure it out later.\" The number does not get easier later — it gets harder, and changes are paid for in tears.",
      ),
      h2("7. Ask about construction supervision"),
      p(
        "Drawings on paper and a house on a site are very different things. Find out how often the architect will visit the site, who handles the contractor liaison, and what happens if a detail isn't built as drawn. We do fortnightly visits at minimum and weekly during finish stages. Other studios may do less or more. Either is fine — what's not fine is no answer to the question.",
      ),
      h2("8. Look for someone whose work you'd live in"),
      p(
        "This is the soft criterion. Look at three or four houses they've completed and imagine living in them — not visiting, not photographing. Living. If the rooms feel like rooms you could love, the architect understands something most don't. If they feel like sets, walk on.",
      ),
      h2("9. Check that the practice is registered"),
      p(
        "In Kerala, only architects registered with the Council of Architecture (COA) can legally call themselves architects, and only their drawings can be submitted for sanction. The prefix \"Ar.\" before a name is a clue but not a guarantee. Ask for the COA registration number and verify it on the COA website if it matters to you. Most reputable firms will share it without being asked.",
      ),
      h2("10. Trust your discomfort"),
      p(
        "If the first meeting feels rushed, transactional, or off in some way — trust that. You are going to be talking to this person every week for two years. The relationship matters as much as the portfolio.",
      ),
      h2("Three reasons to walk away"),
      p(
        "Quotes a build cost before seeing the site. Anyone who tells you a per-square-foot number on a phone call without seeing the plot is selling you a contractor's package, not architecture.",
      ),
      p(
        "Won't put fees in writing. Fees should be on a single page, signed before any work begins. Verbal arrangements turn into arguments.",
      ),
      pLink(
        "Has no completed work to show. Renderings are not enough. If a studio cannot show you a finished house you can visit, they are still finding their way. There is no shame in that — but it isn't your project to learn on. (If you'd like to see our completed work, our projects page has the small set we're prepared to stand behind.)",
        "projects page",
        "/projects",
      ),
      h2("One last thing"),
      p(
        "The right architect for you is the one you'd want to be in a difficult meeting with when the contractor is late and the budget is tight and a decision must be made today. Pick that person. Everything else is detail.",
      ),
    ],
    faqs: [
      {
        q: "How many architects should I interview before choosing?",
        a: "Two or three is usually enough. More than that and you'll start comparing on price, which is the wrong basis. Pick the two whose work you respect most, meet both, and choose the one whose conversation felt clearest.",
      },
      {
        q: "Do I need a Calicut-based architect for a project in Calicut?",
        a: "Usually yes. Local architects know the contractors, the materials, the inspectors, the way the sanctioning office runs. A Bangalore or Bombay studio doing a project here will need a local partner anyway — and you'll end up paying both.",
      },
      {
        q: "Can I work with a young/new architect to save money?",
        a: "You can, and sometimes it works well — they care more, they're hungry, the fee is lower. But the risk is higher and the supervision is thinner. If you go this route, make sure they have at least one completed house and a thoughtful answer to every question above.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // 3. Designing for the Kerala monsoon (authority / topical)
  // ---------------------------------------------------------------------
  {
    slug: "designing-for-the-kerala-monsoon",
    title:
      "Designing for the Kerala monsoon — twenty houses' worth of small corrections",
    excerpt:
      "Four months of rain a year writes half the brief in Kerala. What we have learned about overhangs, courtyards, gutters, and the small details that decide whether a house lives well or just stands.",
    coverRef: COVER_REFS.payyavoor,
    author: "Ar. Suhail AK",
    authorRole: "Co-founder & Principal Architect",
    readingMinutes: 10,
    seoTitle:
      "Designing a House for the Kerala Monsoon — Lessons from 20 Builds | SOHO Architects",
    seoDescription:
      "Twenty houses' worth of small corrections on designing for the Kerala monsoon — overhangs, gutters, courtyards, materials, and the details most architects underestimate.",
    relatedServices: ["/services/residential-architects-calicut"],
    body: [
      p(
        "The Kerala monsoon is not weather; it is a tenant. For four months a year — sometimes longer — it lives in your house, finds the corners you haven't sealed, tests the joints you drew quickly, and writes a report card in stains. Designing a house here without taking that seriously is the difference between a building that quietly works and a building that you spend ten years patching.",
      ),
      p(
        "We have built about twenty houses across Malabar by now — Kozhikode, Kannur, Wayanad, Malappuram, Thrissur — and most of what we know about the monsoon was learned by getting something slightly wrong and watching the rain teach us. Here is what we'd put in the brief on day one of every house in Kerala.",
      ),
      h2("Overhangs are not a style choice"),
      p(
        "The first thing we draw on any house here is the overhang. Eaves of 900 mm minimum on every elevation, 1,200 mm where the rain is wind-driven, more if the wall is finished in something the rain wants to eat. A short overhang is a Bombay decision in a Calicut climate — it looks neat in renders and rotted in person.",
      ),
      p(
        "The overhang doesn't just protect the wall. It changes how a room reads from inside — deepens the shadow, softens the light, lets you keep windows open through a downpour. We default to a deep overhang and then earn the right to shorten it where the geometry asks.",
      ),
      h2("Plinth and ground"),
      p(
        "A 600 mm plinth is the minimum we draw. In a heavy-rain zone — and most of Malabar qualifies — we go to 750 or 900. Splashback at ground level destroys plaster within two monsoons; raising the floor lets the wall start above the splash zone, and gives the house a small dignity besides.",
      ),
      p(
        "Beneath the plinth, the ground itself needs draining. We slope the entire compound away from the building, set perforated drains around the foundation, and pay attention to where the rain leaves the plot. A house on a flat plot in Calicut without an outflow plan ends up sitting in a shallow pool every July.",
      ),
      h2("The courtyard problem"),
      p(
        "Courtyards are wonderful in Kerala — they cool the house, ventilate the deepest rooms, and bring the sky inside. They also flood. A 2 metre by 2 metre courtyard during a heavy storm collects more water than most architects calculate for, and that water has to go somewhere. We've seen courtyards designed without drains; we've also designed one or two before learning better.",
      ),
      p(
        "What works: a generous drain at one corner, sized for peak rainfall, leading to a stormwater line that runs straight out of the site. A second overflow drain for the days the first one can't keep up. And — the small thing most people miss — a slight crown to the courtyard floor so water actually moves toward the drains instead of pooling at the centre.",
      ),
      h2("Materials"),
      pLink(
        "Some materials age beautifully in the monsoon. Some lose their will to live by the second year. Laterite, lime plaster, oxide floors, country wood (well-seasoned), terracotta tile, exposed RCC if it's properly mixed — all good. Painted gypsum board, MDF anywhere damp, cheap plywood, untreated softwood — all trouble. Material choice is one of the most useful things an architect adds to a project, and most of it is climate. The material register for Malabar is a longer post in itself.",
        "material register for Malabar",
        "/insights/material-register-for-malabar",
      ),
      h2("Roof"),
      p(
        "A pitched roof in clay tile is still the most weather-honest roof for Kerala. It sheds water fast, ages with the seasons, and replaces piece-by-piece if any tile cracks. Flat RCC roofs work too, but they need waterproofing every five to seven years and a serious slope to a serious drain. Either is fine. The mistake is doing neither properly.",
      ),
      p(
        "Whatever the roof, the valleys and ridges are where leaks start. Pay for the metalwork. Cheap flashing is a false economy that finds you in August.",
      ),
      h2("Gutters and downpipes"),
      p(
        "The most underrated element on a Kerala house. We oversize everything — gutters 150 mm wide minimum, downpipes 100 mm minimum, more where the catchment is large. Half the water leaks people complain about are not from roofs — they are from undersized gutters that overflow in heavy rain and run down the wall.",
      ),
      p(
        "Hidden gutters in a parapet look clean. They are also a five-year project, because they will eventually clog and they are impossible to clean. We use external gutters when the architecture allows, and accept the small visual cost.",
      ),
      h2("Cross-ventilation, not just opening"),
      p(
        "Windows that face each other across a room move air. Windows on one side of a room do not. In the monsoon you cannot leave windows open in the rain — but in the dry months, cross-ventilation is the difference between a house that runs on fans and a house that runs on air conditioning. We draw openings in pairs, on opposite walls, with the wind direction in mind.",
      ),
      p(
        "For the monsoon itself, we add jalis or louvered openings at high level — air moves out, rain stays in. A traditional Kerala detail that most modern houses skip.",
      ),
      h2("Joinery details that survive"),
      p(
        "Door and window frames touching the ground get eaten. Lift them onto a stone or RCC sill. Wooden frames need a 25-year hardwood, not a 5-year softwood. Joinery glue must be waterproof, not water-resistant. Sliding tracks fill with leaves and stop sliding by year three; build in a way to clean them.",
      ),
      h2("The small wins"),
      p(
        "Cover the AC outdoor unit. Stainless steel hardware. Powder-coat any metal. Slope every external sill. Drip-mould the underside of every overhang so water leaves rather than running back. Plant something low along the splashback line so the wall sees less ground-water spray.",
      ),
      p(
        "None of this is mysterious. Most of it is in the textbooks. But most houses in Kerala still get half of it wrong — usually because the architect drew the elevation first and inherited the climate afterwards. The right order is the reverse. The climate comes first. The drawing follows.",
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // 4. Material register for Malabar (authority)
  // ---------------------------------------------------------------------
  {
    slug: "material-register-for-malabar",
    title:
      "Laterite, lime, country wood — a material register for Malabar",
    excerpt:
      "What we specify on most of our houses, why, and what we have stopped specifying. A working register of materials that hold their character in the Calicut climate.",
    coverRef: COVER_REFS.solace,
    author: "Ar. Varun Gopal",
    authorRole: "Co-founder & Principal Architect",
    readingMinutes: 11,
    seoTitle:
      "A Material Register for Malabar — Laterite, Lime, Country Wood | SOHO Architects",
    seoDescription:
      "What we specify on most houses in Calicut and across Malabar, and why. A working register of climate-honest materials that age well in Kerala.",
    relatedServices: ["/services/residential-architects-calicut"],
    body: [
      p(
        "Every studio has materials it returns to. Not because they are fashionable, and not because they are local for local's sake — but because they earn their place over a decade, in a climate, across a portfolio. Here is the working register for ours, written as honestly as we can — what we use, what we've moved away from, and what we have not figured out yet.",
      ),
      h2("Walls"),
      h3("Laterite"),
      p(
        "Our default. Quarried in Malabar, cut to block, and laid wet. It carries the colour of the ground it came from. Used exposed, it weathers to a warm rust that gets better with age. Used plastered, it gives the wall mass and breath.",
      ),
      p(
        "Caveats: not all laterite is the same. The good stuff is dense and honey-coloured; the bad stuff is porous and fades to grey. Always specify the quarry. Always reject blocks that won't hold a clean edge.",
      ),
      h3("Brick"),
      p(
        "Where laterite is too expensive or the wall is internal, we use a good wirecut brick. Stable, dimensionally accurate, plasters cleanly. Not as expressive as laterite when exposed — we mostly use it covered.",
      ),
      h3("Concrete block — only where we must"),
      p(
        "Hollow blocks went into the early projects because they were cheap and fast. They also crack at corners, transmit sound, and feel like concrete blocks. We mostly don't draw them anymore. Where they're unavoidable, we plaster heavily and accept the structural compromise.",
      ),
      h2("Floors"),
      h3("Oxide"),
      p(
        "Red oxide, grey oxide, occasionally black. A pigmented cement floor that polishes to a soft sheen and ages beautifully. Specify the recipe by weight, not by eye — a 4 percent oxide load reads very different from a 6 percent load. Always test a panel on site before pouring the whole floor.",
      ),
      p(
        "Caveats: oxide floors need waterproofing under wet areas and patience during cure. They will hairline over two or three years. We tell clients in advance — hairlines are the floor settling in, not failing.",
      ),
      h3("Country tile (Athangudi)"),
      p(
        "Hand-set tile floors with strong geometric patterns. Better suited to specific rooms — entry halls, pooja rooms, occasional accent spaces — than whole houses. The pattern reads quickly; too much of it overwhelms.",
      ),
      h3("Indian stone — granite, kota, sandstone"),
      p(
        "Where we want a harder, cooler floor. Local kota in the rain-prone areas works well. Sandstone is for verandahs and outdoor spaces. Granite is restrained — flamed finish, not polished, kept to grey or charcoal.",
      ),
      h3("Vitrified tile"),
      p(
        "Useful where the room sees heavy wet — bathrooms, utility, sometimes a kitchen. We mostly stay in the 60 by 60 cm range and pick a matt finish. Glossy tile is a maintenance promise we do not want to make.",
      ),
      h2("Wood"),
      h3("Country woods — teak, jackwood, anjili"),
      p(
        "The honest woods of Kerala. Teak is the workhorse — heavy, stable, weather-tolerant, expensive. Anjili (jackfruit-tree wood) is the underrated alternative — beautiful golden colour, takes a polish, hardens with age. Jackwood is the same family, slightly less stable.",
      ),
      p(
        "Caveat: country wood has to be properly seasoned, which most yards do badly. We buy seasoned timber direct from sawmills, store it on site for a month before joinery, and treat termite-prone areas separately. The price difference between raw and seasoned timber is small. The reliability difference is enormous.",
      ),
      h3("Plywood"),
      p(
        "Boiling water-proof (BWP) only. Anywhere damp, anywhere joinery has to last. The marine-ply premium is worth paying every time. Cheap commercial ply delaminates in the monsoon — you'll see it bubble within two years.",
      ),
      h2("Plaster and finish"),
      h3("Lime plaster"),
      p(
        "Our preferred external finish. Breathes, lets the wall dry out after rain, ages with grace. Two coats over a properly prepared base. Less crack-prone than cement plaster, far more forgiving to look at.",
      ),
      p(
        "Caveat: lime plaster needs a mason who understands lime plaster. The trade is shrinking. We have two crews we trust; if neither is free, we adjust the schedule rather than substitute.",
      ),
      h3("Internal — IOP / IPS"),
      p(
        "Internal surfaces are often Indian-oxide paint over plaster, or polished cement (IPS) on accent walls. Both are quiet and warm. We avoid most acrylic paints.",
      ),
      h2("Metals"),
      p(
        "Brass for door hardware where the budget allows. Stainless steel everywhere else — the climate eats mild steel. Powder-coat or galvanised finishes on rebar exposed to rain. Aluminium for window frames only where teak doesn't make sense; we still prefer teak.",
      ),
      h2("Roofs and ceilings"),
      p(
        "Clay tile on a wooden frame, traditional Mangalore tile or local pattern. RCC slabs where the geometry needs them, finished in a brushed concrete or skim coat — not painted. Ceilings are often left as the underside of the slab; occasionally we drop a wood-batten ceiling for warmth.",
      ),
      h2("What we no longer specify"),
      p(
        "POP cornicing. Gypsum board in any wet zone. Cheap acrylic emulsion. MDF anywhere unless internal joinery in a fully dry room. Pre-laminated composite panels. Powder-coated MDF panels. We have used some of these and watched them fail; the register gets shorter with experience.",
      ),
      h2("How we choose"),
      pLink(
        "The simplest test: would this material be honest about its age in twenty years? If yes, it stays. If no, it doesn't. The houses we are proudest of are the ones whose materials have a story by the time anyone visits them — laterite that has warmed, wood that has darkened, lime that has settled. If you would like to walk through a few finished examples, the projects page is the best place to start.",
        "projects page",
        "/projects",
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // 5. Cost of interior renovation in Calicut (commercial intent)
  // ---------------------------------------------------------------------
  {
    slug: "cost-of-interior-renovation-calicut",
    title:
      "What does an interior renovation in Calicut actually cost?",
    excerpt:
      "Numbers we use in first conversations — for kitchens, full-house refits, single-room interiors. Honest ranges, what shifts them, and where most renovation budgets quietly leak.",
    coverRef: COVER_REFS.la_vie,
    author: "Ar. Suhail AK",
    authorRole: "Co-founder & Principal Architect",
    readingMinutes: 8,
    seoTitle:
      "Cost of Interior Renovation in Calicut — A 2026 Guide | SOHO Architects",
    seoDescription:
      "What an interior renovation actually costs in Calicut in 2026 — kitchen, full-house, single-room. Ranges, drivers, and where most budgets leak.",
    relatedServices: ["/services/interior-designers-calicut"],
    body: [
      p(
        "About a third of the studio's work is interiors — homes that are already built, that someone has lived in, that need to start working better. Less drama than a new house, but in some ways more difficult. You inherit decisions someone else made, and the cost depends on how many of them you want to undo.",
      ),
      p(
        "Here are the numbers we use in first conversations, as of 2026.",
      ),
      h2("Three kinds of interior project"),
      p(
        "Most enquiries fall into one of three brackets.",
      ),
      p(
        "Single-room refit. A kitchen, a master bedroom, a study. Usually because the room isn't working — bad layout, dated joinery, wrong light. Typical budget: ₹4 to ₹12 lakh, depending on room size and joinery scope. We usually quote 8 to 10 percent design fee on top.",
      ),
      p(
        "Full-house refresh. A house someone has been in for ten or fifteen years; the structure is fine but everything else needs reconsidering. Floors, joinery, lighting, soft goods, sometimes a small wall moved. Typical budget for a 2,500 sq ft house: ₹35 to ₹65 lakh, ex-design fee. Higher if a kitchen or bathroom is fully rebuilt.",
      ),
      p(
        "Full interior package on a new house. The interiors of a house we have also designed, where we are picking everything from finishes to art. Typical add-on: 25 to 40 percent of the build cost. So a ₹1 crore house carries ₹25 to ₹40 lakh in interior cost.",
      ),
      h2("The five things that move the number"),
      p(
        "Joinery. The single biggest line item in most interiors. Custom kitchens, wardrobes, dressing units, study desks. Built well, they last twenty years. Built cheaply, they sag in two. Joinery alone often accounts for 40 to 55 percent of a full-house interior budget.",
      ),
      p(
        "Bathrooms. Bathrooms are silent budget destroyers. Stripping out a tile and sanitaryware set and rebuilding properly is rarely under ₹3.5 lakh per bathroom, and can cross ₹8 lakh once you add steam, custom vanities, and imported fittings. Two bathrooms in a renovation are routinely 15 percent of the total.",
      ),
      p(
        "Floors. If you are changing the floor, you are also probably moving the skirting, the door bottoms, the AC outlets, sometimes the door swings. Floors don't change cheaply. Budget the floor decision honestly at the start.",
      ),
      p(
        "Lighting. Often underestimated. A house that is properly lit — layered lighting, dimmer control, the right colour temperature, switching that doesn't fight you — costs real money. Allow 6 to 9 percent of the interior budget for lighting and wiring rework.",
      ),
      p(
        "Soft goods. Curtains, upholstery, rugs, art. Easy to dismiss; easy to overspend on; easy to do badly. We try to specify a clear soft-goods allowance at the start so the studio voice carries through to the cushions, not just the walls.",
      ),
      h2("Where the budget leaks"),
      p(
        "Three places, every time.",
      ),
      p(
        "Decisions made twice. The client picked a tile, the contractor ordered something else, the wrong tile got laid. Half the floor is re-done at the client's cost. We see this on most projects without a designer running point.",
      ),
      p(
        "Wishful thinking on the existing structure. \"The pipes look fine\" — until they aren't, and the wall is opened. \"The wiring is okay\" — until it isn't, and the whole circuit needs replacement. Carry a 12 to 15 percent contingency on any renovation. The older the house, the more.",
      ),
      p(
        "Scope creep mid-project. The single most expensive sentence in any interior renovation is \"while we're at it.\" Decide what you're doing at the start. Add nothing new without a written change order. Otherwise the budget walks away from you, and the timeline does too.",
      ),
      h2("Timeline"),
      p(
        "A single-room refit usually takes 6 to 10 weeks once design is approved. A full-house renovation runs 4 to 6 months, sometimes longer if you're living in the house through it. Living-in adds about 30 percent to the timeline because work happens in phases — one floor or one wing at a time — rather than the whole house at once.",
      ),
      h2("Working with a designer vs. without"),
      pLink(
        "On a small refit, you can probably do it without a designer if you have a good contractor and a clear taste. On anything larger — full house, multiple rooms, anything where joinery and lighting and finishes have to talk to each other — a designer pays for themselves in coordination alone. Most of what we save clients is not in clever ideas; it is in stopping bad ones before they get built. If you'd like a fuller picture of how we work on interiors, the interior designers in Calicut page is a good place to start.",
        "interior designers in Calicut",
        "/services/interior-designers-calicut",
      ),
      h2("When to start"),
      p(
        "Earlier than you think. Good interior design takes 6 to 10 weeks of design before any contractor walks in. Joinery alone is often 8 to 12 weeks of build after that. If you want a kitchen ready by Onam, talking to the designer in May is late.",
      ),
    ],
    faqs: [
      {
        q: "What's the minimum budget for an interior designer in Calicut?",
        a: "Most reputable studios don't take on full interior projects below ₹15 to ₹20 lakh in build value — the design effort is similar regardless of scale, and below a certain budget the fee makes the project uneconomic for everyone. Single-room consults can be more flexible.",
      },
      {
        q: "Can I just hire a contractor for an interior renovation?",
        a: "Yes, for small jobs. For anything where finishes, joinery, lighting, and floor coverings all have to coordinate, a designer is the cheaper option in practice — even with the design fee — because they prevent the costly mistakes.",
      },
      {
        q: "Do you do bathroom-only or kitchen-only projects?",
        a: "Yes, if the brief is interesting and the budget supports good work. We charge a fixed design fee for single-room projects rather than a percentage, because the math works out better at small scale.",
      },
    ],
  },
];

// ---------- Write drafts ----------

async function main() {
  for (const d of DRAFTS) {
    const docId = `drafts.insight.${d.slug}`;

    const doc = {
      _id: docId,
      _type: "insightPost",
      title: d.title,
      slug: { _type: "slug", current: d.slug },
      publishedAt: new Date().toISOString(),
      excerpt: d.excerpt,
      cover: {
        _type: "image",
        asset: { _ref: d.coverRef, _type: "reference" },
        alt: `${d.title} — SOHO Architects, Calicut`,
      },
      author: d.author,
      authorRole: d.authorRole,
      readingMinutes: d.readingMinutes,
      body: d.body,
      ...(d.faqs && d.faqs.length > 0
        ? {
            faqs: d.faqs.map((f) => ({
              _key: k(),
              _type: "object",
              q: f.q,
              a: f.a,
            })),
          }
        : {}),
      ...(d.relatedServices && d.relatedServices.length > 0
        ? { relatedServices: d.relatedServices }
        : {}),
      ...(d.seoTitle || d.seoDescription
        ? {
            seo: {
              ...(d.seoTitle ? { title: d.seoTitle } : {}),
              ...(d.seoDescription ? { description: d.seoDescription } : {}),
            },
          }
        : {}),
    };

    await client.createOrReplace(doc);
    console.log(`✓ draft created: ${d.slug}`);
  }

  console.log(
    `\nSeeded ${DRAFTS.length} draft posts. Open /admin → Insights to review + publish.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
