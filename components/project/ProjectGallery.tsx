import { Container } from "@/components/ui/Container";
import { SanityImage } from "@/components/sanity/SanityImage";
import { Reveal } from "@/components/ui/Reveal";
import type { SanityImageRef } from "@/lib/types";

type GalleryImage = SanityImageRef & { _key: string; alt?: string };

export function ProjectGallery({
  images,
  eyebrow = "Gallery",
}: {
  images: GalleryImage[] | undefined;
  eyebrow?: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 md:py-28 border-b border-hairline">
      <Container>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {images.map((img, i) => (
            <Reveal key={img._key} delay={(i % 2) * 0.08}>
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface">
                <SanityImage
                  image={img}
                  alt={img.alt || `Gallery image ${i + 1}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
