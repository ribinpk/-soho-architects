import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryCta } from "@/components/site/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { SanityImage } from "@/components/sanity/SanityImage";
import { PortableTextRenderer } from "@/components/sanity/PortableText";
import type { InsightDetail } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import {
  insightBySlugQuery,
  insightSlugsQuery,
} from "@/sanity/lib/queries";
import {
  absoluteUrl,
  breadcrumbsJsonLd,
  faqPageJsonLd,
  ORG_ID,
} from "@/lib/seo";

export const revalidate = 60;

type Params = { slug: string };

const SERVICE_LABELS: Record<string, string> = {
  "/services/residential-architects-calicut":
    "Residential architects in Calicut",
  "/services/commercial-architects-calicut":
    "Commercial architects in Calicut",
  "/services/interior-designers-calicut": "Interior designers in Calicut",
};

function ogImageUrl(post: InsightDetail): string | undefined {
  if (!post.cover?.asset) return undefined;
  try {
    return urlForImage(post.cover).width(1200).height(630).fit("crop").url();
  } catch {
    return undefined;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>(insightSlugsQuery);
    return slugs.filter((s) => Boolean(s.slug)).map((s) => ({ slug: s.slug }));
  } catch (err) {
    console.warn(
      "insights generateStaticParams: Sanity fetch failed, skipping prerender",
      err,
    );
    return [];
  }
}

async function getPost(slug: string) {
  return sanityFetch<InsightDetail | null>(insightBySlugQuery, {
    params: { slug },
    tags: [`insight:${slug}`],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const og = ogImageUrl(post);
  const canonical = `/insights/${post.slug}`;
  return {
    title: { absolute: post.seo?.title || `${post.title} | SOHO Architects` },
    description: post.seo?.description || post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      type: "article",
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: og
        ? [{ url: og, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: og
      ? {
          card: "summary_large_image",
          title: post.seo?.title || post.title,
          description: post.seo?.description || post.excerpt,
          images: [og],
        }
      : undefined,
  };
}

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

export default async function InsightPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const og = ogImageUrl(post);
  const postUrl = absoluteUrl(`/insights/${post.slug}`);

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: og,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      worksFor: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleJsonLd} />
      {post.faqs && post.faqs.length > 0 && (
        <JsonLd data={faqPageJsonLd(post.faqs)} />
      )}

      <article>
        <section className="pt-32 md:pt-40 pb-12 md:pb-16 border-b border-hairline">
          <Container>
            <Reveal>
              <nav className="text-sm text-mute mb-8" aria-label="Breadcrumb">
                <Link href="/insights" className="press hover:text-ink transition-colors">
                  ← All insights
                </Link>
              </nav>
              <span className="eyebrow">
                Insight · {formatDate(post.publishedAt)}
                {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
              </span>
              <h1 className="mt-6 font-serif text-display tracking-tight max-w-[20ch]">
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-mute leading-relaxed">
                {post.excerpt}
              </p>
              <p className="mt-8 text-sm text-mute">
                By {post.author}
                {post.authorRole ? ` · ${post.authorRole}` : ""}
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-surface">
          <SanityImage
            image={post.cover}
            alt={post.cover?.alt || post.title}
            sizes="100vw"
            fill
            priority
            className="object-cover"
          />
        </section>

        <section className="py-16 md:py-24 border-b border-hairline">
          <Container>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-8 md:col-start-3">
                <Reveal>
                  <div className="prose-insight space-y-5 text-body-lg leading-relaxed">
                    <PortableTextRenderer value={post.body} />
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {post.faqs && post.faqs.length > 0 && (
          <section className="py-16 md:py-24 border-b border-hairline">
            <Container>
              <div className="md:grid md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <Reveal>
                    <span className="eyebrow">FAQ</span>
                    <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[14ch]">
                      Common questions on this topic.
                    </h2>
                  </Reveal>
                </div>
                <div className="md:col-span-8">
                  <dl className="border-t border-hairline">
                    {post.faqs.map((item, i) => (
                      <Reveal key={item.q} delay={(i % 3) * 0.05}>
                        <div className="border-b border-hairline py-7 md:py-8">
                          <dt className="font-serif text-2xl md:text-[1.7rem] tracking-tight">
                            {item.q}
                          </dt>
                          <dd className="mt-3 text-body-lg text-mute leading-relaxed max-w-[60ch]">
                            {item.a}
                          </dd>
                        </div>
                      </Reveal>
                    ))}
                  </dl>
                </div>
              </div>
            </Container>
          </section>
        )}

        {(post.relatedProjects?.length || post.relatedServices?.length) ? (
          <section className="py-16 md:py-24 border-b border-hairline">
            <Container>
              <Reveal>
                <span className="eyebrow">Related</span>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {post.relatedProjects?.map((p, i) => (
                  <Reveal key={p._id} delay={(i % 2) * 0.06}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="press group block"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                        <SanityImage
                          image={p.cover}
                          alt={p.cover?.alt || p.name}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          fill
                          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
                        />
                      </div>
                      <h3 className="mt-4 font-serif text-2xl tracking-tight">
                        {p.name}
                        <span aria-hidden="true" className="ml-2 text-mute">
                          →
                        </span>
                      </h3>
                      {p.location && (
                        <p className="mt-1 text-sm text-mute">{p.location}</p>
                      )}
                    </Link>
                  </Reveal>
                ))}
                {post.relatedServices?.map((href, i) => (
                  <Reveal
                    key={href}
                    delay={((i + (post.relatedProjects?.length ?? 0)) % 2) * 0.06}
                  >
                    <Link
                      href={href}
                      className="press block border border-hairline p-6 md:p-8 hover:bg-paper transition-colors"
                    >
                      <span className="eyebrow">Service</span>
                      <h3 className="mt-3 font-serif text-2xl tracking-tight">
                        {SERVICE_LABELS[href] ?? href}
                        <span aria-hidden="true" className="ml-2 text-mute">
                          →
                        </span>
                      </h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        ) : null}
      </article>

      <InquiryCta />
    </>
  );
}
