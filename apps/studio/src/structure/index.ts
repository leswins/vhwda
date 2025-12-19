import type { StructureResolver } from "sanity/structure"
import { CogIcon, TagIcon, ThLargeIcon } from "@sanity/icons"

const SINGLETONS = ["siteSettings"]

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.listItem()
        .title("Careers")
        .icon(ThLargeIcon)
        .child(S.documentTypeList("career").title("Careers")),

      S.listItem()
        .title("Programs")
        .child(S.documentTypeList("program").title("Programs")),

      S.listItem()
        .title("Scholarships")
        .child(S.documentTypeList("scholarship").title("Scholarships")),

      S.listItem()
        .title("Resources")
        .child(S.documentTypeList("resource").title("Resources")),

      S.listItem()
        .title("Professional Organizations")
        .child(S.documentTypeList("professionalOrganization").title("Professional Organizations")),

      S.listItem().title("Quiz").child(S.documentTypeList("quiz").title("Quiz")),

      S.divider(),

      S.listItem().title("Career Categories").icon(TagIcon).child(S.documentTypeList("careerCategory")),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() as string))
    ])


