"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/sanity/SanityImage";
import { Container } from "@/components/ui/Container";
import type { ProjectDetail } from "@/lib/types";

export function ProjectHero({ project }: { project: ProjectDetail }) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Two-phase render: server + first hydration paint show the sketch overlay
  // intact (y: 0). A post-mount effect flips `revealed` to start the wipe.
  // This avoids hydration mismatches that motion's auto-on-mount can trigger
  // when its initial style is serialised differently by React on SSR vs. client.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setRevealed(true);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle zoom-out as the hero scrolls past — gives the image weight on
  // arrival and "settles" it as the viewer scans down.
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  // Parallax — image moves slower than scroll, creating depth.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  // Foreground text drifts the opposite direction, slowly.
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-32%"]);
  // Hero text fades a touch as it lifts off.
  const textOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.7, 0]);

  const city = project.location?.split(",")[0]?.trim();

  return (
    <section ref={ref} className="relative">
      <div className="relative w-full h-[70dvh] md:h-[88dvh] min-h-[420px] bg-surface overflow-hidden">
        <motion.div
          style={{ scale, y: imageY }}
          className="absolute inset-0 origin-center"
        >
          {/* Photo layer — the finished image. */}
          <SanityImage
            image={project.cover}
            alt={project.cover?.alt || project.name}
            sizes="100vw"
            priority
            fill
            className="object-cover"
          />
          {/* Sketch layer — same image, stripped to a high-contrast graphite
              study. Wipes off top-down on mount to reveal the photo beneath. */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ y: revealed ? "-100%" : "0%" }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.6,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: [0.83, 0, 0.17, 1],
            }}
            className="absolute inset-0"
          >
            <SanityImage
              image={project.cover}
              alt=""
              sizes="100vw"
              priority
              fill
              className="object-cover [filter:grayscale(1)_contrast(1.6)_brightness(1.15)]"
            />
            {/* paper warmth tint on top of the sketch — sells the graphite feel */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-light/35 mix-blend-multiply"
            />
          </motion.div>
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark/65 via-dark/20 to-transparent pointer-events-none"
        />
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 h-full pointer-events-none"
        >
          <Container className="h-full flex flex-col justify-end pb-10 md:pb-16 text-light pointer-events-auto">
            <motion.span
              className="eyebrow !text-light/80"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {String(project.projectNumber).padStart(2, "0")} · {project.year}
              {city ? ` · ${city}` : ""}
            </motion.span>
            <motion.h1
              className="mt-4 font-serif text-display tracking-tight max-w-[18ch]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {project.name}
            </motion.h1>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
