import { sanityClient } from "../client"
import { CareerSummaryCard } from "./careers"

export type HomePageData = {
  featuredCareers: CareerSummaryCard[]
}

export const HOME_PAGE_QUERY = /* groq */ `
*[_type == "homePage" && _id == "homePage"][0]{
  featuredCareers[]->{
    _id,
    "slug": slug.current,
    title,
    salary{median, rangeMin, rangeMax},
    "imageUrl": images[0].asset->url,
    videoUrl
  }
}
`

export async function fetchHomePageData(): Promise<HomePageData | null> {
  return await sanityClient.fetch<HomePageData | null>(HOME_PAGE_QUERY)
}

