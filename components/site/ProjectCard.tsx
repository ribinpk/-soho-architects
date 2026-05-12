import Link from "next/link";
import type { ProjectCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SanityImage } from "@/components/sanity/SanityImage";
import { ImageReveal } from "@/components/ui/ImageReveal";

type Variant = "default" | "feature" | "compact";

const ratioByVariant: Record<Variant, string> = {
  default: "aspect-[4/5]",
  feature: "aspect-[5/4] md:aspect-[16/10]",
  compact: "aspect-[3/4]",
};

const sizesByVariant: Record<Variant, string> = {
  default: "(max-width: 768px) 100vw, 50vw",
  feature: "(max-width: 768px) 100vw, 100vw",
  compact: "(max-width: 768px) 50vw, 33vw",
};

export function ProjectCard({
  project,
  variant = "default",
  priority,
  className,
  caption,
}: {
  project: ProjectCardData;
  variant?: Variant;
  priority?: boolean;
  className?: string;
  /** Optional one-line editorial caption rendered beneath the title. */
  caption?: string;
}) {
  const city = project.location?.split(",")[0]?.trim();

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="view"
      className={cn("press group block", className)}
    >
      <ImageReveal
        className={cn(
          "relative w-full overflow-hidden bg-surface",
          ratioByVariant[variant],
        )}
      >
        <SanityImage
          image={project.cover}
          alt={project.cover?.alt || project.name}
          sizes={sizesByVariant[variant]}
          priority={priority}
          fill
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.025]"
        />
      </ImageReveal>

      <div className="mt-4 md:mt-5">
        <p className="eyebrow transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1">
          {String(project.projectNumber).padStart(2, "0")} · {project.year}
          {city && <span className="text-mute-soft"> · {city}</span>}
        </p>
        <h3
          className="mt-2 font-serif text-[28px] sm:text-3xl md:text-3xl tracking-tight leading-[1.1] group-hover:text-mute transition-colors"
          aria-label={project.name}
        >
          {project.name.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-translate-y-[3px]"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </h3>
        {caption && (
          <p className="mt-3 text-sm leading-relaxed text-mute max-w-[36ch]">
            {caption}
          </p>
        )}
      </div>
    </Link>
  );
}
