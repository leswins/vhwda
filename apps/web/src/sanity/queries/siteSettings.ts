import { sanityClient } from "../client"

export type SiteFeatureFlags = {
  aiChatEnabled?: boolean
  scholarshipsEnabled?: boolean
  demoResourcesEnabled?: boolean
}

export const SITE_SETTINGS_FEATURE_FLAGS_QUERY = /* groq */ `
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  "featureFlags": featureFlags{
    aiChatEnabled,
    scholarshipsEnabled,
    demoResourcesEnabled
  }
}
`

export async function fetchSiteFeatureFlags(): Promise<SiteFeatureFlags> {
  const client = sanityClient.withConfig({ useCdn: true, perspective: "published" })
  const data = await client.fetch<{ featureFlags?: SiteFeatureFlags } | null>(SITE_SETTINGS_FEATURE_FLAGS_QUERY)
  return data?.featureFlags ?? {}
}

