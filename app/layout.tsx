import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics, GtmNoScript } from "@/components/analytics/Analytics";
import { professionalServiceJsonLd } from "@/lib/seo";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sohoarchitects.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Architects in Calicut (Kozhikode), Kerala — SOHO Architects",
    template: "%s | SOHO Architects, Calicut",
  },
  description:
    "SOHO Architects — an architecture and interior design firm in Calicut (Kozhikode), Kerala. Founder-led residential, commercial, and interior projects across Malabar since 2011.",
  alternates: { canonical: "/" },
  applicationName: "SOHO Architects",
  keywords: [
    "architects in Calicut",
    "architects in Kozhikode",
    "architecture firm Calicut",
    "interior designers Calicut",
    "residential architects Kerala",
    "SOHO Architects",
  ],
  openGraph: {
    siteName: "SOHO Architects",
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "Architects in Calicut (Kozhikode), Kerala — SOHO Architects",
    description:
      "Architecture and interior design firm in Calicut (Kozhikode), Kerala. Houses, workplaces, and quiet rooms — built slowly, drawn by hand where it matters.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architects in Calicut (Kozhikode), Kerala — SOHO Architects",
    description:
      "Architecture and interior design firm in Calicut (Kozhikode), Kerala. Founder-led, climate-responsive, working across Kerala since 2011.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
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
        <JsonLd data={professionalServiceJsonLd()} />
        <Analytics />
        <GtmNoScript />
        {children}
      </body>
    </html>
  );
}
