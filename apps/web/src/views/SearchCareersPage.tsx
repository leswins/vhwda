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
        <CareerFilters
          language={language}
          careers={careers}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/60">
              {filteredCareers.length === 1
                ? t(language, "search.showing").replace("{count}", "1")
                : t(language, "search.showingPlural").replace("{count}", filteredCareers.length.toString())}
            </p>
            {careerIds.length > 0 && (
              <Link
                to="/compare"
                className="rounded-md border border-foreground bg-surface1 px-4 py-2 text-sm font-medium hover:bg-surface2"
              >
                {t(language, "search.compareCareers")}
              </Link>
            )}
          </div>

          {filteredCareers.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-foreground/60">{t(language, "search.noCareers")}</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
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

