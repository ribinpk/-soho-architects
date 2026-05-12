import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
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
    "An architecture and interiors practice on the Malabar coast. Houses, workplaces, and quiet rooms — built slowly, drawn by hand where it matters.",
  openGraph: {
    siteName: "SOHO Architects",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#13110f" },
  ],
};

// Inline script that runs BEFORE hydration: reads stored theme, falls back to
// dark default. Prevents flash of wrong theme. Class "no-theme-transition" is
// added during initial apply so the 240ms color transition doesn't fire on
// first paint, then removed on next frame.
const themeBootstrap = `
(function(){
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    var html = document.documentElement;
    html.classList.add("no-theme-transition");
    html.setAttribute("data-theme", theme);
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        html.classList.remove("no-theme-transition");
      });
    });
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SOHO Architects",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo.svg`,
  description:
    "An architecture and interiors practice in Kozhikode, Kerala — homes, workplaces, hospitality, interiors, and heritage projects.",
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
      data-theme="dark"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
