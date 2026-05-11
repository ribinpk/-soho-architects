import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectNumber",
      title: "Project number",
      description: "Used for default ordering on the Projects index.",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "featured",
      title: "Featured on home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Ongoing", value: "ongoing" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: "builtArea",
      title: "Total built area",
      description: "Free text — e.g. \"2140 ft²\" or \"199 m²\".",
      type: "string",
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
      name: "description",
      title: "Short description",
      type: "portableText",
    }),
    defineField({
      name: "overviewImage",
      title: "Overview — image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "overviewBody",
      title: "Overview — body",
      type: "portableText",
    }),
    defineField({
      name: "designApproachImage",
      title: "Design approach — image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "designApproachBody",
      title: "Design approach — body",
      type: "portableText",
    }),
    defineField({
      name: "detailImage",
      title: "Details — image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "detailBody",
      title: "Details — body",
      type: "portableText",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
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
  orderings: [
    {
      title: "Project number",
      name: "projectNumberAsc",
      by: [{ field: "projectNumber", direction: "asc" }],
    },
    {
      title: "Newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "location",
      media: "cover",
      number: "projectNumber",
    },
    prepare({ title, subtitle, media, number }) {
      return {
        title: number ? `${String(number).padStart(2, "0")}  ·  ${title}` : title,
        subtitle,
        media,
      };
    },
  },
});
