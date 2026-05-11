"use client";

import nextDynamic from "next/dynamic";

const Studio = nextDynamic(() => import("./Studio"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-cream" />,
});

export default function StudioPage() {
  return <Studio />;
}
