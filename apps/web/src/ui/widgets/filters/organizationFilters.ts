import type { FilterGroup } from "./scholarshipFilters"

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
    options: []
  },
  {
    id: "careerArea",
    titleKey: "filters.careerArea",
    options: []
  }
]

