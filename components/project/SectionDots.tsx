"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Section = { id: string; label: string };

const DEFAULT_SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "approach", label: "Approach" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
];

export function SectionDots({ sections = DEFAULT_SECTIONS }: { sections?: Section[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait one tick so sections are in the DOM.
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Active section = whichever has the largest intersection ratio in view.
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (candidates.length) {
          setActive(candidates[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    els.forEach((el) => io.observe(el));

    // Reveal once user scrolls past the hero (~window inner height).
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.nav
      aria-label="Sections"
      className="md:hidden fixed right-3 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 12 }}
      transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <ul className="flex flex-col gap-3 pointer-events-auto">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-label={`Jump to ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollTo(s.id)}
                className="press group flex items-center justify-end gap-2 h-6"
              >
                <span
                  className={`text-[10px] tracking-[0.18em] uppercase transition-opacity ${
                    isActive ? "opacity-90 text-ink" : "opacity-0"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block rounded-full bg-ink transition-all duration-300 ${
                    isActive ? "h-2.5 w-2.5 opacity-90" : "h-1.5 w-1.5 opacity-50"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
