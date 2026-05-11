import { Container } from "@/components/ui/Container";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import type { ProjectDetail } from "@/lib/types";

type Row = { label: string; value: string | undefined };

export function ProjectMeta({ project }: { project: ProjectDetail }) {
  const rows: Row[] = [
    { label: "Client", value: project.client },
    { label: "Location", value: project.location },
    {
      label: "Status",
      value:
        project.status === "completed"
          ? "Completed"
          : project.status === "ongoing"
            ? "Ongoing"
            : undefined,
    },
    { label: "Year", value: project.year ? String(project.year) : undefined },
    { label: "Built area", value: project.builtArea },
  ].filter((r): r is Row => Boolean(r.value));

  return (
    <section className="border-b border-hairline">
      <Container className="py-14 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <dl className="md:col-span-5 grid grid-cols-2 gap-y-6 gap-x-4 content-start">
          {rows.map((row) => (
            <div key={row.label} className="col-span-1">
              <dt className="eyebrow">{row.label}</dt>
              <dd className="mt-2 text-base">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="md:col-span-6 md:col-start-7">
          <PortableTextRenderer value={project.description} />
        </div>
      </Container>
    </section>
  );
}
