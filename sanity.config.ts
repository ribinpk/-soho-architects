import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { singletonTypes, structure } from "./sanity/structure";

export default defineConfig({
  basePath: studioUrl,
  name: "soho-architects",
  title: "SOHO Architects",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? input.filter(({ action }) =>
            action ? ["publish", "discardChanges", "restore"].includes(action) : false,
          )
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(({ templateId }) => !singletonTypes.has(templateId))
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
