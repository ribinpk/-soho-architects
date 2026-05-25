import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { SanityImage } from "@/components/sanity/SanityImage";
import { InquiryCta } from "@/components/site/InquiryCta";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { JsonLd } from "@/components/seo/JsonLd";
import type { StudioPageData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { studioPageQuery } from "@/sanity/lib/queries";
import { absoluteUrl, breadcrumbsJsonLd, ORG_ID } from "@/lib/seo";

export const revalidate = 60;

const FALLBACK_HEADLINE = "SOHO Studio, Calicut";

const FALLBACK_INTRO: string[] = [
  "SOHO began at a kitchen table in Calicut in 2011 — a small office, a home office, the two collapsed into one. The name stuck.",
  "Fifteen years on, the studio is larger and the table is gone, but the premise hasn't moved. We have delivered over a hundred and twelve projects since — houses, workplaces, interiors — across three Indian states, the bulk of them in Kerala, where the monsoon writes half the brief. The principles don't change with the postcode.",
  "We remain a single studio in Kozhikode by choice. Every project is led personally by one of the founders, from the first conversation to the last site visit.",
];

const FALLBACK_TEAM: {
  name: string;
  role: string;
  bio: string[];
}[] = [
  {
    name: "Ar. Suhail AK",
    role: "Co-founder & Principal Architect",
    bio: [
      "Suhail leads the studio's architectural work, and is the partner most likely to be found on site.",
      "He cares about how a building meets the ground, how a wall meets the sky, and very little in between is left unresolved.",
    ],
  },
  {
    name: "Ar. Varun Gopal",
    role: "Co-founder & Principal Architect",
    bio: [
      "Studied at TKM College of Engineering and Politecnico di Milano, with practice experience across India and Europe.",
      "Varun leads the studio's institutional and public work, and brings a context-driven approach — socially responsive, slow to settle on form, attentive to what the place asks for.",
    ],
  },
  {
    name: "Ar. Nabeel",
    role: "Principal Interior Designer",
    bio: [
      "Nabeel leads SOHO's interiors and finishing team, and works at the scale where buildings become rooms.",
      "A door pull, a skirting, a junction between two materials — these decide whether a space feels resolved or merely complete. Known in the studio for noticing things others miss.",
    ],
  },
];

type PressEntry = { year?: number; title: string; source?: string; url?: string };

const FALLBACK_PRESS: PressEntry[] = [
  {
    year: 2023,
    title: "Silver Leaf — IIA Kerala State Award",
    source: "IIA Kerala",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<StudioPageData | null>(studioPageQuery);
  return {
    title: {
      absolute:
        data?.seo?.title ||
        "Best Architecture Firm in Calicut | SOHO Architects",
    },
    description:
      data?.seo?.description ||
      "Founded in Calicut in 2011 by Suhail AK and Varun Gopal. A founder-led architecture firm in Kozhikode, recognised by IIA Kerala for residential and institutional work.",
    alternates: { canonical: "/studio" },
    openGraph: {
      title: "The Studio — SOHO Architects, Calicut",
      description:
        "Founder-led architecture firm in Calicut (Kozhikode), Kerala. Founded 2011. Meet the partners, the process, and the studio.",
      url: "/studio",
    },
  };
}

export default async function StudioPage() {
  const data = await sanityFetch<StudioPageData | null>(studioPageQuery, {
    tags: ["studioPage"],
  });

  const introBody = data?.introBody && data.introBody.length > 0 ? data.introBody : null;
  const team = data?.team && data.team.length > 0 ? data.team : null;
  const press: PressEntry[] =
    data?.press && data.press.length > 0 ? data.press : FALLBACK_PRESS;

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Studio", path: "/studio" },
  ]);

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About SOHO Architects — The Studio",
    url: absoluteUrl("/studio"),
    mainEntity: { "@id": ORG_ID },
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={aboutPageJsonLd} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">The Studio · Calicut, Kerala</span>
            <h1 className="mt-8 font-serif text-display tracking-tight max-w-[20ch]">
              {data?.introHeadline || FALLBACK_HEADLINE}
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-mute">
              SOHO Architects — a founder-led architecture and interior
              design firm in Calicut (Kozhikode), Kerala. Founded 2011.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-3">
              <Reveal>
                <span className="eyebrow">About</span>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal delay={0.08}>
                {introBody ? (
                  <PortableTextRenderer value={introBody} />
                ) : (
                  <div className="space-y-5 text-body-lg leading-relaxed">
                    {FALLBACK_INTRO.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <ProcessTimeline />

      <section className="py-16 md:py-28 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Team</span>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
            {team
              ? team.map((member, i) => (
                  <Reveal key={`${member.name}-${i}`} delay={(i % 3) * 0.06}>
                    <article>
                      {member.headshot && (
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
                          <SanityImage
                            image={member.headshot}
                            alt={member.headshot.alt || member.name}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="mt-5 font-serif text-2xl tracking-tight">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-mute">{member.role}</p>
                      {member.bio && member.bio.length > 0 && (
                        <div className="mt-3 text-sm">
                          <PortableTextRenderer value={member.bio} />
                        </div>
                      )}
                    </article>
                  </Reveal>
                ))
              : FALLBACK_TEAM.map((member, i) => (
                  <Reveal key={member.name} delay={(i % 3) * 0.06}>
                    <article>
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface" />
                      <h3 className="mt-5 font-serif text-2xl tracking-tight">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-mute">{member.role}</p>
                      <div className="mt-3 space-y-3 text-sm leading-relaxed">
                        {member.bio.map((p, j) => (
                          <p key={j}>{p}</p>
                        ))}
                      </div>
                    </article>
                  </Reveal>
                ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-28 border-b border-hairline">
        <Container>
          <Reveal>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-headline">Press &amp; recognition</h2>
            </div>
          </Reveal>
          <ul className="mt-10 border-t border-hairline">
            {press.map((p, i) => (
              <li
                key={i}
                className="border-b border-hairline py-5 grid grid-cols-12 gap-4 items-baseline"
              >
                <span className="col-span-2 md:col-span-1 eyebrow">
                  {p.year ?? "—"}
                </span>
                <div className="col-span-10 md:col-span-8">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-mute transition-colors"
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </div>
                <span className="col-span-12 md:col-span-3 text-sm text-mute md:text-right">
                  {p.source}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <InquiryCta
        eyebrow="Work with us"
        headline="Have a project in mind?"
        subhead="Tell us about your site."
        ctaLabel="Start an inquiry"
      />
    </>
  );
}
