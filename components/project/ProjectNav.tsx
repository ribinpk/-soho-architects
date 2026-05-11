import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { ProjectNavItem } from "@/lib/types";

export function ProjectNav({
  prev,
  next,
}: {
  prev?: ProjectNavItem;
  next?: ProjectNavItem;
}) {
  if (!prev && !next) return null;

  return (
    <section className="py-14 md:py-20 border-b border-hairline">
      <Container className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group inline-flex flex-col items-start gap-1.5"
            >
              <span className="eyebrow">← Previous</span>
              <span className="font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                {prev.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <div className="flex-1 min-w-0 text-right">
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group inline-flex flex-col items-end gap-1.5"
            >
              <span className="eyebrow">Next →</span>
              <span className="font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                {next.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Container>
    </section>
  );
}
