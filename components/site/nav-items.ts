export const NAV_ITEMS = [
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/inquiries", label: "Inquiries" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
