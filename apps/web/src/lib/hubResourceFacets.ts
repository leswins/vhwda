import type { TranslationKey } from "../utils/i18n"

export type HubFacetGroupId =
  | "experienceKind"
  | "compensation"
  | "audienceLevel"
  | "locationScope"
  | "setting"
  | "opportunityKind"
  | "applicantType"
  | "materialKind"
  | "gradeBands"
  | "topicFocus"
  | "format"

export type HubFacetOption = {
  value: string
  labelKey: TranslationKey
}

export type HubFacetGroup = {
  id: HubFacetGroupId
  titleKey: TranslationKey
  options: HubFacetOption[]
}

export const LOCATION_SCOPE_OPTIONS: HubFacetOption[] = [
  { value: "virginia_statewide", labelKey: "filters.geographicFocus.virginiaStatewide" },
  { value: "regional", labelKey: "filters.geographicFocus.regional" },
  { value: "local", labelKey: "filters.geographicFocus.local" },
  { value: "remote", labelKey: "filters.locationScope.remote" },
  { value: "national", labelKey: "filters.geographicFocus.national" }
]

export const INTERNSHIP_FACETS: HubFacetGroup[] = [
  {
    id: "experienceKind",
    titleKey: "filters.experienceKind",
    options: [
      { value: "internship", labelKey: "filters.experienceKind.internship" },
      { value: "shadowing", labelKey: "filters.experienceKind.shadowing" },
      { value: "volunteer", labelKey: "filters.experienceKind.volunteer" },
      { value: "clinical_rotation", labelKey: "filters.experienceKind.clinicalRotation" },
      { value: "research", labelKey: "filters.experienceKind.research" },
      { value: "apprenticeship", labelKey: "filters.experienceKind.apprenticeship" }
    ]
  },
  {
    id: "compensation",
    titleKey: "filters.compensation",
    options: [
      { value: "paid", labelKey: "filters.compensation.paid" },
      { value: "stipend", labelKey: "filters.compensation.stipend" },
      { value: "unpaid", labelKey: "filters.compensation.unpaid" }
    ]
  },
  {
    id: "audienceLevel",
    titleKey: "filters.audienceLevel",
    options: [
      { value: "high_school", labelKey: "filters.audienceLevel.highSchool" },
      { value: "undergraduate", labelKey: "filters.audienceLevel.undergraduate" },
      { value: "graduate", labelKey: "filters.audienceLevel.graduate" },
      { value: "career_changer", labelKey: "filters.audienceLevel.careerChanger" }
    ]
  },
  {
    id: "locationScope",
    titleKey: "filters.locationScope",
    options: LOCATION_SCOPE_OPTIONS
  },
  {
    id: "setting",
    titleKey: "filters.setting",
    options: [
      { value: "hospital", labelKey: "filters.setting.hospital" },
      { value: "clinic", labelKey: "filters.setting.clinic" },
      { value: "public_health", labelKey: "filters.setting.publicHealth" },
      { value: "community", labelKey: "filters.setting.community" },
      { value: "lab", labelKey: "filters.setting.lab" },
      { value: "other", labelKey: "filters.setting.other" }
    ]
  }
]

export const GRANT_FACETS: HubFacetGroup[] = [
  {
    id: "opportunityKind",
    titleKey: "filters.opportunityKind",
    options: [
      { value: "last_dollar", labelKey: "filters.opportunityKind.lastDollar" },
      { value: "workforce_grant", labelKey: "filters.opportunityKind.workforceGrant" },
      { value: "credential_funding", labelKey: "filters.opportunityKind.credentialFunding" },
      { value: "employer_sponsored", labelKey: "filters.opportunityKind.employerSponsored" },
      { value: "other", labelKey: "filters.opportunityKind.other" }
    ]
  },
  {
    id: "applicantType",
    titleKey: "filters.applicantType",
    options: [
      { value: "student", labelKey: "filters.applicantType.student" },
      { value: "worker", labelKey: "filters.applicantType.worker" },
      { value: "adult_learner", labelKey: "filters.applicantType.adultLearner" },
      { value: "employer", labelKey: "filters.applicantType.employer" },
      { value: "school", labelKey: "filters.applicantType.school" }
    ]
  },
  {
    id: "locationScope",
    titleKey: "filters.locationScope",
    options: LOCATION_SCOPE_OPTIONS.filter((option) => option.value !== "remote")
  }
]

export const EDUCATION_FACETS: HubFacetGroup[] = [
  {
    id: "materialKind",
    titleKey: "filters.materialKind",
    options: [
      { value: "lesson_plan", labelKey: "filters.materialKind.lessonPlan" },
      { value: "curriculum", labelKey: "filters.materialKind.curriculum" },
      { value: "activity", labelKey: "filters.materialKind.activity" },
      { value: "facilitator_guide", labelKey: "filters.materialKind.facilitatorGuide" },
      { value: "video", labelKey: "filters.materialKind.video" },
      { value: "slide_deck", labelKey: "filters.materialKind.slideDeck" },
      { value: "career_profile", labelKey: "filters.materialKind.careerProfile" }
    ]
  },
  {
    id: "gradeBands",
    titleKey: "filters.gradeBands",
    options: [
      { value: "elementary", labelKey: "filters.gradeBands.elementary" },
      { value: "middle", labelKey: "filters.gradeBands.middle" },
      { value: "high_school", labelKey: "filters.gradeBands.highSchool" },
      { value: "cte", labelKey: "filters.gradeBands.cte" },
      { value: "counselor", labelKey: "filters.gradeBands.counselor" }
    ]
  },
  {
    id: "topicFocus",
    titleKey: "filters.topicFocus",
    options: [
      { value: "career_exploration", labelKey: "filters.topicFocus.careerExploration" },
      { value: "workplace_safety", labelKey: "filters.topicFocus.workplaceSafety" },
      { value: "public_health", labelKey: "filters.topicFocus.publicHealth" },
      { value: "clinical_skills", labelKey: "filters.topicFocus.clinicalSkills" },
      { value: "pathway_planning", labelKey: "filters.topicFocus.pathwayPlanning" }
    ]
  },
  {
    id: "format",
    titleKey: "filters.format",
    options: [
      { value: "pdf", labelKey: "filters.format.pdf" },
      { value: "web", labelKey: "filters.format.web" },
      { value: "video", labelKey: "filters.format.video" },
      { value: "slides", labelKey: "filters.format.slides" }
    ]
  }
]

export function facetsForSlug(slug?: string) {
  if (slug === "internships") return INTERNSHIP_FACETS
  if (slug === "grants") return GRANT_FACETS
  if (slug === "teacher-materials") return EDUCATION_FACETS
  return []
}

export type HubResourceSort = "title" | "deadline" | "newest"

export type HubFacetFilters = {
  searchQuery: string
  selected: Partial<Record<HubFacetGroupId | "careerAreas", string[]>>
  sort: HubResourceSort
}

export function emptyHubFacetFilters(): HubFacetFilters {
  return { searchQuery: "", selected: {}, sort: "title" }
}
