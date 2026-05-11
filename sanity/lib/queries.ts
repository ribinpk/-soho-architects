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
    footerCopy
  }
`);

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
  cover{ ..., "alt": coalesce(alt, "") }
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
    cover{ ..., "alt": coalesce(alt, "") },
    description,
    overviewImage{ ..., "alt": coalesce(alt, "") },
    overviewBody,
    designApproachImage{ ..., "alt": coalesce(alt, "") },
    designApproachBody,
    detailImage{ ..., "alt": coalesce(alt, "") },
    detailBody,
    gallery[]{ ..., "alt": coalesce(alt, "") },
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
      headshot{ ..., "alt": coalesce(alt, "") },
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
