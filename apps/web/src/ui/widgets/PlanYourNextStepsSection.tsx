import React, { useEffect, useRef, useState } from "react"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { OrganizationFilters as OrganizationFiltersComponent } from "./OrganizationFilters"
import { ScholarshipList } from "./ScholarshipList"
import { ProfessionalOrganizationList } from "./ProfessionalOrganizationList"
import { EducationalInstitutionsList } from "./EducationalInstitutionsList"
import { HubResourceList } from "./HubResourceList"
import { FiltersPanel, ResourceSplit } from "./HubResourceSplit"
import { HubFacetFilters as HubFacetFiltersPanel, HubSortOptions } from "./HubFacetFilters"
import { emptyHubFacetFilters, facetsForSlug, type HubFacetFilters } from "../../lib/hubResourceFacets"
import { SectionHeader } from "./SectionHeader"
import { ScholarshipsUnderConstruction } from "./ScholarshipsUnderConstruction"
import { ResourceTypeIcon } from "./ResourceTypeIcon"
import type { ScholarshipFilters } from "./filters/scholarshipFilters"
import type { OrganizationFilters } from "./filters/organizationFilters"
import { trackEvent } from "../../utils/analytics"
import { fetchSiteFeatureFlags } from "../../sanity/queries/siteSettings"
import type { ResourceType } from "../../sanity/queries/resourceTypes"
import { getResourceTypeLabel } from "../../sanity/queries/resourceTypes"
import { accentBg } from "../../lib/resourceTypePresentation"

function TypeIcon({ type }: { type: ResourceType }) {
  if (type.iconUrl) {
    return <img src={type.iconUrl} alt="" className="h-full w-full object-contain" />
  }
  return <ResourceTypeIcon icon={type.icon} />
}

interface PlanYourNextStepsSectionProps {
  resourceTypes: ResourceType[]
  activeSections: string[]
}

