import { defineArrayMember, defineField, defineType } from "sanity";

export const insightPost = defineType({
  name: "insightPost",
  title: "Insight (blog post)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "datetime",
      description:
        "Set whenever the post is materially revised. Surfaces in Article schema dateModified and improves freshness signals.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Shown on the index, in social previews, and as the meta description fallback.",
      validation: (Rule) => Rule.required().min(60).max(220),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description:
        "Name as it should appear in the byline and Article schema. e.g. 'Ar. Suhail AK'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "string",
      description: "e.g. 'Co-founder & Principal Architect'.",
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time (minutes)",
      type: "number",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs (optional)",
      description:
        "Adds a FAQ section to the post and emits FAQPage JSON-LD. Skip for posts without genuine Q&A.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "q",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "a",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "relatedServices",
      title: "Related service pages",
      description:
        "Editorial cross-links to /services/* pages. Choose any that apply.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          {
            title: "Residential architects in Calicut",
            value: "/services/residential-architects-calicut",
          },
          {
            title: "Commercial architects in Calicut",
            value: "/services/commercial-architects-calicut",
          },
          {
            title: "Interior designers in Calicut",
            value: "/services/interior-designers-calicut",
          },
        ],
      },
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "title", type: "string", title: "Title override" },
        { name: "description", type: "text", rows: 3, title: "Description override" },
        { name: "ogImage", type: "image", title: "Open Graph image override" },
      ],
    }),
  ],
  orderings: [
    {
      title: "Published — newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "cover",
      date: "publishedAt",
    },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toISOString().slice(0, 10) : "";
      return {
        title,
        subtitle: [d, subtitle].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
