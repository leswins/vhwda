import type { Scholarship } from "../../../sanity/queries/scholarships"
import type { ScholarshipFilters } from "../filters/scholarshipFilters"
import { getLocalizedString, getLocalizedText } from "../../../sanity/queries/careers"
import type { Language } from "../../../utils/i18n"

export function filterScholarships(
  scholarships: Scholarship[],
  filters: ScholarshipFilters,
  language: Language
): Scholarship[] {
  let filtered = [...scholarships]

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim()
    filtered = filtered.filter((scholarship) => {
      const name = scholarship.name.toLowerCase()
      const institution = scholarship.institution?.toLowerCase() || ""
      const summary = getLocalizedString(language, scholarship.summary)?.toLowerCase() || ""
      const description = getLocalizedText(language, scholarship.description)?.toLowerCase() || ""

      return (
        name.includes(query) ||
        institution.includes(query) ||
        summary.includes(query) ||
        description.includes(query)
      )
    })
  }

  return filtered
}

