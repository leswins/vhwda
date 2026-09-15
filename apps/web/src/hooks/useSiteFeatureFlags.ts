import { useEffect, useState } from "react"
import { fetchSiteFeatureFlags, type SiteFeatureFlags } from "../sanity/queries/siteSettings"

export function useSiteFeatureFlags() {
  const [flags, setFlags] = useState<SiteFeatureFlags | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const next = await fetchSiteFeatureFlags()
        if (!cancelled) setFlags(next)
      } catch {
        if (!cancelled) setFlags({})
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return flags
}
