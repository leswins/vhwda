import { sanityClient } from "../client"
import type { Language } from "../../utils/i18n"

export type LocalizedString = { en: string; es?: string }
export type LocalizedText = { en: string; es?: string }
export type LocalizedBulletList = { en: string[]; es?: string[] }

// Minimal Portable Text typing (we'll add proper rendering/types later)
export type PortableTextBlock = Record<string, unknown>
export type LocalizedPortableText = { en: PortableTextBlock[]; es?: PortableTextBlock[] }

export type Salary = {
  median?: number
  rangeMin?: number
  rangeMax?: number
  notes?: LocalizedString
  source?: string
  year?: number
}

export type Outlook = {
  label?: string
  value?: number
  notes?: LocalizedString
  source?: string
  year?: number
}

export type EducationalInstitution = {
  _id: string
  name: string
  slug?: string
  location?: { lat: number; lng: number; alt?: number }
  address?: string
  website?: string
  region?: string
}

export type CareerEducationInstitutionItem = {
  _key: string
  label?: string
  programUrl?: string
  institution?: EducationalInstitution
}

export type ProfessionalOrganization = {
  _id: string
  name: string
  link?: string
  description?: LocalizedText
}

export type CareerSummaryCard = {
  _id: string
  slug?: string
  title: LocalizedString
  salary?: Pick<Salary, "median" | "rangeMin" | "rangeMax">
  imageUrl?: string
  videoUrl?: string
}

export type CareerDetail = {
  _id: string
  slug?: string
  title: LocalizedString
  summary?: LocalizedText
  images?: Array<{ asset?: { _id: string; url: string } }>
  videoUrl?: string

  responsibilities?: LocalizedBulletList
  workEnvironment?: LocalizedBulletList
  specializations?: LocalizedBulletList
  specializationsNote?: LocalizedPortableText

  educationRequirements?: LocalizedPortableText
  academicRequirementsHighlight?: LocalizedString
  programLengthHighlight?: LocalizedString

  prerequisites?: LocalizedPortableText
  licensureAndCerts?: LocalizedBulletList

  salary?: Salary
  outlook?: Outlook

  educationInstitutions?: CareerEducationInstitutionItem[]
  professionalOrgs?: ProfessionalOrganization[]
  similarCareers?: CareerSummaryCard[]
}

export const CAREER_DETAIL_QUERY = /* groq */ `
*[_type == "career" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  title,
  summary,
  images[]{asset->{_id, url}},
  videoUrl,

  responsibilities,
  workEnvironment,
  specializations,
  specializationsNote,

  educationRequirements,
  academicRequirementsHighlight,
  programLengthHighlight,

  prerequisites,
  licensureAndCerts,

  salary{median, rangeMin, rangeMax, notes, source, year},
  outlook{label, value, notes, source, year},

  educationInstitutions[]{
    _key,
    label,
    programUrl,
    institution->{
      _id,
      name,
      "slug": slug.current,
      location,
      address,
      website,
      region
    }
  },

  professionalOrgs[]->{
    _id,
    name,
    link,
    description
  },

  similarCareers[]->{
    _id,
    "slug": slug.current,
    title,
    salary{median, rangeMin, rangeMax},
    "imageUrl": images[0].asset->url,
    videoUrl
  }
}
`

export async function fetchCareerDetailBySlug(slug: string): Promise<CareerDetail | null> {
  if (!slug) return null
  return await sanityClient.fetch<CareerDetail | null>(CAREER_DETAIL_QUERY, { slug })
}

export function getLocalizedString(language: Language, value?: LocalizedString): string | undefined {
  if (!value) return undefined
  return language === "es" ? value.es ?? value.en : value.en
}

export function getLocalizedText(language: Language, value?: LocalizedText): string | undefined {
  if (!value) return undefined
  return language === "es" ? value.es ?? value.en : value.en
}

//Quiz data
export type QuizVector = {
  w_patient_facing?: number
  w_tech_equipment?: number
  w_lab_research?: number
  w_counseling_education?: number
  w_pediatrics?: number
  w_geriatrics?: number
  w_exposure_tolerance?: number
  w_analytical?: number
  w_admin?: number
  w_procedural_dexterity?: number
  w_collaboration?: number
  w_pace_routine?: number
  w_pace_fast?: number
  w_schedule_flex?: number
  w_stress_tolerance?: number
  w_physical_light?: number
  w_physical_on_feet?: number
  w_physical_lifting?: number
  w_env_hospital?: number
  w_env_clinic?: number
  w_env_community?: number
  w_env_school?: number
  w_env_lab?: number
  w_env_office?: number
  w_multi_env?: number
  w_outlook_importance?: number
  w_short_path?: number
}

// hard requirements to exclude from quiz
export type HardRequirements = {
  requiresLicensure?: boolean
  requiresLifting?: boolean
  requiresNightsWeekends?: boolean
  requiresBloodNeedles?: boolean
  requiresAcuteStress?: boolean
}

