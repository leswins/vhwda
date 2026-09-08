import { RESOURCE_TYPE_IDS } from "../schemaTypes/documents/resourceTypeIds"

export const resourceTemplates = [
  {
    id: "resource-internship",
    title: "Internship / Experience",
    schemaType: "resource",
    value: {
      published: true,
      resourceType: { _type: "reference", _ref: RESOURCE_TYPE_IDS.internships }
    }
  },
  {
    id: "resource-grant",
    title: "Grant / Opportunity",
    schemaType: "resource",
    value: {
      published: true,
      resourceType: { _type: "reference", _ref: RESOURCE_TYPE_IDS.grants }
    }
  },
  {
    id: "resource-educational",
    title: "Educational resource",
    schemaType: "resource",
    value: {
      published: true,
      resourceType: { _type: "reference", _ref: RESOURCE_TYPE_IDS.educational }
    }
  }
]
