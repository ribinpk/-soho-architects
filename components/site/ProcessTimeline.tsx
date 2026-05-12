"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

export type ProcessStep = {
  title: string;
  detail: string;
};

const DEFAULT_STEPS: ProcessStep[] = [
  { title: "Brief", detail: "A long, unhurried conversation. We listen for what isn't said." },
  { title: "Site study", detail: "Light, terrain, monsoon, neighbours, sound. We read the land before we draw." },
  { title: "Schemes", detail: "Two or three ideas, drawn by hand, defended in plan and section." },
  { title: "Drawings", detail: "Every joint resolved on paper before it leaves the studio." },
  { title: "Build", detail: "Weekly site visits. The drawings adapt to what the site teaches us." },
  { title: "Handover", detail: "We leave with the keys. We stay reachable for a long time after." },
];

type Props = {
  eyebrow?: string;
  headline?: string;
  steps?: ProcessStep[];
};

export function ProcessTimeline({
  eyebrow = "How we work",
  headline = "Six phases. One unhurried arc.",
  steps = DEFAULT_STEPS,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section className="py-20 md:py-32 border-b border-hairline">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-4">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[14ch]">
              {headline}
            </h2>
          </div>
          <div ref={ref} className="md:col-span-8 relative">
            {/* Desktop / tablet: horizontal SVG line drawn on scroll */}
            <svg
              className="hidden md:block absolute left-0 right-0 top-[68px] w-full h-px text-hairline"
              viewBox="0 0 800 8"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d="M 0 4 Q 200 0 400 4 T 800 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: inView ? 1 : 0 }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>

            <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-8 relative">
              {steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                  }
                  transition={{
                    delay: 0.45 + i * 0.12,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  <div className="flex items-baseline gap-3">
                    {/* Node dot on the timeline (desktop) */}
                    <span
                      aria-hidden="true"
                      className="hidden md:block absolute left-0 top-[64px] w-1.5 h-1.5 rounded-full bg-ink"
                    />
                    <span className="eyebrow !text-mute tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl md:text-[1.7rem] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute max-w-[28ch]">
                    {step.detail}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
