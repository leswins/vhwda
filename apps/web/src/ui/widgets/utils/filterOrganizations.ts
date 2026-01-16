import type { ProfessionalOrganization } from "../../../sanity/queries/professionalOrganizations"
import type { OrganizationFilters } from "../filters/organizationFilters"
import { getLocalizedText } from "../../../sanity/queries/careers"
import type { Language } from "../../../utils/i18n"

export function filterOrganizations(
  organizations: ProfessionalOrganization[],
  filters: OrganizationFilters,
  language: Language
): ProfessionalOrganization[] {
  let filtered = [...organizations]

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim()
    filtered = filtered.filter((org) => {
      const name = org.name.toLowerCase()
      const institution = org.institution?.toLowerCase() || ""
      const description = getLocalizedText(language, org.description)?.toLowerCase() || ""

      return name.includes(query) || institution.includes(query) || description.includes(query)
    })
  }

  return filtered
}

