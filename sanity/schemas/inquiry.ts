import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "email", type: "string", validation: (R) => R.required().email() }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "timeline",
      type: "string",
      options: {
        list: [
          { title: "Under 3 months", value: "under-3-months" },
          { title: "3 – 6 months", value: "3-6-months" },
          { title: "6+ months", value: "6-plus-months" },
          { title: "Just exploring", value: "exploring" },
        ],
      },
    }),
    defineField({
      name: "siteSecured",
      type: "string",
      options: {
        list: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
          { title: "Not yet", value: "not-yet" },
        ],
      },
    }),
    defineField({ name: "message", type: "text", rows: 6, validation: (R) => R.required().min(10) }),
    defineField({
      name: "createdAt",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email", date: "createdAt" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: date ? `${subtitle} — ${new Date(date).toLocaleDateString()}` : subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
