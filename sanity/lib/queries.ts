import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    tagline,
    logo,
    ogImage,
    contactEmail,
    contactPhone,
    address,
    social,
    testimonials,
    footerCopy
  }
`);

export const testimonialsQuery = defineQuery(`
  *[_type == "siteSettings"][0].testimonials
`);

// Reusable image projection — pulls alt with a coalesce fallback and the LQIP
// (low-quality image placeholder, base64 PNG) for next/image's blur placeholder.
const imageFields = `..., "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip`;

const projectCardProjection = `
  _id,
  name,
  "slug": slug.current,
  projectNumber,
  client,
  location,
  status,
  year,
  builtArea,
  featured,
  cover{ ${imageFields} }
`;

export const homeQuery = defineQuery(`
  {
    "featured": *[_type == "project" && featured == true] | order(projectNumber asc){
      ${projectCardProjection}
    },
    "selected": *[_type == "project"] | order(projectNumber asc)[0...6]{
      ${projectCardProjection}
    }
  }
`);

export const projectsIndexQuery = defineQuery(`
  *[_type == "project"] | order(projectNumber asc){
    ${projectCardProjection}
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    projectNumber,
    client,
    location,
    status,
    year,
    builtArea,
    cover{ ${imageFields} },
    description,
    overviewImage{ ${imageFields} },
    overviewBody,
    "overviewLayout": coalesce(overviewLayout, "standard"),
    designApproachImage{ ${imageFields} },
    designApproachBody,
    "designApproachLayout": coalesce(designApproachLayout, "standard"),
    detailImage{ ${imageFields} },
    detailBody,
    "detailLayout": coalesce(detailLayout, "standard"),
    gallery[]{ ${imageFields} },
    seo
  }
`);

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const projectNavQuery = defineQuery(`
  *[_type == "project"] | order(projectNumber asc){
    "slug": slug.current,
    name,
    projectNumber
  }
`);

export const studioPageQuery = defineQuery(`
  *[_type == "studioPage"][0]{
    introHeadline,
    introBody,
    approachHeadline,
    approachBody,
    team[]{
      name,
      role,
      headshot{ ${imageFields} },
      bio
    },
    press[]{
      title,
      source,
      url,
      year
    },
    seo
  }
`);
