import type { StructureResolver } from "sanity/structure"
import { BillIcon, BookIcon, CaseIcon, CogIcon, DocumentIcon, HomeIcon, TagIcon, ThLargeIcon } from "@sanity/icons"
import { RESOURCE_TYPE_IDS } from "../schemaTypes/documents/resourceTypeIds"

const SINGLETONS = ["siteSettings", "homePage"]
const CUSTOM_NAV_TYPES = [
  "career",
  "educationalInstitution",
  "program",
  "scholarship",
  "resourceType",
  "resource",
  "professionalOrganization",
  "quiz",
  "careerCategory"
]

function resourceFolder(
  S: Parameters<StructureResolver>[0],
  title: string,
  typeId: string,
  templateId: string,
  icon: typeof CaseIcon
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .schemaType("resource")
    .child(
      S.documentTypeList("resource")
        .title(title)
        .filter("_type == \"resource\" && resourceType._ref in [$typeId, $draftTypeId]")
        .params({ typeId, draftTypeId: `drafts.${typeId}` })
        .initialValueTemplates([S.initialValueTemplateItem(templateId)])
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),

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
        .title("Educational Institutions")
        .icon(BookIcon)
        .child(S.documentTypeList("educationalInstitution").title("Educational Institutions")),

      S.listItem()
        .title("Scholarships")
        .child(S.documentTypeList("scholarship").title("Scholarships")),

      S.listItem()
        .title("Professional Organizations")
        .child(S.documentTypeList("professionalOrganization").title("Professional Organizations")),

      S.divider(),

      resourceFolder(S, "Internships & Experiences", RESOURCE_TYPE_IDS.internships, "resource-internship", CaseIcon),
      resourceFolder(S, "Grants & Opportunities", RESOURCE_TYPE_IDS.grants, "resource-grant", BillIcon),
      resourceFolder(S, "Educational Resources", RESOURCE_TYPE_IDS.educational, "resource-educational", DocumentIcon),

      S.listItem()
        .title("Other hub resources")
        .child(
          S.documentTypeList("resource")
            .title("Other hub resources")
            .filter(
              "_type == \"resource\" && !(resourceType._ref in [$internships, $grants, $educational, $internshipsDraft, $grantsDraft, $educationalDraft])"
            )
            .params({
              internships: RESOURCE_TYPE_IDS.internships,
              grants: RESOURCE_TYPE_IDS.grants,
              educational: RESOURCE_TYPE_IDS.educational,
              internshipsDraft: `drafts.${RESOURCE_TYPE_IDS.internships}`,
              grantsDraft: `drafts.${RESOURCE_TYPE_IDS.grants}`,
              educationalDraft: `drafts.${RESOURCE_TYPE_IDS.educational}`
            })
        ),

      S.listItem()
        .title("Resource Types")
        .icon(TagIcon)
        .child(S.documentTypeList("resourceType").title("Resource Types")),

      S.divider(),

      S.listItem().title("Quiz").child(S.documentTypeList("quiz").title("Quiz")),

      S.listItem().title("Career Categories").icon(TagIcon).child(S.documentTypeList("careerCategory")),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() as string
        return !SINGLETONS.includes(id) && !CUSTOM_NAV_TYPES.includes(id)
      })
    ])
