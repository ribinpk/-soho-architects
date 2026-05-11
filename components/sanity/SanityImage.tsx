"use client";

import NextImage from "next/image";
import type { SanityImageRef } from "@/lib/types";
import { urlForImage } from "@/sanity/lib/image";

type Props = {
  image: SanityImageRef;
  alt?: string;
  sizes?: string;
  priority?: boolean;
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
  className,
  fill,
  width,
  height,
}: Props) {
  if (!image?.asset) return null;

  const baseUrl = urlForImage(image).url().split("?")[0];
  const altText = alt ?? image.alt ?? "";

  if (fill) {
    return (
      <NextImage
        src={baseUrl}
        alt={altText}
        loader={sanityLoader}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  const dims = getDimensionsFromRef(image.asset._ref);
  return (
    <NextImage
      src={baseUrl}
      alt={altText}
      loader={sanityLoader}
      width={width ?? dims?.width ?? 1600}
      height={height ?? dims?.height ?? 1000}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
