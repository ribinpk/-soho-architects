import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ProjectCard } from "@/components/site/ProjectCard";
import { InquiryCta } from "@/components/site/InquiryCta";
import { SanityImage } from "@/components/sanity/SanityImage";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ProjectCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homeQuery } from "@/sanity/lib/queries";
import { faqPageJsonLd, siteUrl } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Architects in Calicut (Kozhikode), Kerala — SOHO Architects",
  },
  description:
    "SOHO Architects — an architecture and interior design firm in Calicut (Kozhikode), Kerala. Founder-led residential, commercial, and interior projects across Malabar since 2011.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Architects in Calicut (Kozhikode), Kerala — SOHO Architects",
    description:
      "Architecture and interior design firm in Calicut (Kozhikode), Kerala. Founder-led, climate-responsive, working across Kerala since 2011.",
    url: "/",
  },
};

// Placeholder one-line captions per project, keyed by slug. Shown on the
// home page tiles until the studio refines each per project (likely via
// Sanity later). Leaving the map open means any unknown slug just shows
// no caption — never a stale placeholder for a project we didn't intend.
const PROJECT_CAPTIONS: Record<string, string> = {
  "soho-work-living":
    "The studio's own building. A test case for everything we ask of clients.",
  "valley-house":
    "A house that gives the hillside back its view.",
  "mathamangalam-house":
    "Laterite, shade, and a long verandah for the rain.",
  "payyavoor-house":
    "A courtyard at the centre, the plan arranged around it.",
  "sanctum-of-solace":
    "A home built to be quieter than the street outside.",
  "la-vie":
    "Light from the east, kept low until noon.",
};

type HomeData = {
  featured: ProjectCardData[];
  selected: ProjectCardData[];
};

