import type { Language } from "../../../utils/i18n"
import { getLocalizedString, getLocalizedText } from "../../../sanity/queries/careers"
import type { HubResource } from "../../../sanity/queries/hubResources"
import type { HubFacetFilters, HubFacetGroupId } from "../../../lib/hubResourceFacets"

function valuesFor(resource: HubResource, id: HubFacetGroupId | "careerAreas"): string[] {
  if (id === "careerAreas") return (resource.careerAreas ?? []).map((area) => area._id)
  const value = resource[id]
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  return typeof value === "string" && value ? [value] : []
}

function matchesSelected(selected: string[] | undefined, actual: string[]) {
  if (!selected || selected.length === 0) return true
  return selected.some((value) => actual.includes(value))
}

export function filterHubResources(resources: HubResource[], filters: HubFacetFilters, language: Language) {
  const query = filters.searchQuery.trim().toLowerCase()
  const selected = filters.selected

  const filtered = resources.filter((resource) => {
    if (query) {
      const title = getLocalizedString(language, resource.title)?.toLowerCase() ?? ""
      const summary = getLocalizedString(language, resource.summary)?.toLowerCase() ?? ""
      const description = getLocalizedText(language, resource.description)?.toLowerCase() ?? ""
      const institution = resource.institution?.toLowerCase() ?? ""
      const tags = (resource.tags ?? []).join(" ").toLowerCase()
      const haystack = `${title} ${summary} ${description} ${institution} ${tags}`
      if (!haystack.includes(query)) return false
    }

    return (Object.entries(selected) as Array<[HubFacetGroupId | "careerAreas", string[]]>).every(([id, values]) =>
      matchesSelected(values, valuesFor(resource, id))
    )
  })

  const sorted = [...filtered]
  if (filters.sort === "deadline") {
    sorted.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline.localeCompare(b.deadline)
    })
  } else if (filters.sort === "newest") {
    sorted.sort((a, b) => (b._createdAt ?? "").localeCompare(a._createdAt ?? ""))
  } else {
    sorted.sort((a, b) => {
      const left = getLocalizedString(language, a.title) ?? ""
      const right = getLocalizedString(language, b.title) ?? ""
      return left.localeCompare(right)
    })
  }

  return sorted
}
