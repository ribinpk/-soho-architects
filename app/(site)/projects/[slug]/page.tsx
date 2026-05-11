import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectMeta } from "@/components/project/ProjectMeta";
import { ProjectNav } from "@/components/project/ProjectNav";
import { ProjectSection } from "@/components/project/ProjectSection";
import { SectionDots } from "@/components/project/SectionDots";
import { StickyInquireCta } from "@/components/project/StickyInquireCta";
import { InquiryCta } from "@/components/site/InquiryCta";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ProjectDetail, ProjectNavItem } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import {
  projectBySlugQuery,
  projectNavQuery,
  projectSlugsQuery,
} from "@/sanity/lib/queries";

function ogImageUrl(project: ProjectDetail): string | undefined {
  if (!project.cover?.asset) return undefined;
  try {
    return urlForImage(project.cover).width(1200).height(630).fit("crop").url();
  } catch {
    return undefined;
  }
}

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>(projectSlugsQuery);
    return slugs.filter((s) => Boolean(s.slug)).map((s) => ({ slug: s.slug }));
  } catch (err) {
    console.warn("generateStaticParams: Sanity fetch failed, skipping prerender", err);
    return [];
  }
}

async function getProject(slug: string) {
  return sanityFetch<ProjectDetail | null>(projectBySlugQuery, {
    params: { slug },
    tags: [`project:${slug}`],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const og = ogImageUrl(project);
  return {
    title: project.seo?.title || project.name,
    description:
      project.seo?.description ||
      `${project.name} — ${project.location}. Designed by SOHO Architects.`,
    openGraph: {
      title: project.name,
      type: "article",
      images: og
        ? [{ url: og, width: 1200, height: 630, alt: project.name }]
        : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [project, nav] = await Promise.all([
    getProject(slug),
    sanityFetch<ProjectNavItem[]>(projectNavQuery),
  ]);

  if (!project) notFound();

  const i = nav.findIndex((p) => p.slug === slug);
  const prev = i > 0 ? nav[i - 1] : undefined;
  const next = i >= 0 && i < nav.length - 1 ? nav[i + 1] : undefined;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const og = ogImageUrl(project);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    url: `${siteUrl}/projects/${project.slug}`,
    dateCreated: project.year ? String(project.year) : undefined,
    locationCreated: project.location
      ? { "@type": "Place", name: project.location }
      : undefined,
    image: og,
    creator: { "@type": "Organization", name: "SOHO Architects" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ScrollProgress />
      <ProjectHero project={project} />
      <ProjectMeta project={project} />
      <ProjectSection
        id="overview"
        eyebrow="Overview"
        image={project.overviewImage}
        body={project.overviewBody}
        align="left"
        variant={project.overviewLayout}
      />
      <ProjectSection
        id="approach"
        eyebrow="Design Approach"
        image={project.designApproachImage}
        body={project.designApproachBody}
        align="right"
        variant={project.designApproachLayout}
      />
      <ProjectSection
        id="details"
        eyebrow="Details"
        image={project.detailImage}
        body={project.detailBody}
        align="left"
        variant={project.detailLayout}
      />
      <ProjectGallery id="gallery" images={project.gallery} />
      <ProjectNav prev={prev} next={next} />
      <InquiryCta />
      <StickyInquireCta />
      <SectionDots />
    </>
  );
}
