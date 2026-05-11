import { SanityImage } from "@/components/sanity/SanityImage";
import { Container } from "@/components/ui/Container";
import type { ProjectDetail } from "@/lib/types";

export function ProjectHero({ project }: { project: ProjectDetail }) {
  const city = project.location?.split(",")[0]?.trim();
  return (
    <section className="relative">
      <div className="relative w-full h-[70vh] md:h-[88vh] min-h-[420px] bg-surface overflow-hidden">
        <SanityImage
          image={project.cover}
          alt={project.cover?.alt || project.name}
          sizes="100vw"
          priority
          fill
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 via-ink/15 to-transparent pointer-events-none"
        />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-10 md:pb-16 text-cream">
          <span className="eyebrow text-cream/80">
            {String(project.projectNumber).padStart(2, "0")} · {project.year}
            {city ? ` · ${city}` : ""}
          </span>
          <h1 className="mt-4 font-serif text-display tracking-tight max-w-[18ch]">
            {project.name}
          </h1>
        </Container>
      </div>
    </section>
  );
}
