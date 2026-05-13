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
import { TrackEvent } from "@/components/analytics/TrackEvent";
import type { ProjectDetail, ProjectNavItem } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import {
  projectBySlugQuery,
  projectNavQuery,
  projectSlugsQuery,
} from "@/sanity/lib/queries";
import { absoluteUrl, breadcrumbsJsonLd, ORG_ID } from "@/lib/seo";

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
  const city = project.location?.split(",")[0]?.trim();
  const titleLocation = city
    ? `${city}, Kerala`
    : "Calicut, Kerala";
  const defaultTitle = `${project.name} — Architect-Designed in ${titleLocation} | SOHO Architects`;
  const defaultDescription = project.location
    ? `${project.name} in ${project.location}. Designed by SOHO Architects, an architecture and interior design firm in Calicut, Kerala.`
    : `${project.name}. Designed by SOHO Architects, an architecture firm in Calicut, Kerala.`;
  const canonical = `/projects/${project.slug}`;
  return {
    title: { absolute: project.seo?.title || defaultTitle },
    description: project.seo?.description || defaultDescription,
    alternates: { canonical },
    openGraph: {
      title: project.seo?.title || `${project.name} — SOHO Architects, Calicut`,
      description: project.seo?.description || defaultDescription,
      type: "article",
      url: canonical,
      images: og
        ? [{ url: og, width: 1200, height: 630, alt: project.name }]
        : undefined,
    },
    twitter: og
      ? {
          card: "summary_large_image",
          title: project.seo?.title || `${project.name} — SOHO Architects, Calicut`,
          description: project.seo?.description || defaultDescription,
          images: [og],
        }
      : undefined,
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

  const og = ogImageUrl(project);
  const projectUrl = absoluteUrl(`/projects/${project.slug}`);

  const galleryImages = (project.gallery ?? [])
    .map((img) => {
      try {
        return urlForImage(img).width(1600).url();
      } catch {
        return null;
      }
    })
    .filter((u): u is string => Boolean(u));

  const coverImageObject = og
    ? {
        "@type": "ImageObject",
        contentUrl: og,
        url: og,
        caption: `${project.name} — ${project.location ?? "Kerala"}, designed by SOHO Architects`,
        creator: { "@id": ORG_ID },
        copyrightHolder: { "@id": ORG_ID },
      }
    : undefined;

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    url: projectUrl,
    dateCreated: project.year ? String(project.year) : undefined,
    locationCreated: project.location
      ? { "@type": "Place", name: project.location }
      : undefined,
    image: coverImageObject,
    associatedMedia: galleryImages.map((u) => ({
      "@type": "ImageObject",
      contentUrl: u,
      url: u,
      caption: `${project.name} — SOHO Architects, Calicut`,
      creator: { "@id": ORG_ID },
    })),
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.name, path: `/projects/${project.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={creativeWorkJsonLd} />
      <TrackEvent
        name="portfolio_view"
        params={{ slug: project.slug, name: project.name, location: project.location }}
      />
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
