import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  insightsIndexQuery,
  projectSlugsQuery,
} from "@/sanity/lib/queries";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/services/residential-architects-calicut",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/services/commercial-architects-calicut",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/services/interior-designers-calicut",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { path: "/studio", changeFrequency: "monthly", priority: 0.8 },
  { path: "/insights", changeFrequency: "weekly", priority: 0.8 },
  { path: "/inquiries", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const now = new Date();

  let projectSlugs: { slug: string }[] = [];
  let insightPosts: { slug: string; publishedAt?: string; updatedAt?: string }[] = [];
  try {
    [projectSlugs, insightPosts] = await Promise.all([
      sanityFetch<{ slug: string }[]>(projectSlugsQuery),
      sanityFetch<{ slug: string; publishedAt?: string; updatedAt?: string }[]>(
        insightsIndexQuery,
      ),
    ]);
  } catch {
    /* no-op — sitemap still ships static routes */
  }

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...projectSlugs.map(({ slug }) => ({
      url: `${base}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...insightPosts.map(({ slug, publishedAt, updatedAt }) => ({
      url: `${base}/insights/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : publishedAt ? new Date(publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
