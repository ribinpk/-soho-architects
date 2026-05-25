import { STUDIO_ADDRESS, STUDIO_EMAIL, STUDIO_PHONES } from "@/lib/contact";
import { socialSameAs } from "@/lib/social";

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://sohoarchitects.in"
  );
}

export function absoluteUrl(path: string): string {
  const base = siteUrl();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

export const ORG_ID = `${siteUrl()}/#organization`;

type Crumb = { name: string; path: string };

export function breadcrumbsJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function serviceJsonLd(args: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    serviceType: args.serviceType,
    url: absoluteUrl(args.path),
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/inquiries"),
      servicePhone: STUDIO_PHONES[0].tel,
    },
  };
}

export const AREA_SERVED = [
  { "@type": "City", name: "Kozhikode" },
  { "@type": "City", name: "Calicut" },
  { "@type": "City", name: "Malappuram" },
  { "@type": "City", name: "Kannur" },
  { "@type": "City", name: "Wayanad" },
  { "@type": "City", name: "Thrissur" },
  { "@type": "City", name: "Kochi" },
  { "@type": "AdministrativeArea", name: "Kerala" },
];

// Studio coordinates — verified against the Google Business Profile pin.
// Keep these in sync if the GBP pin is ever moved; mismatch causes Google
// to treat the schema and GBP listings as different entities.
const STUDIO_GEO = {
  latitude: 11.284083132795944,
  longitude: 75.80019086820452,
};

export function professionalServiceJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: STUDIO_ADDRESS.name,
    alternateName: "SOHO Architects, Calicut",
    url: base,
    logo: {
      "@type": "ImageObject",
      url: `${base}/brand/logo.png`,
    },
    image: `${base}/brand/logo.png`,
    description:
      "An architecture and interior design firm in Calicut (Kozhikode), Kerala. Houses, workplaces, and interiors — founder-led since 2011.",
    telephone: STUDIO_PHONES[0].tel,
    email: STUDIO_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO_ADDRESS.street,
      addressLocality: "Kozhikode",
      addressRegion: "Kerala",
      postalCode: "673009",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STUDIO_GEO.latitude,
      longitude: STUDIO_GEO.longitude,
    },
    hasMap: process.env.NEXT_PUBLIC_GBP_MAP_URL,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    priceRange: process.env.NEXT_PUBLIC_PRICE_RANGE || "₹₹₹",
    areaServed: AREA_SERVED,
    founder: [
      {
        "@type": "Person",
        name: "Suhail AK",
        jobTitle: "Co-founder & Principal Architect",
      },
      {
        "@type": "Person",
        name: "Varun Gopal",
        jobTitle: "Co-founder & Principal Architect",
      },
    ],
    foundingDate: "2011",
    foundingLocation: { "@type": "Place", name: "Kozhikode, Kerala" },
    knowsAbout: [
      "Residential architecture",
      "Commercial architecture",
      "Interior design",
      "Hospitality design",
      "Heritage and adaptive reuse",
      "Climate-responsive design for Kerala",
    ],
    sameAs: socialSameAs(),
  };
}
