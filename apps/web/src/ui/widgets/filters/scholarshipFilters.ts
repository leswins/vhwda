export type FilterGroup = {
  id: string
  titleKey: string
  options: Array<{ value: string; labelKey: string }>
}

export const scholarshipFilters: FilterGroup[] = [
  {
    id: "currentStage",
    titleKey: "filters.currentStage",
    options: [
      { value: "high_school", labelKey: "filters.currentStage.highSchool" },
      { value: "college", labelKey: "filters.currentStage.college" },
      { value: "graduate", labelKey: "filters.currentStage.graduate" },
      { value: "working_professional", labelKey: "filters.currentStage.workingProfessional" },
      { value: "veteran_military", labelKey: "filters.currentStage.veteranMilitary" },
      { value: "adult_returning", labelKey: "filters.currentStage.adultReturning" }
    ]
  },
  {
    id: "fundingType",
    titleKey: "filters.fundingType",
    options: []
  },
  {
    id: "locationScope",
    titleKey: "filters.locationScope",
    options: []
  },
  {
    id: "careerArea",
    titleKey: "filters.careerArea",
    options: []
  }
]

