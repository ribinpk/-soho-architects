import { clsx, type ClassValue } from "clsx";
import type { PortableTextBlock } from "@portabletext/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BlockWithChildren = {
  _type: "block";
  children?: Array<{ text?: string }>;
};

function blocksToText(blocks?: PortableTextBlock[]): string {
  if (!blocks) return "";
  return blocks
    .filter((b): b is PortableTextBlock & BlockWithChildren =>
      b._type === "block" && Array.isArray((b as BlockWithChildren).children),
    )
    .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ""))
    .join(" ");
}

/**
 * Estimated reading time in minutes (rounded up to a minimum of 1) for one or
 * more PortableText body fields. Assumes 200 wpm.
 */
export function readingTimeMinutes(
  ...sources: Array<PortableTextBlock[] | undefined>
): number {
  const combined = sources.map(blocksToText).join(" ").trim();
  if (!combined) return 1;
  const words = combined.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
