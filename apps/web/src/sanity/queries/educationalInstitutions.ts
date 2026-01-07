import { sanityClient } from "../client"
import type { EducationalInstitution } from "./careers"

export const EDUCATIONAL_INSTITUTIONS_QUERY = /* groq */ `
*[_type == "educationalInstitution" && defined(location)] | order(name asc){
  _id,
  name,
  slug,
  location,
  address,
  website,
  region
}
`

export async function fetchEducationalInstitutions(): Promise<EducationalInstitution[]> {
  return await sanityClient.fetch<EducationalInstitution[]>(EDUCATIONAL_INSTITUTIONS_QUERY)
}

