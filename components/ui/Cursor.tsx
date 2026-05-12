"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type State = "default" | "hover" | "view" | "text" | "image" | "scrub";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<State>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) {
        setState("default");
        return;
      }

      // Explicit `data-cursor` always wins.
      const dataMatch = t.closest?.("[data-cursor]") as HTMLElement | null;
      if (dataMatch) {
        const tag = dataMatch.dataset.cursor;
        if (tag === "view") return setState("view");
        if (tag === "scrub") return setState("scrub");
        if (tag === "text") return setState("text");
        if (tag === "image") return setState("image");
        if (tag === "hide") return setState("default");
      }

      // Then interactive elements.
      const clickable = t.closest?.(
        'a, button, [role="button"], input, textarea, select, label',
      );
      if (clickable) return setState("hover");

      // Then image elements.
      if (t.closest?.("img, picture, video")) return setState("image");

      setState("default");
    };
    const onLeave = () => setState("default");

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [x, y]);

  if (!enabled) return null;

  // Ring transform: scale + non-uniform for "text" (I-beam) and "scrub" (wide pill)
  let ringScale = 1;
  let ringScaleY = 1;
  let ringRadius = 999;
  switch (state) {
    case "view":
      ringScale = 5.5;
      break;
    case "scrub":
      ringScale = 7; // wide horizontal pill
      ringScaleY = 3;
      break;
    case "hover":
      ringScale = 2.6;
      break;
    case "image":
      ringScale = 3.5;
      break;
    case "text":
      ringScale = 0.28; // ~3px wide
      ringScaleY = 2.4; // ~28px tall
      ringRadius = 1;
      break;
    default:
      ringScale = 1;
  }

  const labelVisible = state === "view" || state === "scrub";
  const labelText = state === "scrub" ? "← drag →" : "View";

  return (
    <motion.div
      aria-hidden="true"
      className="custom-cursor"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        className="custom-cursor__ring"
        animate={{ scaleX: ringScale, scaleY: ringScaleY, borderRadius: ringRadius }}
        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <motion.span
        className="custom-cursor__label"
        animate={{ opacity: labelVisible ? 1 : 0, y: labelVisible ? 0 : 4 }}
        transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {labelText}
      </motion.span>
    </motion.div>
  );
}
