"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackPageView } from "@/lib/analytics";

export function EventTracker() {
  const pathname = usePathname();

  // Delegated click tracking for any [data-event] element anywhere on the page.
  // Place data-event="phone_click" / "whatsapp_click" / "email_click" /
  // "brochure_download" on the trigger and the listener handles the rest.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const el = t.closest<HTMLElement>("[data-event]");
      if (!el) return;
      const event = el.getAttribute("data-event");
      if (!event) return;
      const source = el.getAttribute("data-event-source") || undefined;
      const value = el.getAttribute("data-event-value") || undefined;
      track(event, {
        source,
        value,
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // SPA route-change page views for GA4 standalone setups. GTM handles this
  // via its own History Change trigger when configured, so this is harmless
  // either way.
  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