export function PlanYourNextStepsSection({ resourceTypes, activeSections }: PlanYourNextStepsSectionProps) {
  const { language } = useLanguageStore()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [scholarshipsEnabled, setScholarshipsEnabled] = useState(false)
  const organizationFiltersRef = useRef<OrganizationFilters | null>(null)

  const [scholarshipFilters, setScholarshipFilters] = useState<ScholarshipFilters>({
    searchQuery: ""
  })
  const [organizationFilters, setOrganizationFilters] = useState<OrganizationFilters>({
    searchQuery: "",
    selectedMembershipTypes: [],
    selectedGeographicFocus: [],
    selectedCareerAreas: []
  })
  const [genericSearch, setGenericSearch] = useState<Record<string, string>>({})
  const [hubFilters, setHubFilters] = useState<Record<string, HubFacetFilters>>({})

  const setCount = (slug: string, count: number) => {
    setCounts((prev) => (prev[slug] === count ? prev : { ...prev, [slug]: count }))
  }

  useEffect(() => {
    const query = scholarshipFilters.searchQuery.trim()
    if (!query) return
    const timer = window.setTimeout(() => {
      trackEvent("resource_search", {
        resource_type: "scholarship",
        query,
        results_count: counts.scholarships ?? 0,
        language
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [counts.scholarships, language, scholarshipFilters.searchQuery])

  useEffect(() => {
    let cancelled = false
    async function loadFeatureFlags() {
      try {
        const flags = await fetchSiteFeatureFlags()
        if (!cancelled) setScholarshipsEnabled(Boolean(flags.scholarshipsEnabled))
      } catch {
        if (!cancelled) setScholarshipsEnabled(false)
      }
    }
    loadFeatureFlags()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const query = organizationFilters.searchQuery.trim()
    if (!query) return
    const timer = window.setTimeout(() => {
      trackEvent("resource_search", {
        resource_type: "professional_organization",
        query,
        results_count: counts.organizations ?? 0,
        language
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [counts.organizations, language, organizationFilters.searchQuery])

  useEffect(() => {
    if (!organizationFiltersRef.current) {
      organizationFiltersRef.current = organizationFilters
      return
    }

    const prev = organizationFiltersRef.current
    const changedKeys: string[] = []

    if (prev.selectedMembershipTypes !== organizationFilters.selectedMembershipTypes) {
      changedKeys.push("membership_types")
    }
    if (prev.selectedGeographicFocus !== organizationFilters.selectedGeographicFocus) {
      changedKeys.push("geographic_focus")
    }
    if (prev.selectedCareerAreas !== organizationFilters.selectedCareerAreas) {
      changedKeys.push("career_areas")
    }

    if (changedKeys.length > 0) {
      trackEvent("resource_filter_apply", {
        resource_type: "professional_organization",
        filter_keys: changedKeys.join(","),
        results_count: counts.organizations ?? 0,
        language
      })
    }

    organizationFiltersRef.current = organizationFilters
  }, [counts.organizations, language, organizationFilters])

  const visibleTypes = resourceTypes.filter((type) => activeSections.includes(type.slug))

  return (
    <div className="space-y-0">
      {visibleTypes.map((type) => {
        const title = getResourceTypeLabel(language, type)
        const header = (
          <div className="hidden lg:block">
            <SectionHeader
              language={language}
              title={title}
              count={counts[type.slug] ?? 0}
              iconBgColor={accentBg(type.accent)}
              icon={<TypeIcon type={type} />}
              iconAlt={title}
            />
          </div>
        )

        if (type.sourceKind === "scholarship") {
          return (
            <section key={type._id} id={type.slug} className="scroll-mt-8">
              {scholarshipsEnabled ? (
                <>
                  {header}
                  <ResourceSplit
                    sidebar={
                      <FiltersPanel
                        language={language}
                        searchPlaceholderKey="filters.searchKeywordPlaceholder"
                        searchQuery={scholarshipFilters.searchQuery}
                        onSearchChange={(query) => setScholarshipFilters({ searchQuery: query })}
                        showContentDivider={false}
                      />
                    }
                  >
                    <ScholarshipList
                      language={language}
                      filters={scholarshipFilters}
                      onCountChange={(count) => setCount(type.slug, count)}
                    />
                  </ResourceSplit>
                </>
              ) : (
                <ScholarshipsUnderConstruction language={language} />
              )}
            </section>
          )
        }

        if (type.sourceKind === "professionalOrganization") {
          return (
            <section key={type._id} id={type.slug} className="scroll-mt-8">
              {header}
              <ResourceSplit
                sidebar={
                  <FiltersPanel
                    language={language}
                    searchPlaceholderKey="filters.searchKeywordPlaceholder"
                    searchQuery={organizationFilters.searchQuery}
                    onSearchChange={(query) =>
                      setOrganizationFilters((prev) => ({ ...prev, searchQuery: query }))
                    }
                    showSort={false}
                    showContentDivider={false}
                  >
                    <OrganizationFiltersComponent
                      language={language}
                      filters={organizationFilters}
                      onFiltersChange={setOrganizationFilters}
                    />
                  </FiltersPanel>
                }
              >
                <ProfessionalOrganizationList
                  language={language}
                  filters={organizationFilters}
                  onCountChange={(count) => setCount(type.slug, count)}
                />
              </ResourceSplit>
            </section>
          )
        }

        if (type.sourceKind === "educationalInstitution") {
          return (
            <section key={type._id} id={type.slug} className="scroll-mt-8">
              {header}
              <EducationalInstitutionsList
                language={language}
                onCountChange={(count) => setCount(type.slug, count)}
              />
            </section>
          )
        }

        const facets = facetsForSlug(type.slug)
        const typeFilters = hubFilters[type.slug] ?? emptyHubFacetFilters()
        const searchQuery = facets.length > 0 ? typeFilters.searchQuery : (genericSearch[type.slug] ?? "")
        const setTypeFilters = (next: HubFacetFilters) => {
          setHubFilters((prev) => ({ ...prev, [type.slug]: next }))
        }
        return (
          <section key={type._id} id={type.slug} className="scroll-mt-8">
            {header}
            <ResourceSplit
              sidebar={
                <FiltersPanel
                  language={language}
                  searchPlaceholderKey="filters.searchKeywordPlaceholder"
                  searchQuery={searchQuery}
                  onSearchChange={(query) => {
                    if (facets.length > 0) {
                      setTypeFilters({ ...typeFilters, searchQuery: query })
                    } else {
                      setGenericSearch((prev) => ({ ...prev, [type.slug]: query }))
                    }
                    const trimmed = query.trim()
                    if (!trimmed) return
                    window.setTimeout(() => {
                      trackEvent("resource_search", {
                        resource_type: type.slug,
                        query: trimmed,
                        results_count: counts[type.slug] ?? 0,
                        language
                      })
                    }, 400)
                  }}
                  showSort={facets.length > 0}
                  showContentDivider={false}
                  sortChildren={
                    facets.length > 0 ? (
                      <HubSortOptions
                        language={language}
                        filters={typeFilters}
                        onFiltersChange={setTypeFilters}
                        showDeadline={type.slug !== "teacher-materials"}
                      />
                    ) : null
                  }
                >
                  {facets.length > 0 ? (
                    <HubFacetFiltersPanel
                      language={language}
                      groups={facets}
                      filters={typeFilters}
                      onFiltersChange={setTypeFilters}
                    />
                  ) : null}
                </FiltersPanel>
              }
            >
              <HubResourceList
                language={language}
                resourceType={type}
                searchQuery={searchQuery}
                facetFilters={facets.length > 0 ? typeFilters : undefined}
                onCountChange={(count) => setCount(type.slug, count)}
              />
            </ResourceSplit>
          </section>
        )
      })}
    </div>
  )
}
