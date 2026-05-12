"use client";

import { useState } from "react";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";
import { SanityImage } from "@/components/sanity/SanityImage";

type GalleryImage = LightboxImage & { _key: string };

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div
        className={
          "mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain " +
          "-mx-5 sm:-mx-8 px-5 sm:px-8 pb-2 " +
          "md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none " +
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden " +
          "[-webkit-overflow-scrolling:touch]"
        }
      >
        {images.map((img, i) => (
          <ImageReveal
            key={img._key}
            delay={(i % 2) * 0.08}
            className="snap-start shrink-0 basis-[85%] md:basis-auto md:shrink"
          >
            <figure className="flex flex-col">
              <button
                type="button"
                aria-label={`Open image ${i + 1}`}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="group relative block w-full aspect-[4/5] overflow-hidden bg-surface cursor-zoom-in"
              >
                <SanityImage
                  image={img}
                  alt={img.alt || `Gallery image ${i + 1}`}
                  sizes="(max-width: 768px) 85vw, 50vw"
                  fill
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.025]"
                />
              </button>
              {img.caption && (
                <figcaption className="mt-3 font-serif italic text-sm leading-snug text-mute max-w-[42ch]">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </ImageReveal>
        ))}
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        images={images}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
