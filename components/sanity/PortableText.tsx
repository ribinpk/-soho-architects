import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SanityImage } from "./SanityImage";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="my-5 first:mt-0 last:mb-0 whitespace-pre-line text-body-lg leading-relaxed text-ink-soft">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 font-serif text-title">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 font-serif text-subtitle">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 border-l-2 border-hairline font-serif italic text-mute">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="underline decoration-1 underline-offset-2 hover:text-mute transition-colors"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: SanityImageRef & { alt?: string; caption?: string };
    }) => (
      <figure className="my-10 md:my-14 -mx-5 sm:mx-0">
        <SanityImage
          image={value}
          alt={value?.alt ?? ""}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 960px"
          className="w-full h-auto"
        />
        {value?.caption && (
          <figcaption className="mt-3 px-5 sm:px-0 text-xs text-mute">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export function PortableTextRenderer({
  value,
  className,
}: {
  value: PortableTextBlock[] | undefined | null;
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={cn("text-ink-soft", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
