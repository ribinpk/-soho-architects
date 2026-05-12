import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Default meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo (SVG preferred)",
      type: "image",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "ogImage",
      title: "Default Open Graph image",
      type: "image",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Studio address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            { name: "label", type: "string", validation: (R) => R.required() },
            { name: "url", type: "url", validation: (R) => R.required() },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "pressLogos",
      title: "Press logos",
      description:
        "Publications that have featured the studio. Shown as a strip on the home page. Logo is optional — name falls back to a serif text-mark.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pressLogo",
          fields: [
            {
              name: "name",
              type: "string",
              validation: (R) => R.required(),
            },
            {
              name: "logo",
              type: "image",
              options: { accept: "image/svg+xml,image/png" },
            },
            { name: "url", type: "url" },
          ],
          preview: { select: { title: "name", media: "logo" } },
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      description: "Client quotes shown on the home page. Aim for 3.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonial",
          fields: [
            {
              name: "quote",
              type: "text",
              rows: 4,
              validation: (R) => R.required().min(20),
            },
            {
              name: "author",
              type: "string",
              validation: (R) => R.required(),
            },
            { name: "role", type: "string" },
            { name: "project", type: "string" },
          ],
          preview: {
            select: { title: "author", subtitle: "quote" },
          },
        }),
      ],
    }),
    defineField({
      name: "footerCopy",
      title: "Footer copy",
      type: "portableText",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
