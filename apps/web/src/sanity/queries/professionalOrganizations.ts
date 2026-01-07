import { sanityClient } from "../client"
import type { LocalizedText } from "./careers"

export type ProfessionalOrganization = {
  _id: string
  name: string
  institution?: string
  link?: string
  description?: LocalizedText
  membershipType?: string[]
  geographicFocus?: string
  careerAreas?: Array<{ _id: string; title?: string }>
}

export const PROFESSIONAL_ORGANIZATIONS_QUERY = /* groq */ `
*[_type == "professionalOrganization"] | order(name asc){
  _id,
  name,
  institution,
  link,
  description,
  membershipType,
  geographicFocus,
  careerAreas[]->{
    _id,
    title
  }
}
`

export async function fetchProfessionalOrganizations(): Promise<ProfessionalOrganization[]> {
  return await sanityClient.fetch<ProfessionalOrganization[]>(PROFESSIONAL_ORGANIZATIONS_QUERY)
}

