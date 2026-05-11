import { Container } from "@/components/ui/Container";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { CountUp } from "@/components/ui/CountUp";
import type { ProjectDetail } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
};

export function ProjectMeta({ project }: { project: ProjectDetail }) {
  const statusLabel = project.status ? STATUS_LABEL[project.status] : undefined;

  return (
    <section className="border-b border-hairline">
      <Container className="py-14 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <dl className="md:col-span-5">
          {project.year && (
            <div>
              <dt className="eyebrow">Year</dt>
              <dd className="mt-2 font-serif tracking-tight leading-none text-5xl md:text-6xl lg:text-7xl tabular-nums">
                <CountUp to={project.year} span={14} duration={1.4} />
              </dd>
            </div>
          )}

          {statusLabel && (
            <div className="mt-6 inline-flex items-center gap-2 border border-hairline rounded-full pl-2 pr-3.5 py-1">
              <span
                className={`size-1.5 rounded-full ${
                  project.status === "completed" ? "bg-ink" : "bg-mute"
                }`}
                aria-hidden="true"
              />
              <span className="text-xs tracking-wide">{statusLabel}</span>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-4">
            {project.client && (
              <div>
                <dt className="eyebrow">Client</dt>
                <dd className="mt-2 text-sm">{project.client}</dd>
              </div>
            )}
            {project.builtArea && (
              <div>
                <dt className="eyebrow">Built area</dt>
                <dd className="mt-2 text-sm">{project.builtArea}</dd>
              </div>
            )}
            {project.location && (
              <div className="col-span-2">
                <dt className="eyebrow">Location</dt>
                <dd className="mt-2 text-sm leading-relaxed">
                  {project.location}
                </dd>
              </div>
            )}
          </div>
        </dl>

        <div className="md:col-span-6 md:col-start-7">
          <PortableTextRenderer
            value={project.description}
            className="with-dropcap"
          />
        </div>
      </Container>
    </section>
  );
}
