"use client";

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    track("web_vitals", {
      metric_id: metric.id,
      metric_name: metric.name,
      metric_value:
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      metric_rating: metric.rating,
      page_path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  });

  return null;
}
