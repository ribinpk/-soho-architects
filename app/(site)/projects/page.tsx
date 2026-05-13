import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { InquiryCta } from "@/components/site/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ProjectCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsIndexQuery } from "@/sanity/lib/queries";
import { absoluteUrl, breadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Projects by Architects in Calicut | SOHO Architects",
  },
  description:
    "Selected work by SOHO Architects across Kerala — residential, commercial, hospitality, and interior projects from our studio in Calicut (Kozhikode).",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Architects in Calicut | SOHO Architects",
    description:
      "Selected work by SOHO Architects — houses, workspaces, and interiors across Kerala. Designed from our studio in Calicut.",
    url: "/projects",
  },
};

export default async function ProjectsIndexPage() {
  const projects = await sanityFetch<ProjectCardData[]>(projectsIndexQuery, {
    tags: ["projects"],
  });

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects by SOHO Architects, Calicut",
    url: absoluteUrl("/projects"),
    description:
      "Selected work by SOHO Architects — houses, workspaces, and interiors across Kerala.",
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: absoluteUrl(`/projects/${p.slug}`),
      locationCreated: p.location
        ? { "@type": "Place", name: p.location }
        : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collectionJsonLd} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Selected work · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-headline max-w-[22ch]">
              Projects by architects in Calicut — houses, workspaces, places.
            </h1>
            <p className="mt-6 text-body-lg text-mute max-w-2xl">
              A small selection of completed work by SOHO Architects, an
              architecture and interior design firm in Calicut (Kozhikode),
              Kerala. Houses across Malabar, the studio&apos;s own workspace,
              and a handful of projects further afield.
            </p>
            {projects.length > 0 && (
              <p className="mt-3 text-sm text-mute">
                {String(projects.length).padStart(2, "0")} project
                {projects.length === 1 ? "" : "s"} on file.
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container>
          {projects.length === 0 ? (
            <div className="py-24 text-center text-mute">
              <p className="font-serif text-2xl">No projects yet.</p>
              <p className="mt-2 text-sm">
                Run the CSV importer or add projects through the studio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-16 md:gap-y-24">
              {projects.map((project, i) => (
                <div
                  key={project._id}
                  className={i % 2 === 1 ? "md:mt-20 lg:mt-32" : ""}
                >
                  <Reveal delay={(i % 2) * 0.08}>
                    <ProjectCard
                      project={project}
                      variant="default"
                      priority={i < 2}
                    />
                  </Reveal>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <InquiryCta />
    </>
  );
}
