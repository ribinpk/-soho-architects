"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

type Props = {
  name: string;
  params?: Record<string, unknown>;
};

export function TrackEvent({ name, params }: Props) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(name, params);
  }, [name, params]);
  return null;
}
