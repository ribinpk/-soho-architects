import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SOHO Architects",
    short_name: "SOHO",
    description:
      "Architecture and interior design firm in Calicut (Kozhikode), Kerala.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#f5f1ea",
    theme_color: "#13110f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
