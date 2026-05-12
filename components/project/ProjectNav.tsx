"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import type { ProjectNavItem } from "@/lib/types";

export function ProjectNav({
  prev,
  next,
}: {
  prev?: ProjectNavItem;
  next?: ProjectNavItem;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!prev && !next) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

      // Ignore when typing
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (e.key === "ArrowLeft" && prev) {
        router.push(`/projects/${prev.slug}`);
      } else if (e.key === "ArrowRight" && next) {
        router.push(`/projects/${next.slug}`);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  if (!prev && !next) return null;

  return (
    <section className="py-14 md:py-20 border-b border-hairline">
      <Container>
        <div className="hidden md:flex justify-center mb-8 text-xs text-mute tracking-[0.18em] uppercase select-none">
          <span className="inline-flex items-center gap-2">
            <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 border border-hairline font-sans">
              ←
            </kbd>
            <span>/</span>
            <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 border border-hairline font-sans">
              →
            </kbd>
            <span className="ml-1">to navigate</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group inline-flex flex-col items-start gap-1.5"
              >
                <span className="eyebrow">← Previous</span>
                <span className="font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  {prev.name}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div className="flex-1 min-w-0 text-right">
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group inline-flex flex-col items-end gap-1.5"
              >
                <span className="eyebrow">Next →</span>
                <span className="font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  {next.name}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
