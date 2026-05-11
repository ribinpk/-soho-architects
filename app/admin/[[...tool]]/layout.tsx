import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Studio — SOHO Architects",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f1ea",
};

export const dynamic = "force-static";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
