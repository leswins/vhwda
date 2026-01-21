import { sanityClient } from "../client"
import type { LocalizedString } from "./careers"

export type CareerSearchResult = {
  _id: string
  _type: "career"
  slug?: string
  title: LocalizedString
}

export type ScholarshipSearchResult = {
  _id: string
  _type: "scholarship"
  name: string
  link?: string
}

export type OrganizationSearchResult = {
  _id: string
  _type: "professionalOrganization"
  name: string
  link?: string
}

export type GlobalSearchResult =
  | CareerSearchResult
  | ScholarshipSearchResult
  | OrganizationSearchResult

type GlobalSearchPayload = {
  careers: CareerSearchResult[]
  scholarships: ScholarshipSearchResult[]
  organizations: OrganizationSearchResult[]
}

const GLOBAL_SEARCH_CAREERS_QUERY = /* groq */ `
*[_type == "career"]{
  _id,
  _type,
  "slug": slug.current,
  title
}
`

const GLOBAL_SEARCH_SCHOLARSHIPS_QUERY = /* groq */ `
*[_type == "scholarship"] | order(name asc){
  _id,
  _type,
  name,
  link
}
`

const GLOBAL_SEARCH_ORGANIZATIONS_QUERY = /* groq */ `
*[_type == "professionalOrganization"] | order(name asc){
  _id,
  _type,
  name,
  link
}
`

/**
 * Fetches all content needed for global header search in one pass.
 * Keeps payload minimal to support fast client-side filtering.
 */
export async function fetchGlobalSearchData(): Promise<GlobalSearchPayload> {
  const [careers, scholarships, organizations] = await Promise.all([
    sanityClient.fetch<CareerSearchResult[]>(GLOBAL_SEARCH_CAREERS_QUERY),
    sanityClient.fetch<ScholarshipSearchResult[]>(GLOBAL_SEARCH_SCHOLARSHIPS_QUERY),
    sanityClient.fetch<OrganizationSearchResult[]>(GLOBAL_SEARCH_ORGANIZATIONS_QUERY)
  ])

  return { careers, scholarships, organizations }
}

