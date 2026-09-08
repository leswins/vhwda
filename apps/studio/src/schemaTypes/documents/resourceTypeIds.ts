export const RESOURCE_TYPE_IDS = {
  internships: "resourceType.internships",
  grants: "resourceType.grants",
  educational: "resourceType.teacher-materials"
} as const

export function resourceTypeRef(document: unknown) {
  const ref = (document as { resourceType?: { _ref?: string } } | null)?.resourceType?._ref
  return (ref || "").replace(/^drafts\./, "")
}

export function isResourceType(document: unknown, id: string) {
  return resourceTypeRef(document) === id
}
