import { sanityClient } from "../client"

export type CareerCategory = {
  _id: string
  title: string
}

export const CAREER_CATEGORIES_QUERY = /* groq */ `
*[_type == "careerCategory"] | order(title asc){
  _id,
  title
}
`

export async function fetchCareerCategories(): Promise<CareerCategory[]> {
  return await sanityClient.fetch<CareerCategory[]>(CAREER_CATEGORIES_QUERY)
}
