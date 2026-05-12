import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { SanityImage } from "@/components/sanity/SanityImage";
import { InquiryCta } from "@/components/site/InquiryCta";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import type { StudioPageData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { studioPageQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<StudioPageData | null>(studioPageQuery);
  return {
    title: data?.seo?.title || "Studio",
    description:
      data?.seo?.description ||
      "About SOHO Architects — the studio, its approach, and the people behind the work.",
  };
}

export default async function StudioPage() {
  const data = await sanityFetch<StudioPageData | null>(studioPageQuery, {
    tags: ["studioPage"],
  });

  return (
    <>
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">The Studio</span>
            <p className="mt-8 font-serif text-display tracking-tight max-w-[20ch]">
              {data?.introHeadline ||
                "An architecture studio shaped by site, climate, and the people we build for."}
            </p>
          </Reveal>
        </Container>
      </section>

      {data?.introBody && data.introBody.length > 0 && (
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
                  <PortableTextRenderer value={data.introBody} />
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      )}

      {data?.approachBody && data.approachBody.length > 0 && (
        <section className="py-16 md:py-28 border-b border-hairline">
          <Container>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-3">
                <Reveal>
                  <span className="eyebrow">Approach</span>
                  {data.approachHeadline && (
                    <h2 className="mt-4 font-serif text-title">
                      {data.approachHeadline}
                    </h2>
                  )}
                </Reveal>
              </div>
              <div className="md:col-span-7 md:col-start-5">
                <Reveal delay={0.08}>
                  <PortableTextRenderer value={data.approachBody} />
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      )}

      <ProcessTimeline />

      {data?.team && data.team.length > 0 && (
        <section className="py-16 md:py-28 border-b border-hairline">
          <Container>
            <Reveal>
              <span className="eyebrow">Team</span>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
              {data.team.map((member, i) => (
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
              ))}
            </div>
          </Container>
        </section>
      )}

      {data?.press && data.press.length > 0 && (
        <section className="py-16 md:py-28 border-b border-hairline">
          <Container>
            <Reveal>
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-headline">Press & recognition</h2>
              </div>
            </Reveal>
            <ul className="mt-10 border-t border-hairline">
              {data.press.map((p, i) => (
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
      )}

      <InquiryCta
        eyebrow="Work with us"
        headline="Have a project in mind?"
        ctaLabel="Start an inquiry"
      />
    </>
  );
}
