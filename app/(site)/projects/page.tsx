import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { InquiryCta } from "@/components/site/InquiryCta";
import type { ProjectCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsIndexQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by SOHO Architects across residential, commercial, and workspace projects.",
};

export default async function ProjectsIndexPage() {
  const projects = await sanityFetch<ProjectCardData[]>(projectsIndexQuery, {
    tags: ["projects"],
  });

  return (
    <>
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Selected work</span>
            <h1 className="mt-6 font-serif text-headline max-w-[20ch]">
              Projects across residence, workplace, and place.
            </h1>
            <p className="mt-6 text-body-lg text-mute max-w-2xl">
              {projects.length === 0
                ? "Projects will appear here once the studio adds them."
                : `${String(projects.length).padStart(2, "0")} project${projects.length === 1 ? "" : "s"}.`}
            </p>
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
