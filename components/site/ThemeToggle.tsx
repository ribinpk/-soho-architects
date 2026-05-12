"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

type Pulse = { id: number; x: number; y: number; to: Theme };

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (!prefersReducedMotion) {
      setPulse({
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        to: next,
      });
    }
    const html = document.documentElement;
    // Disable color transitions during the swap so the browser commits the new
    // var() values immediately (a known quirk: var() updates can get stuck on
    // mid-transition values otherwise). Re-enable on the next frame.
    html.classList.add("no-theme-transition");
    html.setAttribute("data-theme", next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.classList.remove("no-theme-transition");
      });
    });
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <AnimatePresence>
        {pulse && (
          <motion.div
            key={pulse.id}
            aria-hidden="true"
            className="fixed pointer-events-none z-[55] rounded-full mix-blend-screen"
            style={{
              left: pulse.x,
              top: pulse.y,
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              background:
                pulse.to === "light"
                  ? "radial-gradient(circle, rgba(255,180,90,0.55), rgba(255,180,90,0) 70%)"
                  : "radial-gradient(circle, rgba(120,140,210,0.55), rgba(120,140,210,0) 70%)",
            }}
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setPulse(null)}
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggle}
      aria-label={
        mounted
          ? theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      title={
        mounted
          ? theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
          : undefined
      }
        className={cn(
          "press relative size-11 flex items-center justify-center text-ink hover:text-mute",
          className,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, rotate: -30, scale: 0.85 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.85 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      </button>
    </>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.2" />
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M10 2.2v1.6" />
        <path d="M10 16.2v1.6" />
        <path d="M2.2 10h1.6" />
        <path d="M16.2 10h1.6" />
        <path d="M4.6 4.6l1.13 1.13" />
        <path d="M14.27 14.27l1.13 1.13" />
        <path d="M4.6 15.4l1.13-1.13" />
        <path d="M14.27 5.73l1.13-1.13" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.5 12.4A6.6 6.6 0 0 1 7.6 3.5a6.6 6.6 0 1 0 8.9 8.9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
