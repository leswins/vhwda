import React, { useEffect, useMemo, useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import { fetchHubResources } from "../../sanity/queries/hubResources"
import type { HubResource } from "../../sanity/queries/hubResources"
import type { ResourceType } from "../../sanity/queries/resourceTypes"
import { getLocalizedString, getLocalizedText } from "../../sanity/queries/careers"
import { HubResourceCard } from "./HubResourceCard"
import { getDemoHubResources } from "../../data/demoResources"
import { useDemoResourcesEnabled } from "../../hooks/useDemoResourcesEnabled"

type Props = {
  language: Language
  resourceType: ResourceType
  searchQuery: string
  onCountChange?: (count: number) => void
}

export function HubResourceList({ language, resourceType, searchQuery, onCountChange }: Props) {
  const [allResources, setAllResources] = useState<HubResource[]>([])
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)
  const demoEnabled = useDemoResourcesEnabled()

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return allResources
    return allResources.filter((resource) => {
      const title = getLocalizedString(language, resource.title)?.toLowerCase() ?? ""
      const summary = getLocalizedString(language, resource.summary)?.toLowerCase() ?? ""
      const description = getLocalizedText(language, resource.description)?.toLowerCase() ?? ""
      const institution = resource.institution?.toLowerCase() ?? ""
      const tags = (resource.tags ?? []).join(" ").toLowerCase()
      return `${title} ${summary} ${description} ${institution} ${tags}`.includes(query)
    })
  }, [allResources, language, searchQuery])

  useEffect(() => {
    onCountChange?.(filtered.length)
  }, [filtered.length, onCountChange])

  useEffect(() => {
    if (demoEnabled === null) return
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await fetchHubResources(resourceType.slug)
        const samples = demoEnabled ? getDemoHubResources(resourceType.slug) : []
        const next = data.length > 0 ? data : samples
        if (!cancelled) {
          setAllResources(next)
          setUsingDemo(data.length === 0 && samples.length > 0)
        }
      } catch {
        const samples = demoEnabled ? getDemoHubResources(resourceType.slug) : []
        if (!cancelled) {
          setAllResources(samples)
          setUsingDemo(samples.length > 0)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [resourceType.slug, demoEnabled])

  if (loading || demoEnabled === null) {
    return <p className="text-muted">{t(language, "resources.generic.loading")}</p>
  }

  if (filtered.length === 0) {
    return <p className="text-muted">{t(language, "resources.generic.noneFound")}</p>
  }

  return (
    <div className="flex-1">
      {usingDemo ? (
        <p className="mb-4 text-body-sm text-muted">{t(language, "resources.generic.demoNotice")}</p>
      ) : null}
      {filtered.map((resource) => (
        <HubResourceCard
          key={resource._id}
          language={language}
          resource={resource}
          accent={resourceType.accent}
          typeSlug={resourceType.slug}
        />
      ))}
    </div>
  )
}
