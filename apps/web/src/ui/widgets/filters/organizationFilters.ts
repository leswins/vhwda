import type { FilterGroup } from "./scholarshipFilters"

export type OrganizationFilters = {
  searchQuery: string
  selectedMembershipTypes: string[]
  selectedGeographicFocus: string[]
  selectedCareerAreas: string[]
}

export const organizationFilters: FilterGroup[] = [
  {
    id: "membershipType",
    titleKey: "filters.membershipType",
    options: [
      { value: "student", labelKey: "filters.membershipType.student" },
      { value: "professional", labelKey: "filters.membershipType.professional" },
      { value: "employer", labelKey: "filters.membershipType.employer" }
    ]
  },
  {
    id: "geographicFocus",
    titleKey: "filters.geographicFocus",
    options: [
      { value: "virginia_statewide", labelKey: "filters.geographicFocus.virginiaStatewide" },
      { value: "regional", labelKey: "filters.geographicFocus.regional" },
      { value: "national", labelKey: "filters.geographicFocus.national" },
      { value: "international", labelKey: "filters.geographicFocus.international" },
      { value: "local", labelKey: "filters.geographicFocus.local" }
    ]
  },
  {
    id: "careerArea",
    titleKey: "filters.careerArea",
    options: []
  }
]
