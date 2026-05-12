import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ProjectCard } from "@/components/site/ProjectCard";
import { InquiryCta } from "@/components/site/InquiryCta";
import { StatsStrip } from "@/components/site/StatsStrip";
import { Testimonials } from "@/components/site/Testimonials";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { ProjectCardData, TestimonialItem } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homeQuery, testimonialsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SOHO Architects — Architecture & Interiors, Kozhikode",
  description:
    "An architecture and interiors practice on the Malabar coast. Houses, workplaces, and quiet rooms — built slowly, drawn by hand where it matters.",
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
  const [data, testimonials] = await Promise.all([
    sanityFetch<HomeData>(homeQuery, { tags: ["projects"] }),
    sanityFetch<TestimonialItem[] | null>(testimonialsQuery, {
      tags: ["siteSettings"],
    }),
  ]);
  const featured =
    data.featured.length > 0
      ? data.featured.slice(0, 3)
      : data.selected.slice(0, 3);
  const heroProject = featured[0] ?? data.selected[0];
  const rest = data.selected.slice(featured.length, featured.length + 4);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline">
        <Container className="px-0 sm:px-0 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-[88vh]">
            <div className="md:col-span-5 md:col-start-1 px-5 sm:px-8 pt-28 pb-14 md:p-12 lg:p-16 flex flex-col justify-end">
              <Reveal>
                <span className="eyebrow">SOHO Architects · Kozhikode</span>
                <SplitText
                  as="h1"
                  text="Buildings shaped by light, terrain, and the way people gather."
                  className="mt-6 block font-serif text-display tracking-tight max-w-[18ch]"
                  delay={0.2}
                  stagger={0.05}
                />
                <p className="mt-6 max-w-md text-body-lg text-mute">
                  An architecture and interiors practice on the Malabar
                  coast, working across homes, workplaces, and quiet rooms.
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

      {/* Stats — authority strip */}
      <StatsStrip />

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
              },
              {
                term: "Workspace",
                detail:
                  "Offices that read the climate before the brief. Daylight first, air second, screens last.",
              },
              {
                term: "Hospitality",
                detail:
                  "Small hotels and retreats that belong to their site, not to a style.",
              },
              {
                term: "Interiors",
                detail:
                  "Rooms finished the way the building was drawn — every joint resolved twice.",
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
                    {item.term}
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

      {/* From the studio — replaces synthetic testimonials */}
      <Testimonials testimonials={testimonials ?? undefined} />

      {/* Marquee — editorial tagline strip */}
      <Marquee
        items={[
          "Residential",
          "Workspace",
          "Hospitality",
          "Interiors",
          "Heritage",
        ]}
      />

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
                  An architecture and interiors practice in Kozhikode. Most
                  of our work is in Kerala, where the monsoon writes half
                  the brief. Some of it is elsewhere. The principles
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

      <InquiryCta />
    </>
  );
}
