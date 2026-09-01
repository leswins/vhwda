import type { Language } from "../../utils/i18n"
import { getLocalizedString } from "./careers"
import type { LocalizedString } from "./careers"
import { sanityClient } from "../client"

export type ResourceAudience = "publicHub" | "teacherPortal" | "both"
export type ResourceSourceKind =
  | "scholarship"
  | "professionalOrganization"
  | "educationalInstitution"
  | "generic"
export type ResourceAccent = "green" | "pink" | "blue" | "yellow" | "orange"
export type ResourceIconKey = "help" | "doctor" | "education" | "briefcase" | "grant" | "document"

export type ResourceType = {
  _id: string
  slug: string
  title: LocalizedString
  description?: LocalizedString
  accent: ResourceAccent
  icon: ResourceIconKey
  iconUrl?: string
  sortOrder: number
  audience: ResourceAudience
  sourceKind: ResourceSourceKind
  showInSubmissionForm: boolean
  allowFileAttachment: boolean
  enabled: boolean
}

export const FALLBACK_RESOURCE_TYPES: ResourceType[] = [
  {
    _id: "fallback.scholarships",
    slug: "scholarships",
    title: { en: "Scholarships & Financial Aid", es: "Becas y Ayuda Financiera" },
    description: {
      en: "Explore scholarships, grants, and funding options to support your education.",
      es: "Explora becas, subvenciones y opciones de financiamiento para apoyar tu educación."
    },
    accent: "green",
    icon: "help",
    sortOrder: 10,
    audience: "publicHub",
    sourceKind: "scholarship",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "fallback.organizations",
    slug: "organizations",
    title: { en: "Professional Organizations", es: "Organizaciones Profesionales" },
    description: {
      en: "Connect with professional associations and networks in healthcare.",
      es: "Conéctate con asociaciones profesionales y redes en el sector de la salud."
    },
    accent: "pink",
    icon: "doctor",
    sortOrder: 20,
    audience: "publicHub",
    sourceKind: "professionalOrganization",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "fallback.schools",
    slug: "schools",
    title: { en: "Schools & Prerequisites", es: "Escuelas y Prerrequisitos" },
    description: {
      en: "Find training programs, schools, and prerequisite courses in Virginia.",
      es: "Encuentra programas de formación, escuelas y cursos prerrequisito en Virginia."
    },
    accent: "blue",
    icon: "education",
    sortOrder: 30,
    audience: "publicHub",
    sourceKind: "educationalInstitution",
    showInSubmissionForm: false,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "fallback.internships",
    slug: "internships",
    title: { en: "Internships & Experiences", es: "Pasantías y Experiencias" },
    description: {
      en: "Discover internships, shadowing, and hands-on healthcare experiences.",
      es: "Descubre pasantías, observación y experiencias prácticas en salud."
    },
    accent: "yellow",
    icon: "briefcase",
    sortOrder: 40,
    audience: "publicHub",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "fallback.grants",
    slug: "grants",
    title: { en: "Grants & Opportunities", es: "Subvenciones y Oportunidades" },
    description: {
      en: "Find grants and workforce opportunities that support training and career growth.",
      es: "Encuentra subvenciones y oportunidades laborales que apoyan la formación y el crecimiento profesional."
    },
    accent: "orange",
    icon: "grant",
    sortOrder: 50,
    audience: "publicHub",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "fallback.teacher-materials",
    slug: "teacher-materials",
    title: { en: "Classroom Materials", es: "Materiales para el Aula" },
    description: {
      en: "Lesson plans, activities, and educator guides for introducing health careers.",
      es: "Planes de lección, actividades y guías educativas para presentar carreras de salud."
    },
    accent: "yellow",
    icon: "document",
    sortOrder: 10,
    audience: "teacherPortal",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: true,
    enabled: true
  }
]

export const RESOURCE_TYPES_QUERY = /* groq */ `
*[_type == "resourceType" && enabled != false] | order(sortOrder asc, title.en asc) {
  _id,
  slug,
  title,
  description,
  accent,
  icon,
  "iconUrl": iconImage.asset->url,
  sortOrder,
  audience,
  sourceKind,
  showInSubmissionForm,
  allowFileAttachment,
  enabled
}
`

function normalizeType(raw: Partial<ResourceType> & { _id: string }): ResourceType | null {
  const slug = typeof raw.slug === "string" ? raw.slug.trim() : ""
  if (!slug || !raw.title?.en) return null
  const accent = (raw.accent ?? "green") as ResourceAccent
  const icon = (raw.icon ?? "document") as ResourceIconKey
  const audience = (raw.audience ?? "publicHub") as ResourceAudience
  const sourceKind = (raw.sourceKind ?? "generic") as ResourceSourceKind
  return {
    _id: raw._id,
    slug,
    title: raw.title,
    description: raw.description,
    accent: ["green", "pink", "blue", "yellow", "orange"].includes(accent) ? accent : "green",
    icon: ["help", "doctor", "education", "briefcase", "grant", "document"].includes(icon)
      ? icon
      : "document",
    iconUrl: raw.iconUrl,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 100,
    audience: ["publicHub", "teacherPortal", "both"].includes(audience) ? audience : "publicHub",
    sourceKind: ["scholarship", "professionalOrganization", "educationalInstitution", "generic"].includes(
      sourceKind
    )
      ? sourceKind
      : "generic",
    showInSubmissionForm: raw.showInSubmissionForm !== false,
    allowFileAttachment: Boolean(raw.allowFileAttachment),
    enabled: raw.enabled !== false
  }
}

export async function fetchResourceTypes(): Promise<ResourceType[]> {
  try {
    const rows = await sanityClient.fetch<Array<Partial<ResourceType> & { _id: string }>>(
      RESOURCE_TYPES_QUERY
    )
    const types = (rows ?? []).map(normalizeType).filter((row): row is ResourceType => Boolean(row))
    return types.length > 0 ? types : FALLBACK_RESOURCE_TYPES
  } catch {
    return FALLBACK_RESOURCE_TYPES
  }
}

export function isPublicHubType(type: ResourceType) {
  return type.audience === "publicHub" || type.audience === "both"
}

export function isTeacherPortalType(type: ResourceType) {
  return type.audience === "teacherPortal" || type.audience === "both"
}

export function getResourceTypeLabel(language: Language, type: ResourceType) {
  return getLocalizedString(language, type.title) ?? type.slug
}

export function getResourceTypeDescription(language: Language, type: ResourceType) {
  return getLocalizedString(language, type.description) ?? ""
}
