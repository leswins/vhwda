import React, { useEffect, useRef, useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { OrganizationFilters as OrganizationFiltersComponent } from "./OrganizationFilters"
import { ScholarshipList } from "./ScholarshipList"
import { ProfessionalOrganizationList } from "./ProfessionalOrganizationList"
import { EducationalInstitutionsList } from "./EducationalInstitutionsList"
import { HubResourceList } from "./HubResourceList"
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

type FiltersPanelProps = {
  language: Language
  searchPlaceholderKey: "filters.searchKeywordPlaceholder"
  searchQuery: string
  onSearchChange: (query: string) => void
  children?: React.ReactNode
  showSort?: boolean
  showContentDivider?: boolean
}

function FiltersPanel({
  language,
  searchPlaceholderKey,
  searchQuery,
  onSearchChange,
  children,
  showSort = true,
  showContentDivider = true
}: FiltersPanelProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter")
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false)

  return (
    <div className="flex flex-col lg:h-full lg:border-b-0 lg:border-r-[0.5px] lg:border-foreground">
      <div className="sticky top-0 z-10 bg-surface shrink-0">
        <div className="relative flex items-center gap-0 p-5 border-b-[0.5px] border-foreground lg:border-y-0 lg:gap-fluid-20 lg:px-fluid-25 lg:py-fluid-25 lg:h-[72px] lg:border-b-[0.5px] lg:border-foreground">
          <div
            className={`flex items-center gap-fluid-20 transition-opacity duration-300 ${isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <button
              onClick={() => {
                setActiveTab("filter")
                setShowFiltersOnMobile((prev) => (activeTab === "filter" ? !prev : true))
              }}
              className={`text-body-base lg:text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "filter" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
            >
              {t(language, "filters.filter")}
            </button>
            {showSort && (
              <>
                <div className="h-fluid-20 w-[0.5px] bg-foreground" />
                <button
                  onClick={() => {
                    setActiveTab("sort")
                    setShowFiltersOnMobile((prev) => (activeTab === "sort" ? !prev : true))
                  }}
                  className={`text-body-base lg:text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "sort" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
                >
                  {t(language, "filters.sort")}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setIsSearchActive(true)
            }}
            className={`ml-auto pl-4 lg:pl-0 transition-opacity duration-300 ${isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label={t(language, "filters.search")}
          >
            <svg className="h-5 w-5 lg:h-5 lg:w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div
            className={`absolute inset-0 flex items-center gap-1 p-5 lg:p-0 lg:px-fluid-25 transition-opacity duration-300 ${isSearchActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <input
              type="text"
              placeholder={t(language, searchPlaceholderKey)}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus={isSearchActive}
              className="flex-1 border-0 bg-transparent py-0 text-body-xs lg:text-body-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
            />
            <button
              onClick={() => setIsSearchActive(false)}
              className="shrink-0"
              aria-label={t(language, "filters.search")}
            >
              <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.79541 0.795532L15.7954 15.7955M0.79541 15.7955L15.7954 0.795532" stroke="rgb(var(--color-accent-orange))" strokeWidth="2.25" />
              </svg>
            </button>
          </div>
        </div>
        {showContentDivider && <div className="h-[0.5px] w-full bg-foreground mt-fluid-2 lg:mt-0 lg:hidden" />}
      </div>

      <div
        className={`flex flex-col gap-0 p-5 border-b-[0.5px] border-foreground lg:gap-fluid-25 lg:p-fluid-25 lg:border-b-0 overflow-y-auto flex-1 scrollbar-hide ${showFiltersOnMobile && !isSearchActive ? "" : "hidden lg:flex"}`}
      >
        {activeTab === "filter" && !isSearchActive ? children : null}
      </div>
    </div>
  )
}

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
                  <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] lg:h-[800px] lg:min-h-[calc(95vh-75px)] border-b border-foreground lg:border-b-[0.5px]">
                    <div className="lg:sticky lg:top-0 lg:h-full">
                      <FiltersPanel
                        language={language}
                        searchPlaceholderKey="filters.searchKeywordPlaceholder"
                        searchQuery={scholarshipFilters.searchQuery}
                        onSearchChange={(query) => setScholarshipFilters({ searchQuery: query })}
                        showContentDivider={false}
                      />
                    </div>
                    <div className="p-5 lg:p-fluid-50 lg:h-full lg:overflow-y-auto lg:scrollbar-hide">
                      <ScholarshipList
                        language={language}
                        filters={scholarshipFilters}
                        onCountChange={(count) => setCount(type.slug, count)}
                      />
                    </div>
                  </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] lg:h-[800px] lg:min-h-[calc(95vh-75px)] border-b border-foreground lg:border-b-[0.5px]">
                <div className="lg:sticky lg:top-0 lg:h-full">
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
                </div>
                <div className="p-5 lg:p-fluid-50 lg:h-full lg:overflow-y-auto lg:scrollbar-hide">
                  <ProfessionalOrganizationList
                    language={language}
                    filters={organizationFilters}
                    onCountChange={(count) => setCount(type.slug, count)}
                  />
                </div>
              </div>
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

        const searchQuery = genericSearch[type.slug] ?? ""
        return (
          <section key={type._id} id={type.slug} className="scroll-mt-8">
            {header}
            <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] lg:h-[800px] lg:min-h-[calc(95vh-75px)] border-b border-foreground lg:border-b-[0.5px]">
              <div className="lg:sticky lg:top-0 lg:h-full">
                <FiltersPanel
                  language={language}
                  searchPlaceholderKey="filters.searchKeywordPlaceholder"
                  searchQuery={searchQuery}
                  onSearchChange={(query) => {
                    setGenericSearch((prev) => ({ ...prev, [type.slug]: query }))
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
                  showSort={false}
                  showContentDivider={false}
                />
              </div>
              <div className="p-5 lg:p-fluid-50 lg:h-full lg:overflow-y-auto lg:scrollbar-hide">
                <HubResourceList
                  language={language}
                  resourceType={type}
                  searchQuery={searchQuery}
                  onCountChange={(count) => setCount(type.slug, count)}
                />
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
