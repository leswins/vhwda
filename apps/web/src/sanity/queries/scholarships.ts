import { sanityClient } from "../client"
import type { Language } from "../../utils/i18n"
import type { LocalizedString, LocalizedText, LocalizedPortableText } from "./careers"

export type Scholarship = {
  _id: string
  name: string
  summary?: LocalizedString
  description?: LocalizedText
  institution?: string
  eligibility?: LocalizedPortableText
  region?: string
  deadline?: string
  link: string
  currentStage?: string[]
  fundingType?: string
  locationScope?: string
  careerAreas?: Array<{ _id: string; title?: string }>
  badges?: string[]
}

export const SCHOLARSHIPS_QUERY = /* groq */ `
*[_type == "scholarship"] | order(name asc){
  _id,
  name,
  summary,
  description,
  institution,
  eligibility,
  region,
  deadline,
  link,
  currentStage,
  fundingType,
  locationScope,
  careerAreas[]->{
    _id,
    title
  },
  badges
}
`

export async function fetchScholarships(): Promise<Scholarship[]> {
  return await sanityClient.fetch<Scholarship[]>(SCHOLARSHIPS_QUERY)
}