export default async function HomePage() {
  const data = await sanityFetch<HomeData>(homeQuery, { tags: ["projects"] });
  const featured =
    data.featured.length > 0
      ? data.featured.slice(0, 3)
      : data.selected.slice(0, 3);
  const heroProject = featured[0] ?? data.selected[0];
  const rest = data.selected.slice(featured.length, featured.length + 4);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SOHO Architects",
    url: siteUrl(),
    publisher: { "@id": `${siteUrl()}/#organization` },
    inLanguage: "en-IN",
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqPageJsonLd(HOME_FAQS)} />
      {/* Hero */}
      <section className="border-b border-hairline">
        <Container className="px-0 sm:px-0 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-[88vh]">
            <div className="md:col-span-5 md:col-start-1 px-5 sm:px-8 pt-28 pb-14 md:p-12 lg:p-16 flex flex-col justify-end">
              <Reveal>
                <span className="eyebrow">SOHO Architects · Kozhikode</span>
                <SplitText
                  as="h1"
                  text="Architects in Calicut, building for light, terrain, and the way people gather."
                  className="mt-6 block font-serif text-display tracking-tight max-w-[20ch]"
                  delay={0.2}
                  stagger={0.05}
                />
                <p className="mt-6 max-w-md text-body-lg text-mute">
                  SOHO Architects is an architecture and interior design firm
                  based in Calicut (Kozhikode), Kerala. Founder-led,
                  climate-responsive, working across homes, workplaces, and
                  quiet rooms since 2011.
                </p>
                <div className="mt-10 flex flex-wrap gap-3 text-sm">
                  <Link
                    href="/projects"
                    className="inline-flex items-center h-11 px-5 border border-ink hover:bg-ink hover:text-cream transition-colors"
                  >
                    View projects
                    <span aria-hidden="true" className="ml-3">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/studio"
                    className="inline-flex items-center h-11 px-5 text-mute hover:text-ink transition-colors"
                  >
                    About the studio
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7 md:row-start-1 relative aspect-[4/5] md:aspect-auto bg-surface">
              {heroProject ? (
                <Link
                  href={`/projects/${heroProject.slug}`}
                  className="group block absolute inset-0"
                >
                  <SanityImage
                    image={heroProject.cover}
                    alt={heroProject.cover?.alt || heroProject.name}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-cream">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 to-transparent pointer-events-none" />
                    <div className="relative">
                      <span className="eyebrow text-cream/80">
                        Featured ·{" "}
                        {String(heroProject.projectNumber).padStart(2, "0")}
                      </span>
                      <p className="mt-2 font-serif text-2xl md:text-3xl tracking-tight">
                        {heroProject.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured */}
      {featured.length > 1 && (
        <section className="py-20 md:py-32 border-b border-hairline">
          <Container>
            <Reveal>
              <div className="md:grid md:grid-cols-12 md:gap-12 md:items-end">
                <div className="md:col-span-5">
                  <h2 className="font-serif text-headline">Selected work</h2>
                </div>
                <div className="md:col-span-6 md:col-start-6 mt-5 md:mt-0">
                  <p className="text-body-lg text-mute max-w-[44ch]">
                    A small selection. Houses that learned from their
                    hillsides, rooms that hold the afternoon, workplaces
                    that don&apos;t pretend to be elsewhere.
                  </p>
                </div>
                <div className="md:col-span-1 md:col-start-12 md:justify-self-end mt-4 md:mt-0">
                  <Link
                    href="/projects"
                    className="hidden md:inline-flex text-sm text-mute hover:text-ink transition-colors whitespace-nowrap"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            </Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-16 md:gap-y-24">
              {featured.slice(1).map((p, i) => (
                <div
                  key={p._id}
                  className={i % 2 === 1 ? "md:mt-20 lg:mt-32" : ""}
                >
                  <Reveal delay={(i % 2) * 0.08}>
                    <ProjectCard
                      project={p}
                      variant="default"
                      caption={PROJECT_CAPTIONS[p.slug]}
                    />
                  </Reveal>
                </div>
              ))}
            </div>
            {rest.length > 0 && (
              <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
                {rest.map((p, i) => (
                  <Reveal key={p._id} delay={i * 0.06}>
                    <ProjectCard
                      project={p}
                      variant="compact"
                      caption={PROJECT_CAPTIONS[p.slug]}
                    />
                  </Reveal>
                ))}
              </div>
            )}
            <div className="mt-16 md:hidden">
              <Link
                href="/projects"
                className="text-sm text-mute hover:text-ink transition-colors"
              >
                View all projects →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Why SOHO — authority + Calicut keyword surface */}
      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">Why SOHO</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[18ch]">
                  An architecture firm in Calicut, for Kerala&apos;s climate
                  and the way it lives.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.08}>
                <div className="space-y-5 text-body-lg leading-relaxed max-w-[58ch]">
                  <p>
                    Founded in Calicut in 2011, SOHO is a founder-led
                    architecture and interior design practice. Every project
                    is run by one of three partners from the first
                    conversation to the last site visit — not by a junior
                    team you only meet on signing day.
                  </p>
                  <p>
                    We design for the place we&apos;re from. Malabar light,
                    long monsoons, laterite ground, courtyards that breathe,
                    verandahs that work harder than they look. Most of our
                    work is in Kozhikode and across Kerala — Malappuram,
                    Kannur, Wayanad, Thrissur — with the occasional project
                    elsewhere in India.
                  </p>
                  <p>
                    The studio works across three lines: residential
                    architecture (houses, villas, second homes), commercial
                    and workplace projects (offices, hospitality, small
                    institutional work), and interior design — rooms
                    detailed the way the building was drawn. Recognised by
                    IIA Kerala and a small number of editorial publications,
                    but mostly by clients who came back for the next house.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <Link
                    href="/services/residential-architects-calicut"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Residential architects in Calicut →
                  </Link>
                  <Link
                    href="/services/commercial-architects-calicut"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Commercial architects in Calicut →
                  </Link>
                  <Link
                    href="/services/interior-designers-calicut"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Interior designers in Calicut →
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* What we work on — gives the marquee a sentence each */}
      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">What we work on</span>
          </Reveal>
          <dl className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-12">
            {[
              {
                term: "Residential",
                detail:
                  "Homes for the way Kerala actually lives — verandahs, courtyards, families that gather.",
                href: "/services/residential-architects-calicut",
              },
              {
                term: "Workspace",
                detail:
                  "Offices that read the climate before the brief. Daylight first, air second, screens last.",
                href: "/services/commercial-architects-calicut",
              },
              {
                term: "Hospitality",
                detail:
                  "Small hotels and retreats that belong to their site, not to a style.",
                href: "/services/commercial-architects-calicut",
              },
              {
                term: "Interiors",
                detail:
                  "Rooms finished the way the building was drawn — every joint resolved twice.",
                href: "/services/interior-designers-calicut",
              },
              {
                term: "Heritage",
                detail:
                  "Tile-roofed buildings rethought without losing their bones.",
              },
            ].map((item, i) => (
              <Reveal key={item.term} delay={(i % 2) * 0.06}>
                <div className="border-t border-hairline pt-6">
                  <dt className="font-serif text-2xl md:text-3xl tracking-tight">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="press hover:text-mute transition-colors"
                      >
                        {item.term}
                        <span aria-hidden="true" className="ml-2 text-mute">
                          →
                        </span>
                      </Link>
                    ) : (
                      item.term
                    )}
                  </dt>
                  <dd className="mt-3 text-body-lg text-mute max-w-[42ch]">
                    {item.detail}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Studio teaser */}
      <section className="relative py-24 md:py-36 border-b border-hairline overflow-hidden">
        {/* Rooted identity — large soft Malayalam watermark.
            "സോഹോ" — SOHO, transliterated. */}
        <span
          aria-hidden="true"
          lang="ml"
          className="absolute select-none pointer-events-none font-serif leading-[0.85] tracking-tight text-ink opacity-[0.045] -bottom-[6vw] md:-bottom-[8vw] -right-[2vw] md:-right-[4vw] text-[42vw] md:text-[24vw]"
        >
          സോഹോ
        </span>
        <Container className="relative">
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-3">
              <Reveal>
                <span className="eyebrow">The studio</span>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal delay={0.08}>
                <p className="font-serif text-title tracking-tight leading-tight">
                  Most of our work is in Kerala, where the monsoon writes
                  half the brief. Some of it is elsewhere. The principles
                  don&apos;t change with the postcode.
                </p>
                <Link
                  href="/studio"
                  className="mt-10 inline-flex items-center text-sm text-ink underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                >
                  About the studio →
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Working with an architect — pre-FAQ consideration content.
          Long-form prose that maps to the "how do I work with an architect
          in Calicut" search intent, in studio voice. */}
      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">How we work</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[16ch]">
                  Working with an architect in Calicut.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.08}>
                <div className="space-y-5 text-body-lg leading-relaxed max-w-[58ch]">
                  <p>
                    Most of our clients arrive with a plot, a budget that
                    isn't yet fixed, and a sense that a house has to do more
                    than fit on a drawing. The first meeting is unhurried —
                    usually at our studio in Malaparamba, sometimes on the
                    site itself if it's nearby. There's no presentation. We
                    listen, ask, and try to understand what the place is
                    asking for before any line is drawn.
                  </p>
                  <p>
                    Design begins with a site visit and a measure. Light
                    studies, soil notes, the trees worth keeping, the
                    neighbour&apos;s wall that&apos;s already deciding part
                    of your plan. A concept follows — usually within six to
                    eight weeks. Schematic drawings, then design development,
                    then the working set the contractor builds from. Each
                    phase has a sign-off so we&apos;re moving forward with
                    you, not ahead of you. A typical{" "}
                    <Link
                      href="/services/residential-architects-calicut"
                      className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                    >
                      residential project
                    </Link>{" "}
                    takes four to six months from first meeting to
                    construction-ready drawings.
                  </p>
                  <p>
                    Construction is supervised. We don&apos;t hand over a
                    set of drawings and disappear. One of the partners is on
                    site every fortnight at minimum, more often during finish
                    stages. Material samples are reviewed in person. We work
                    with a small group of contractors across Kozhikode,
                    Malappuram, Kannur, and Wayanad who know how to build
                    what we draw — which means fewer surprises and a build
                    that holds its lines.
                  </p>
                  <p>
                    Fees are a percentage of the build cost, set in writing
                    at the first meeting before any work begins. We&apos;re
                    happy to talk about budget early — the earlier the
                    better. A site visit and the first conversation are
                    always at no cost.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <Link
                    href="/inquiries"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Start a conversation →
                  </Link>
                  <Link
                    href="/studio"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Meet the partners →
                  </Link>
                  <Link
                    href="/projects"
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    Houses we&apos;ve built in Kerala →
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ — answers common queries from prospective clients in Calicut & Kerala.
          Plain HTML; FAQPage JSON-LD wired up in Phase 5. */}
      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">FAQ</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[14ch]">
                  Working with an architect in Calicut.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <dl className="border-t border-hairline">
                {HOME_FAQS.map((item, i) => (
                  <Reveal key={item.q} delay={(i % 3) * 0.05}>
                    <div className="border-b border-hairline py-7 md:py-8">
                      <dt className="font-serif text-2xl md:text-[1.7rem] tracking-tight">
                        {item.q}
                      </dt>
                      <dd className="mt-3 text-body-lg text-mute leading-relaxed max-w-[60ch]">
                        {item.a}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
              <p className="mt-8 text-sm text-mute">
                More questions? <Link href="/inquiries" className="press underline decoration-1 underline-offset-4 hover:text-ink transition-colors">Start an inquiry</Link> — we reply within three working days, always from a person.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <InquiryCta />
    </>
  );
}

const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "Where are SOHO Architects based?",
    a: "Our studio is on Golf Link Road, Malaparamba, in Calicut (Kozhikode). Most of our work is in Kerala — Kozhikode, Malappuram, Kannur, Wayanad, Thrissur — with the occasional project elsewhere in India.",
  },
  {
    q: "What does SOHO Architects work on?",
    a: "Three lines of work: residential architecture (houses, villas, second homes), commercial and workplace projects (offices, small hotels, institutional buildings), and interior design. Every project is led personally by one of the three founding partners.",
  },
  {
    q: "How much does a house designed by an architect in Calicut cost?",
    a: "Architect fees in Calicut typically run between 6% and 10% of the build cost, depending on scope and the level of detailing involved. Build costs vary widely by site, finishes, and structural system. We discuss budgets openly at the first meeting so there are no surprises later.",
  },
  {
    q: "How long does it take to design and build a house in Kerala?",
    a: "From the first conversation to handover, a typical SOHO house takes 18 to 30 months — roughly 4 to 6 months of design and drawings, the rest in construction. Larger or more complex projects take longer. We'd rather move at the pace the building deserves than rush a draft.",
  },
  {
    q: "Do you work on small projects or interiors only?",
    a: "Yes. About a third of the studio's work is interiors — homes already built that want resolving — or smaller renovations and additions. We're happy to start with a single room and stay through the rest of the house.",
  },
];
