import type { ResourceType } from "../sanity/queries/resourceTypes"

export type SubmitKind =
  | "scholarship"
  | "organization"
  | "internship"
  | "grant"
  | "educational"
  | "generic"

export function submitKindForType(type?: Pick<ResourceType, "slug" | "sourceKind"> | null): SubmitKind {
  if (!type) return "generic"
  if (type.sourceKind === "scholarship") return "scholarship"
  if (type.sourceKind === "professionalOrganization") return "organization"
  if (type.slug === "internships") return "internship"
  if (type.slug === "grants") return "grant"
  if (type.slug === "teacher-materials") return "educational"
  return "generic"
}

export function submitKindForSlug(slug?: string | null): SubmitKind {
  switch (slug) {
    case "scholarships":
      return "scholarship"
    case "organizations":
      return "organization"
    case "internships":
      return "internship"
    case "grants":
      return "grant"
    case "teacher-materials":
      return "educational"
    default:
      return "generic"
  }
}

export type ResourceDetails = {
  experienceKind?: string
  compensation?: string
  audienceLevel?: string[]
  setting?: string
  duration?: string
  opportunityKind?: string
  applicantType?: string[]
  fundingAmount?: string
  materialKind?: string
  gradeBands?: string[]
  topicFocus?: string
  format?: string
  fileLabel?: string
  membershipType?: string[]
  tags?: string[]
  careerAreaIds?: string[]
}

export type SubmitFieldSet = {
  nameLabel: "name" | "title"
  institutionLabel: "institution" | "host" | "org"
  summary: boolean
  description: boolean
  institution: boolean
  eligibility: boolean
  region: boolean
  deadline: boolean
  link: boolean
  linkRequired: boolean
  fileUrl: boolean
  fileLabel: boolean
  currentStage: boolean
  fundingType: boolean
  scholarshipLocationScope: boolean
  badges: boolean
  experienceKind: boolean
  compensation: boolean
  audienceLevel: boolean
  setting: boolean
  duration: boolean
  hubLocationScope: boolean
  opportunityKind: boolean
  applicantType: boolean
  fundingAmount: boolean
  materialKind: boolean
  gradeBands: boolean
  topicFocus: boolean
  format: boolean
  membershipType: boolean
  geographicFocus: boolean
  careerAreas: boolean
  tags: boolean
}

const HIDDEN: SubmitFieldSet = {
  nameLabel: "title",
  institutionLabel: "host",
  summary: false,
  description: false,
  institution: false,
  eligibility: false,
  region: false,
  deadline: false,
  link: false,
  linkRequired: false,
  fileUrl: false,
  fileLabel: false,
  currentStage: false,
  fundingType: false,
  scholarshipLocationScope: false,
  badges: false,
  experienceKind: false,
  compensation: false,
  audienceLevel: false,
  setting: false,
  duration: false,
  hubLocationScope: false,
  opportunityKind: false,
  applicantType: false,
  fundingAmount: false,
  materialKind: false,
  gradeBands: false,
  topicFocus: false,
  format: false,
  membershipType: false,
  geographicFocus: false,
  careerAreas: false,
  tags: false
}

export function fieldsForKind(kind: SubmitKind): SubmitFieldSet {
  if (kind === "scholarship") {
    return {
      ...HIDDEN,
      nameLabel: "name",
      institutionLabel: "institution",
      summary: true,
      description: true,
      institution: true,
      eligibility: true,
      region: true,
      deadline: true,
      link: true,
      linkRequired: true,
      currentStage: true,
      fundingType: true,
      scholarshipLocationScope: true,
      badges: true,
      careerAreas: true
    }
  }

  if (kind === "organization") {
    return {
      ...HIDDEN,
      nameLabel: "name",
      institutionLabel: "org",
      description: true,
      institution: true,
      link: true,
      linkRequired: false,
      membershipType: true,
      geographicFocus: true,
      careerAreas: true
    }
  }

  if (kind === "internship") {
    return {
      ...HIDDEN,
      nameLabel: "title",
      institutionLabel: "host",
      summary: true,
      description: true,
      institution: true,
      eligibility: true,
      region: true,
      deadline: true,
      link: true,
      linkRequired: true,
      experienceKind: true,
      compensation: true,
      audienceLevel: true,
      setting: true,
      duration: true,
      hubLocationScope: true,
      careerAreas: true,
      tags: true
    }
  }

  if (kind === "grant") {
    return {
      ...HIDDEN,
      nameLabel: "title",
      institutionLabel: "host",
      summary: true,
      description: true,
      institution: true,
      eligibility: true,
      region: true,
      deadline: true,
      link: true,
      linkRequired: true,
      opportunityKind: true,
      applicantType: true,
      fundingAmount: true,
      hubLocationScope: true,
      careerAreas: true,
      tags: true
    }
  }

  if (kind === "educational") {
    return {
      ...HIDDEN,
      nameLabel: "title",
      institutionLabel: "host",
      summary: true,
      description: true,
      institution: true,
      region: true,
      link: true,
      linkRequired: false,
      fileUrl: true,
      fileLabel: true,
      materialKind: true,
      gradeBands: true,
      topicFocus: true,
      format: true,
      careerAreas: true,
      tags: true
    }
  }

  return {
    ...HIDDEN,
    nameLabel: "title",
    institutionLabel: "host",
    summary: true,
    description: true,
    institution: true,
    eligibility: true,
    region: true,
    deadline: true,
    link: true,
    linkRequired: false,
    careerAreas: true,
    tags: true
  }
}

export function splitTags(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
