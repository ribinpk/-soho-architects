"use client";

import NextImage from "next/image";
import type { SanityImageRef } from "@/lib/types";
import { urlForImage } from "@/sanity/lib/image";

type Props = {
  image: SanityImageRef;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * Explicit fetch-priority hint. Useful on the LCP image even when
   * `priority` is already true — Next.js 16 does NOT automatically add
   * `fetchpriority="high"` to the underlying <img>, so set this on the
   * hero/LCP candidate so browsers prioritise the download.
   */
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  fill?: boolean;
  /** Override width when not using fill. Falls back to asset metadata. */
  width?: number;
  /** Override height when not using fill. */
  height?: number;
};

function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}&q=${quality ?? 80}&auto=format&fit=max`;
}

function getDimensionsFromRef(
  ref: string | undefined,
): { width: number; height: number } | null {
  if (!ref) return null;
  const m = ref.match(/-(\d+)x(\d+)-/);
  if (!m) return null;
  return { width: Number(m[1]), height: Number(m[2]) };
}

export function SanityImage({
  image,
  alt,
  sizes,
  priority,
  fetchPriority,
  className,
  fill,
  width,
  height,
}: Props) {
  if (!image?.asset) return null;

  const baseUrl = urlForImage(image).url().split("?")[0];
  const altText = alt ?? image.alt ?? "";
  const blurProps = image.lqip
    ? { placeholder: "blur" as const, blurDataURL: image.lqip }
    : {};

  if (fill) {
    return (
      <NextImage
        src={baseUrl}
        alt={altText}
        loader={sanityLoader}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        className={className}
        {...blurProps}
      />
    );
  }

  // Resolve dimensions from the asset ref. Sanity ref format always
  // embeds dimensions (e.g. -4502x3000-), so this hits in practice. If
  // somehow it doesn't AND no explicit width/height were passed, bail
  // visibly rather than guessing a 1600x1000 placeholder that would
  // cause a layout shift when the real image loads.
  const dims = getDimensionsFromRef(image.asset._ref);
  const finalWidth = width ?? dims?.width;
  const finalHeight = height ?? dims?.height;
  if (!finalWidth || !finalHeight) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `SanityImage: unable to resolve dimensions for ${image.asset._ref}. Pass width+height props or use fill.`,
      );
    }
    return null;
  }

  return (
    <NextImage
      src={baseUrl}
      alt={altText}
      loader={sanityLoader}
      width={finalWidth}
      height={finalHeight}
      sizes={sizes}
      priority={priority}
      fetchPriority={fetchPriority}
      className={className}
      {...blurProps}
    />
  );
}
