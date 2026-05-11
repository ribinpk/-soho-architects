"use client";

import { AnimatePresence, motion, useMotionValue, animate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SanityImageRef } from "@/lib/types";
import { SanityImage } from "@/components/sanity/SanityImage";

export type LightboxImage = SanityImageRef & { _key?: string; alt?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
};

export function Lightbox({
  open,
  onClose,
  images,
  index,
  onIndexChange,
}: Props) {
  const goPrev = useCallback(() => {
    onIndexChange(Math.max(0, index - 1));
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(Math.min(images.length - 1, index + 1));
  }, [index, images.length, onIndexChange]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // keyboard: Esc, ←, →
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext, onClose]);

  const current = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  // pinch-to-zoom state for mobile
  const [zoomed, setZoomed] = useState(false);
  const scale = useMotionValue(1);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialDist = useRef(0);
  const initialScale = useRef(1);

  // Reset zoom when image changes or lightbox closes
  useEffect(() => {
    setZoomed(false);
    scale.set(1);
    offsetX.set(0);
    offsetY.set(0);
  }, [index, open, scale, offsetX, offsetY]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      initialDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      initialScale.current = scale.get();
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && initialDist.current > 0) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const next = Math.min(4, Math.max(1, initialScale.current * (d / initialDist.current)));
      scale.set(next);
      if (next > 1.05 && !zoomed) setZoomed(true);
      else if (next <= 1.05 && zoomed) setZoomed(false);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) {
      initialDist.current = 0;
      // Snap back to 1 if barely zoomed
      if (scale.get() < 1.08) {
        animate(scale, 1, { duration: 0.25, ease: [0.22, 0.61, 0.36, 1] });
        animate(offsetX, 0, { duration: 0.25 });
        animate(offsetY, 0, { duration: 0.25 });
        setZoomed(false);
      }
    }
  };
  const onDoubleClick = () => {
    if (scale.get() > 1.05) {
      animate(scale, 1, { duration: 0.3 });
      animate(offsetX, 0, { duration: 0.3 });
      animate(offsetY, 0, { duration: 0.3 });
      setZoomed(false);
    } else {
      animate(scale, 2, { duration: 0.3 });
      setZoomed(true);
    }
  };

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-sm flex flex-col text-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
            <span className="eyebrow !text-light/70 mix-blend-normal">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="press size-11 flex items-center justify-center -mr-2 hover:opacity-70 transition-opacity"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>

          {/* image — also tappable backdrop closes */}
          <button
            type="button"
            aria-label="Close viewer"
            onClick={onClose}
            className="flex-1 relative flex items-center justify-center px-4 pb-6 sm:pb-10 cursor-zoom-out"
          >
            <motion.div
              key={`img-${index}`}
              className="relative w-full h-full max-w-[1280px] mx-auto touch-none"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag={zoomed ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (zoomed) return;
                if (info.offset.x < -80 && hasNext) goNext();
                else if (info.offset.x > 80 && hasPrev) goPrev();
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={onDoubleClick}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ scale, x: offsetX, y: offsetY }}
            >
              <SanityImage
                image={current}
                alt={current.alt ?? ""}
                sizes="(max-width: 768px) 100vw, 1280px"
                fill
                className="object-contain pointer-events-none select-none"
              />
            </motion.div>
          </button>

          {/* arrows (desktop) */}
          {hasPrev && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 size-12 items-center justify-center rounded-full bg-light/10 hover:bg-light/20 backdrop-blur-sm transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M13 4L7 10l6 6" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 size-12 items-center justify-center rounded-full bg-light/10 hover:bg-light/20 backdrop-blur-sm transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
