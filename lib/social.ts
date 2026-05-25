/**
 * Single source of truth for the studio's social and external profiles.
 * Read by:
 *   - `lib/seo.ts` for the Organization JSON-LD `sameAs` array
 *   - `components/site/Footer.tsx` for the "Elsewhere" column
 *   - `app/(site)/studio/page.tsx` for the "Elsewhere" block alongside Press
 *
 * If a platform isn't live yet, drop the entry rather than leaving an empty
 * URL — both the schema and the UI iterate this list directly.
 */

export type SocialLink = {
  /** Platform name, capitalised. Used as the row label. */
  platform: string;
  /** Short handle/identifier shown next to the platform name. */
  handle: string;
  /** One-line description of what the studio publishes there. */
  description: string;
  /** Rough publishing cadence — Weekly / Monthly / Occasional. */
  cadence: string;
  /** Canonical profile URL. */
  url: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    handle: "@sohoarchitects",
    description: "Construction sites, sketches, and the small things.",
    cadence: "Weekly",
    url: "https://www.instagram.com/sohoarchitects/",
  },
  {
    platform: "LinkedIn",
    handle: "SOHO Architects",
    description: "Studio news, project announcements, and hires.",
    cadence: "Monthly",
    url: "https://www.linkedin.com/company/soho-architects-calicut",
  },
  {
    platform: "ArchDaily",
    handle: "Office profile",
    description: "Selected projects with full drawings and write-ups.",
    cadence: "Occasional",
    url: "https://www.archdaily.com/office/soho-architects",
  },
  {
    platform: "Facebook",
    handle: "/sohocalicut",
    description: "Studio updates, mostly for a local audience.",
    cadence: "Occasional",
    url: "https://www.facebook.com/sohocalicut/",
  },
];

export function socialSameAs(): string[] {
  return SOCIAL_LINKS.map((s) => s.url);
}
