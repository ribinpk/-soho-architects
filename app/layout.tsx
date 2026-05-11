import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SOHO Architects",
    template: "%s — SOHO Architects",
  },
  description:
    "SOHO Architects is an interior and architecture studio working on residential, commercial, and workspace projects.",
  openGraph: {
    siteName: "SOHO Architects",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f1ea",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SOHO Architects",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo.svg`,
  description:
    "Interior and architecture studio in Kozhikode, Kerala — residential, workplace, and hospitality projects.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Golf Link Road, Malaparamba",
    addressLocality: "Kozhikode",
    addressRegion: "Kerala",
    postalCode: "673009",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
