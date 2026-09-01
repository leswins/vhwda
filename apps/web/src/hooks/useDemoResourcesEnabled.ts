import { useEffect, useState } from "react"
import { readDemoUrlOverride, resolveDemoResourcesEnabled } from "../data/demoResources"
import { fetchSiteFeatureFlags } from "../sanity/queries/siteSettings"

export function useDemoResourcesEnabled() {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const override = readDemoUrlOverride()
      if (override !== null) {
        if (!cancelled) setEnabled(override)
        return
      }
      try {
        const flags = await fetchSiteFeatureFlags()
        if (!cancelled) setEnabled(resolveDemoResourcesEnabled(Boolean(flags.demoResourcesEnabled)))
      } catch {
        if (!cancelled) setEnabled(resolveDemoResourcesEnabled(false))
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return enabled
}
