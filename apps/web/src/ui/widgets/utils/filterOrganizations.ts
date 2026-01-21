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

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim()
    filtered = filtered.filter((org) => {
      const name = org.name.toLowerCase()
      const institution = org.institution?.toLowerCase() || ""
      const description = getLocalizedText(language, org.description)?.toLowerCase() || ""

      return name.includes(query) || institution.includes(query) || description.includes(query)
    })
  }

  if (filters.selectedMembershipTypes.length > 0) {
    filtered = filtered.filter((org) => {
      if (!org.membershipType || org.membershipType.length === 0) return false
      return filters.selectedMembershipTypes.some((type) => org.membershipType?.includes(type))
    })
  }

  if (filters.selectedGeographicFocus.length > 0) {
    filtered = filtered.filter((org) => {
      if (!org.geographicFocus) return false
      return filters.selectedGeographicFocus.includes(org.geographicFocus)
    })
  }

  if (filters.selectedCareerAreas.length > 0) {
    filtered = filtered.filter((org) => {
      if (!org.careerAreas || org.careerAreas.length === 0) return false
      return filters.selectedCareerAreas.some((areaId) =>
        org.careerAreas?.some((area) => area._id === areaId)
      )
    })
  }

  return filtered
}

