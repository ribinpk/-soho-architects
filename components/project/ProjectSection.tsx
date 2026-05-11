import type { PortableTextBlock } from "@portabletext/types";
import { Container } from "@/components/ui/Container";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import { SanityImage } from "@/components/sanity/SanityImage";
import { Reveal } from "@/components/ui/Reveal";
import type { SanityImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  image?: SanityImageRef & { alt?: string };
  body?: PortableTextBlock[];
  /** Image side on desktop. Mobile is always image-first. */
  align?: "left" | "right";
};

export function ProjectSection({
  eyebrow,
  image,
  body,
  align = "left",
}: Props) {
  if (!image && (!body || body.length === 0)) return null;

  const imageOnRight = align === "right";

  return (
    <section className="py-16 md:py-28 border-b border-hairline">
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
              "mt-8 md:mt-0 md:col-span-4 md:row-start-1 md:self-center",
              imageOnRight ? "md:col-start-1" : "md:col-start-9",
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
