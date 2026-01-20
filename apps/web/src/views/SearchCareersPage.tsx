import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useCareersStore } from "../zustand/useCareersStore"
import { useCompareStore } from "../zustand/useCompareStore"
import { t } from "../utils/i18n"
import { CareerFilters } from "../ui/widgets/CareerFilters"
import { CareerCard } from "../ui/widgets/CareerCard"
import { getLocalizedString } from "../sanity/queries/careers"
import type { CareerSummaryCard } from "../sanity/queries/careers"

type FilterState = {
  searchQuery: string
  selectedCategories: string[]
  selectedEducation: string[]
  salaryRange: { min?: number; max?: number }
  selectedOutlook: string[]
  selectedWorkEnvironments: string[]
  patientFacing: "yes" | "no" | null
  selectedSpecializations: string[]
}

function formatMoney(value?: number): string | undefined {
  if (value === undefined || value === null) return undefined
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value)
  } catch {
    return `$${value}`
  }
}

function applyFilters(careers: CareerSummaryCard[], filters: FilterState, language: "en" | "es"): CareerSummaryCard[] {
  let filtered = [...careers]

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(career => {
      const title = getLocalizedString(language, career.title)?.toLowerCase() || ""
      return title.includes(query)
    })
  }

  if (filters.selectedCategories.length > 0) {
    filtered = filtered.filter(career =>
      career.categories?.some(cat => filters.selectedCategories.includes(cat.title))
    )
  }

  if (filters.selectedEducation.length > 0) {
    filtered = filtered.filter(career => {
      if (!career.educationMin) return false
      return filters.selectedEducation.includes(career.educationMin)
    })
  }

  if (filters.salaryRange.min !== undefined) {
    filtered = filtered.filter(career => {
      const salary = career.salary?.rangeMin ?? career.salary?.median
      return salary !== undefined && salary >= filters.salaryRange.min!
    })
  }

  if (filters.salaryRange.max !== undefined) {
    filtered = filtered.filter(career => {
      const salary = career.salary?.rangeMax ?? career.salary?.median
      return salary !== undefined && salary <= filters.salaryRange.max!
    })
  }

  if (filters.selectedOutlook.length > 0) {
    filtered = filtered.filter(career => {
      if (!career.outlook?.label) return false
      return filters.selectedOutlook.includes(career.outlook.label)
    })
  }

  if (filters.selectedWorkEnvironments.length > 0) {
    const envVectorMap: Record<string, keyof NonNullable<CareerSummaryCard["quizVector"]>> = {
      hospital: "w_env_hospital",
      clinic: "w_env_clinic",
      community: "w_env_community",
      school: "w_env_school",
      lab: "w_env_lab",
      office: "w_env_office"
    }

    filtered = filtered.filter(career => {
      if (!career.quizVector) return false
      
      return filters.selectedWorkEnvironments.some(env => {
        const vectorKey = envVectorMap[env]
        if (!vectorKey) return false
        
        const value = career.quizVector?.[vectorKey]
        return value !== undefined && value >= 1
      })
    })
  }

  if (filters.patientFacing !== null) {
    filtered = filtered.filter(career => {
      const value = career.quizVector?.w_patient_facing
      if (value === undefined) return false

      if (filters.patientFacing === "yes") {
        return value >= 1
      } else if (filters.patientFacing === "no") {
        return value <= -1
      }
      
      return false
    })
  }

  return filtered
}

export function SearchCareersPage() {
  const { language } = useLanguageStore()
  const { careers, loading, fetchCareers } = useCareersStore()
  const { addCareer, careerIds } = useCompareStore()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedCategories: [],
    selectedEducation: [],
    salaryRange: {},
    selectedOutlook: [],
    selectedWorkEnvironments: [],
    patientFacing: null,
    selectedSpecializations: []
  })

  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  const filteredCareers = useMemo(
    () => applyFilters(careers, filters, language),
    [careers, filters, language]
  )

  const displaySalary = (career: CareerSummaryCard) => {
    return formatMoney(career.salary?.median) ?? formatMoney(career.salary?.rangeMin) ?? undefined
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="text-h2 font-bold text-foreground">{t(language, "search.title")}</h1>
            <p className="text-body-lg text-foreground">{t(language, "search.subtitle")}</p>
          </div>
          <Link
            to="/quiz"
            className="shrink-0 rounded-md border border-foreground bg-primary px-6 py-3 text-body-base font-bold text-onPrimary hover:bg-primary/90 transition-colors"
          >
            {t(language, "home.hero.quizCTA")}
          </Link>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-body-lg text-muted">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6 py-6">
      <div className="flex items-end justify-between gap-8">
        <div className="space-y-1">
          <p className="text-sub2 font-bold uppercase text-foreground">{t(language, "search.title")}</p>
          <h1 className="text-h2 font-bold text-foreground">{t(language, "search.subtitle")}</h1>
        </div>
        <Link
          to="/quiz"
          className="shrink-0 bg-accentPink/60 px-6 py-3 text-body-lg font-medium text-foreground hover:bg-accentPink/70 transition-colors"
          style={{ lineHeight: "135%", letterSpacing: "-0.025em" }}
        >
          {t(language, "search.quizCTA")}
        </Link>
      </div>
      
      <div className="h-[1px] w-full bg-foreground" />

      <div className="flex gap-8">
        {/* Left column: Filter/Sort/Search - aligned with sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex items-center">
          {!isSearchFocused && !filters.searchQuery && (
            <div className="flex items-center gap-4 shrink-0">
              <button className="text-body-base font-medium text-foreground underline underline-offset-4 decoration-foreground">Filter</button>
              <div className="h-4 w-[1px] bg-foreground/20" />
              <button className="text-body-base font-medium text-muted">Sort</button>
            </div>
          )}
          <div className="relative flex-1 flex items-center min-w-0">
            <input
              type="text"
              placeholder={isSearchFocused || filters.searchQuery ? t(language, "search.placeholder") : ""}
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full border-0 bg-transparent py-1 pr-10 pl-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
            />
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Vertical separator line */}
        <div className="hidden lg:block w-[1px] self-stretch bg-foreground/20 shrink-0" />
        
        {/* Right column: Showing/Compare - aligned with career cards */}
        <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
          <p className="text-body-base font-medium text-foreground">
            {filteredCareers.length === 1
              ? t(language, "search.showing").replace("{count}", "1")
              : t(language, "search.showingPlural").replace("{count}", filteredCareers.length.toString())}
          </p>
          {careerIds.length > 0 && (
            <Link
              to="/compare"
              className="text-body-base font-medium text-foreground underline underline-offset-4 decoration-foreground hover:opacity-80"
            >
              {t(language, "search.compareCareers")}
            </Link>
          )}
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-foreground" />

      <div className="flex gap-8">
        <CareerFilters
          language={language}
          careers={careers}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="flex-1">

          {filteredCareers.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-foreground/60">{t(language, "search.noCareers")}</p>
            </div>
          ) : (
            <div className="flex flex-wrap">
              {filteredCareers.map(career => {
                const title = getLocalizedString(language, career.title) || ""
                const salary = displaySalary(career)
                const isInCompare = careerIds.includes(career._id)

                return (
                  <div key={career._id} className="relative">
                    <CareerCard
                      language={language}
                      title={title}
                      salary={salary}
                      to={`/careers/${career.slug || career._id}`}
                      imageUrl={career.imageUrl}
                    />
                    {!isInCompare && careerIds.length < 4 && (
                      <button
                        onClick={() => addCareer(career._id)}
                        className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-onPrimary hover:bg-primary/90"
                        aria-label={`Add ${title} to compare`}
                      >
                        +
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

