"use client";

type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params?: EventParams) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params || {});
    window.dataLayer?.push({ event, ...(params || {}) });
  } catch {
    /* analytics failures must never break the app */
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  try {
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    if (window.gtag && id) {
      window.gtag("config", id, { page_path: path });
    }
    window.dataLayer?.push({ event: "page_view", page_path: path });
  } catch {
    /* no-op */
  }
}
