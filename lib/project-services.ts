/**
 * Maps a project slug to the service-page link it belongs under. Used in
 * ProjectMeta to surface a "Service" link, and to give Google a per-project
 * inbound link from the project detail page to the relevant service page.
 *
 * If a slug is missing here, the project detail just won't show the link —
 * better than mis-linking. Add a new entry when adding a project.
 */

export type ServiceLink = {
  /** Label shown above the link. e.g. "Residential" */
  label: string;
  /** Anchor text. Keyword-rich. */
  anchor: string;
  /** Destination service page. */
  href: string;
};

const RESIDENTIAL: ServiceLink = {
  label: "Residential",
  anchor: "Residential architects in Calicut",
  href: "/services/residential-architects-calicut",
};

const COMMERCIAL: ServiceLink = {
  label: "Commercial · Workplace",
  anchor: "Commercial architects in Calicut",
  href: "/services/commercial-architects-calicut",
};

// Note: the studio's own building (soho-studio) is a workplace/office for
// SOHO itself — categorising under Commercial.
const PROJECT_SERVICE: Record<string, ServiceLink> = {
  "soho-studio": COMMERCIAL,
  "the-verra-house": RESIDENTIAL,
  "mathamangalam-house": RESIDENTIAL,
  "payyavoor-house": RESIDENTIAL,
  "solace-1-residence": RESIDENTIAL,
  "la-vie": RESIDENTIAL,
};

export function serviceFor(slug: string | undefined): ServiceLink | undefined {
  if (!slug) return undefined;
  return PROJECT_SERVICE[slug];
}
