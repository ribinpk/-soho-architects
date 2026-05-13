import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryCta } from "@/components/site/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { InsightCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { insightsIndexQuery } from "@/sanity/lib/queries";
import { absoluteUrl, breadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Insights — Architecture & Design in Calicut, Kerala",
  },
  description:
    "Notes on architecture, interiors, and building in Kerala — from the studio at SOHO Architects, Calicut.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights — SOHO Architects, Calicut",
    description:
      "Notes on architecture, interiors, and building in Kerala — from SOHO Architects, Calicut.",
    url: "/insights",
  },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function InsightsIndexPage() {
  const posts = await sanityFetch<InsightCardData[]>(insightsIndexQuery, {
    tags: ["insights"],
  });

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SOHO Architects — Insights",
    url: absoluteUrl("/insights"),
    description:
      "Notes on architecture, interiors, and building in Kerala — from SOHO Architects, Calicut.",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/insights/${p.slug}`),
      datePublished: p.publishedAt,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collectionJsonLd} />

      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Insights · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-headline max-w-[20ch]">
              Notes on architecture and building in Kerala.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-mute">
              Long-form writing from the studio — practical, occasionally
              opinionated. Written by the partners at SOHO Architects in
              Calicut for anyone planning to design or build in Kerala.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container>
          {posts.length === 0 ? (
            <div className="py-24 text-center text-mute">
              <p className="font-serif text-2xl">No posts yet.</p>
              <p className="mt-2 text-sm">
                Add the first post through the studio at /admin.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-16 md:gap-y-20">
              {posts.map((post, i) => (
                <Reveal key={post._id} delay={(i % 2) * 0.06}>
                  <li>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="press group block"
                      data-cursor="view"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                        <SanityImage
                          image={post.cover}
                          alt={post.cover?.alt || post.title}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          fill
                          priority={i < 2}
                          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="mt-5">
                        <span className="eyebrow !text-mute">
                          {formatDate(post.publishedAt)}
                          {post.readingMinutes
                            ? ` · ${post.readingMinutes} min read`
                            : ""}
                        </span>
                        <h2 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-body-lg text-mute max-w-[44ch]">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 inline-block text-sm text-mute">
                          {post.author} →
                        </span>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <InquiryCta />
    </>
  );
}
