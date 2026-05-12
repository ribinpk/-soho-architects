import type { PortableTextBlock } from "@portabletext/types";

export type SanityImageRef = {
  _type: "image";
  alt?: string;
  /** Editorial caption rendered under the image (gallery, lightbox). */
  caption?: string;
  /** Base64-encoded low-quality image placeholder from Sanity asset.metadata.lqip. */
  lqip?: string;
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type ProjectStatus = "completed" | "ongoing";

export type SectionLayout = "standard" | "full-bleed" | "stacked";

export type ProjectCardData = {
  _id: string;
  name: string;
  slug: string;
  projectNumber: number;
  client?: string;
  location: string;
  status: ProjectStatus;
  year: number;
  builtArea?: string;
  featured?: boolean;
  cover: SanityImageRef & { alt: string };
};

export type ProjectDetail = ProjectCardData & {
  description?: PortableTextBlock[];
  overviewImage?: SanityImageRef & { alt: string };
  overviewBody?: PortableTextBlock[];
  overviewLayout?: SectionLayout;
  designApproachImage?: SanityImageRef & { alt: string };
  designApproachBody?: PortableTextBlock[];
  designApproachLayout?: SectionLayout;
  detailImage?: SanityImageRef & { alt: string };
  detailBody?: PortableTextBlock[];
  detailLayout?: SectionLayout;
  gallery?: Array<SanityImageRef & { _key: string; alt: string }>;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: SanityImageRef;
  };
};

export type ProjectNavItem = {
  slug: string;
  name: string;
  projectNumber: number;
};

export type StudioPageData = {
  introHeadline: string;
  introBody?: PortableTextBlock[];
  approachHeadline?: string;
  approachBody?: PortableTextBlock[];
  team?: Array<{
    name: string;
    role: string;
    headshot?: SanityImageRef & { alt: string };
    bio?: PortableTextBlock[];
  }>;
  press?: Array<{
    title: string;
    source?: string;
    url?: string;
    year?: number;
  }>;
  seo?: { title?: string; description?: string; ogImage?: SanityImageRef };
};

export type SocialLink = { label: string; url: string };

export type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  project?: string;
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  tagline?: string;
  logo?: SanityImageRef;
  ogImage?: SanityImageRef;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  social?: SocialLink[];
  testimonials?: TestimonialItem[];
  footerCopy?: PortableTextBlock[];
};
