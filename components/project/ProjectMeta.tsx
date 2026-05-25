import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { CountUp } from "@/components/ui/CountUp";
import type { ProjectDetail } from "@/lib/types";
import { readingTimeMinutes } from "@/lib/utils";
import { serviceFor } from "@/lib/project-services";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
};

export function ProjectMeta({ project }: { project: ProjectDetail }) {
  const statusLabel = project.status ? STATUS_LABEL[project.status] : undefined;
  const readMinutes = readingTimeMinutes(
    project.description,
    project.overviewBody,
    project.designApproachBody,
    project.detailBody,
  );
  const service = serviceFor(project.slug);

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
            {service && (
              <div className="col-span-2">
                <dt className="eyebrow">Service</dt>
                <dd className="mt-2 text-sm leading-relaxed">
                  <Link
                    href={service.href}
                    className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                  >
                    {service.anchor}
                  </Link>
                </dd>
              </div>
            )}
          </div>
        </dl>

        <div className="md:col-span-6 md:col-start-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow !text-mute">{readMinutes} min read</span>
            <span aria-hidden="true" className="flex-1 h-px bg-hairline" />
          </div>
          <PortableTextRenderer
            value={project.description}
            className="with-dropcap"
          />
        </div>
      </Container>
    </section>
  );
}
