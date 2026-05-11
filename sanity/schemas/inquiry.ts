import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "email", type: "string", validation: (R) => R.required().email() }),
    defineField({ name: "phone", type: "string" }),
    defineField({
      name: "projectType",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Commercial", value: "commercial" },
          { title: "Hospitality", value: "hospitality" },
          { title: "Workspace", value: "workspace" },
          { title: "Interior", value: "interior" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "budgetRange", type: "string" }),
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
