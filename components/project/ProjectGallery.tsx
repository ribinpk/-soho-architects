import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SanityImageRef } from "@/lib/types";
import { GalleryGrid } from "./GalleryGrid";

type GalleryImage = SanityImageRef & { _key: string; alt?: string };

export function ProjectGallery({
  images,
  eyebrow = "Gallery",
  id,
}: {
  images: GalleryImage[] | undefined;
  eyebrow?: string;
  id?: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <section id={id} className="py-16 md:py-28 border-b border-hairline">
      <Container>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <GalleryGrid images={images} />
      </Container>
    </section>
  );
}
