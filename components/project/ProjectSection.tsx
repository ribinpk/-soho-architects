import type { PortableTextBlock } from "@portabletext/types";
import { Container } from "@/components/ui/Container";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { SanityImage } from "@/components/sanity/SanityImage";
import { Reveal } from "@/components/ui/Reveal";
import type { SanityImageRef, SectionLayout } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  eyebrow: string;
  image?: SanityImageRef & { alt?: string };
  body?: PortableTextBlock[];
  /** Image side on desktop for the `standard` variant. */
  align?: "left" | "right";
  variant?: SectionLayout;
};

export function ProjectSection({
  id,
  eyebrow,
  image,
  body,
  align = "left",
  variant = "standard",
}: Props) {
  if (!image && (!body || body.length === 0)) return null;

  if (variant === "full-bleed") {
    return (
      <section id={id} className="py-16 md:py-28 border-b border-hairline">
        {image && (
          <Reveal>
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[21/9] overflow-hidden bg-surface">
              <SanityImage
                image={image}
                alt={image.alt || eyebrow}
                sizes="100vw"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
        {body && body.length > 0 && (
          <Container className="mt-12 md:mt-16">
            <Reveal delay={0.08} className="md:max-w-[58ch] md:mx-auto">
              <span className="eyebrow">{eyebrow}</span>
              <div className="mt-5">
                <PortableTextRenderer value={body} />
              </div>
            </Reveal>
          </Container>
        )}
      </section>
    );
  }

  if (variant === "stacked") {
    return (
      <section id={id} className="py-16 md:py-28 border-b border-hairline">
        <Container>
          {image && (
            <Reveal className="md:max-w-[78%] md:mx-auto">
              <div className="relative w-full aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-surface">
                <SanityImage
                  image={image}
                  alt={image.alt || eyebrow}
                  sizes="(max-width: 768px) 100vw, 78vw"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.08} className="mt-10 md:mt-14 md:max-w-[58ch] md:mx-auto text-center">
            <span className="eyebrow">{eyebrow}</span>
            <div className="mt-5 text-left">
              <PortableTextRenderer value={body} />
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  // standard
  const imageOnRight = align === "right";
  return (
    <section id={id} className="py-16 md:py-28 border-b border-hairline">
      <Container>
        <div className="md:grid md:grid-cols-12 md:gap-x-10 lg:gap-x-16">
          {image && (
            <Reveal
              className={cn(
                "md:col-span-7",
                imageOnRight ? "md:col-start-6" : "md:col-start-1",
              )}
            >
              <div className="relative w-full aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-surface">
                <SanityImage
                  image={image}
                  alt={image.alt || eyebrow}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
          <Reveal
            delay={0.08}
            className={cn(
              "mt-8 md:mt-0 md:col-span-5 md:row-start-1 md:self-center",
              imageOnRight ? "md:col-start-1" : "md:col-start-8",
            )}
          >
            <span className="eyebrow">{eyebrow}</span>
            <div className="mt-5">
              <PortableTextRenderer value={body} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
