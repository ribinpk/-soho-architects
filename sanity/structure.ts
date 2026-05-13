import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings", "studioPage"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.listItem()
        .title("Studio page")
        .id("studioPage")
        .child(
          S.editor()
            .id("studioPage")
            .schemaType("studioPage")
            .documentId("studioPage"),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("insightPost").title("Insights"),
      S.divider(),
      S.documentTypeListItem("inquiry").title("Inquiries"),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== undefined &&
          !["project", "insightPost", "inquiry", ...SINGLETONS].includes(
            item.getId() as string,
          ),
      ),
    ]);

export const singletonTypes = new Set(SINGLETONS);
