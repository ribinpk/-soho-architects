import { defineArrayMember, defineField, defineType } from "sanity";

export const studioPage = defineType({
  name: "studioPage",
  title: "Studio page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Studio",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "introHeadline",
      title: "Intro headline",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: "introBody",
      title: "Intro body",
      type: "portableText",
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "teamMember",
          fields: [
            { name: "name", type: "string", validation: (R) => R.required() },
            { name: "role", type: "string", validation: (R) => R.required() },
            {
              name: "headshot",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string", title: "Alt text" }],
            },
            { name: "bio", type: "portableText" },
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "headshot" },
          },
        }),
      ],
    }),
    defineField({
      name: "press",
      title: "Press & recognition",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pressItem",
          fields: [
            { name: "title", type: "string", validation: (R) => R.required() },
            { name: "source", type: "string" },
            { name: "url", type: "url" },
            { name: "year", type: "number" },
          ],
          preview: {
            select: { title: "title", subtitle: "source" },
          },
        }),
      ],
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
  preview: { prepare: () => ({ title: "Studio page" }) },
});
