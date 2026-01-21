

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
  const { addCareer, removeCareer, careerIds } = useCompareStore()

  const [isSearchActive, setIsSearchActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter")
  const [isCategoryGroupExpanded, setIsCategoryGroupExpanded] = useState(false)

  const [sortBy, setSortBy] = useState<"education" | "salary" | "outlook" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
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

  const filteredCareersBase = useMemo(
    () => applyFilters(careers, filters, language),
    [careers, filters, language]
  )

  const filteredCareers = useMemo(() => {
    if (!sortBy) return filteredCareersBase

    const sorted = [...filteredCareersBase].sort((a, b) => {
      if (sortBy === "education") {
        const educationOrder: Record<string, number> = {
          "FF": 0,
          "CSC": 1,
          "CERT": 2,
          "AAS": 3,
          "BACH": 4,
          "GRAD": 5
        }
        const aVal = a.educationMin ? (educationOrder[a.educationMin] ?? 999) : 999
        const bVal = b.educationMin ? (educationOrder[b.educationMin] ?? 999) : 999
        return sortDirection === "desc" ? bVal - aVal : aVal - bVal
      } else if (sortBy === "salary") {
        const aSalary = a.salary?.median ?? a.salary?.rangeMin ?? 0
        const bSalary = b.salary?.median ?? b.salary?.rangeMin ?? 0
        return sortDirection === "desc" ? bSalary - aSalary : aSalary - bSalary
      } else if (sortBy === "outlook") {
        const outlookValue: Record<string, number> = {
          "High": 3,
          "Medium": 2,
          "Low": 1
        }
        const aVal = a.outlook?.value ?? (a.outlook?.label ? outlookValue[a.outlook.label] ?? 0 : 0)
        const bVal = b.outlook?.value ?? (b.outlook?.label ? outlookValue[b.outlook.label] ?? 0 : 0)
        return sortDirection === "desc" ? bVal - aVal : aVal - bVal
      }
      return 0
    })

    return sorted
  }, [filteredCareersBase, sortBy, sortDirection])

  const displaySalary = (career: CareerSummaryCard) => {
    return formatMoney(career.salary?.median) ?? formatMoney(career.salary?.rangeMin) ?? undefined
  }

  const categories = Array.from(
    new Set(
      careers
        .flatMap(c => c.categories?.map(cat => cat.title) || [])
        .filter(Boolean)
    )
  ).sort()

  const getCategoryCount = (category: string) => {
    return applyFilters(
      careers.filter(c => c.categories?.some(cat => cat.title === category)),
      { ...filters, selectedCategories: [] },
      language
    ).length
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category]
    setFilters({ ...filters, selectedCategories: newCategories })
  }

  if (loading) {
    return null
  }

  return (
    <div>
      <div className="flex flex-col gap-[15px] p-[50px] border-b border-foreground">
        <p className="text-sub2 font-bold uppercase text-foreground">{t(language, "search.title")}</p>
        <h1 className="text-h2 font-bold text-foreground">{t(language, "search.subtitle")}</h1>
      </div>

      <div className="flex">
        <div className="w-full lg:w-[30%] shrink-0 border-r-[0.5px] border-foreground sticky top-0 h-screen overflow-hidden flex flex-col">
          <div className="sticky top-0 z-10 bg-surface border-b-[0.5px] border-foreground shrink-0">
            <div className="relative flex items-center gap-[20px] p-[25px] h-[72px]">
              <div
                className={`flex items-center gap-[20px] transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
              >
                <button 
                  onClick={() => setActiveTab("filter")}
                  className={`text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "filter" ? 'text-foreground hover:decoration-foreground' : 'text-muted hover:decoration-muted'}`}
                >
                  {t(language, "filters.filter")}
                </button>
                <div className="h-[20px] w-[0.5px] bg-foreground" />
                <button 
                  onClick={() => setActiveTab("sort")}
                  className={`text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "sort" ? 'text-foreground hover:decoration-foreground' : 'text-muted hover:decoration-muted'}`}
                >
                  {t(language, "filters.sort")}
                </button>
              </div>

              <button
                onClick={() => setIsSearchActive(true)}
                className={`ml-auto transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                aria-label="Open search"
              >
                <svg
                  className="h-5 w-5 text-foreground"
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
              </button>

              <div
                className={`absolute inset-0 flex items-center gap-3 px-[25px] transition-opacity duration-300 ${isSearchActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <input
                  type="text"
                  placeholder={t(language, "search.placeholder")}
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  autoFocus={isSearchActive}
                  className="flex-1 border-0 bg-transparent py-1 text-body-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
                />
                <button
                  onClick={() => setIsSearchActive(false)}
                  className="shrink-0"
                  aria-label="Close search"
                >
                  <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.79541 0.795532L15.7954 15.7955M0.79541 15.7955L15.7954 0.795532" stroke="#F95007" strokeWidth="2.25" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[25px] p-[25px] overflow-y-auto flex-1 scrollbar-hide">
            {activeTab === "sort" && (
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[15px]">
                  <span className="text-h5 font-bold text-foreground">{t(language, "filters.sort.requiredEducation")}</span>
                  <div className="flex flex-col gap-[15px]">
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "education" && sortDirection === "desc"}
                          onChange={() => {
                            if (sortBy === "education" && sortDirection === "desc") {
                              setSortBy(null)
                            } else {
                              setSortBy("education")
                              setSortDirection("desc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "education" && sortDirection === "desc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.mostToLeast")}</span>
                    </label>
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "education" && sortDirection === "asc"}
                          onChange={() => {
                            if (sortBy === "education" && sortDirection === "asc") {
                              setSortBy(null)
                            } else {
                              setSortBy("education")
                              setSortDirection("asc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "education" && sortDirection === "asc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.leastToMost")}</span>
                    </label>
                  </div>
                </div>

                <div className="h-[0.5px] w-full bg-foreground shrink-0" />

                <div className="flex flex-col gap-[15px]">
                  <span className="text-h5 font-bold text-foreground">{t(language, "filters.sort.salaryRange")}</span>
                  <div className="flex flex-col gap-[15px]">
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "salary" && sortDirection === "desc"}
                          onChange={() => {
                            if (sortBy === "salary" && sortDirection === "desc") {
                              setSortBy(null)
                            } else {
                              setSortBy("salary")
                              setSortDirection("desc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "salary" && sortDirection === "desc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.highToLow")}</span>
                    </label>
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "salary" && sortDirection === "asc"}
                          onChange={() => {
                            if (sortBy === "salary" && sortDirection === "asc") {
                              setSortBy(null)
                            } else {
                              setSortBy("salary")
                              setSortDirection("asc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "salary" && sortDirection === "asc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.lowToHigh")}</span>
                    </label>
                  </div>
                </div>

                <div className="h-[0.5px] w-full bg-foreground shrink-0" />

                <div className="flex flex-col gap-[15px]">
                  <span className="text-h5 font-bold text-foreground">{t(language, "filters.sort.jobOutlook")}</span>
                  <div className="flex flex-col gap-[15px]">
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "outlook" && sortDirection === "desc"}
                          onChange={() => {
                            if (sortBy === "outlook" && sortDirection === "desc") {
                              setSortBy(null)
                            } else {
                              setSortBy("outlook")
                              setSortDirection("desc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "outlook" && sortDirection === "desc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.highToLow")}</span>
                    </label>
                    <label className="flex items-center gap-[15px] cursor-pointer">
                      <div className="relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={sortBy === "outlook" && sortDirection === "asc"}
                          onChange={() => {
                            if (sortBy === "outlook" && sortDirection === "asc") {
                              setSortBy(null)
                            } else {
                              setSortBy("outlook")
                              setSortDirection("asc")
                            }
                          }}
                          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                        />
                        {sortBy === "outlook" && sortDirection === "asc" && (
                          <svg
                            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 10L8 14L16 6" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body-base font-medium text-foreground">{t(language, "filters.sort.lowToHigh")}</span>
                    </label>
                  </div>
                </div>

                <div className="h-[0.5px] w-full bg-foreground shrink-0" />
              </div>
            )}
            {activeTab === "filter" && (
              <>
            <div className="flex flex-col gap-[20px]">
              <button
                onClick={() => setIsCategoryGroupExpanded(!isCategoryGroupExpanded)}
                className="flex w-full items-center justify-between gap-[10px]"
              >
                <span className="text-h5 font-bold text-foreground">{t(language, "filters.careerGroup")}</span>
                {isCategoryGroupExpanded ? (
                  <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2" />
                  </svg>
                )}
              </button>
              {isCategoryGroupExpanded && (
                <div className="flex flex-col gap-[15px]">
                  {categories.map(category => {
                    const count = getCategoryCount(category)
                    const isDisabled = count === 0
                    return (
                      <label
                        key={category}
                        className={`flex items-center gap-[15px] ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="relative h-5 w-5 shrink-0">
                          <input
                            type="checkbox"
                            checked={filters.selectedCategories.includes(category)}
                            onChange={() => !isDisabled && handleCategoryToggle(category)}
                            disabled={isDisabled}
                            className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1 disabled:opacity-50"
                          />
                          {filters.selectedCategories.includes(category) && !isDisabled && (
                            <svg
                              className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M4 10L8 14L16 6" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-body-base font-medium ${isDisabled ? 'text-onSurfaceDisabled' : 'text-foreground'}`}>
                          {category} ({count})
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="h-[0.5px] w-full bg-foreground shrink-0" />

            <CareerFilters
              language={language}
              careers={careers}
              filters={filters}
              onFiltersChange={setFilters}
            />
            </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[70%] flex flex-col">
          <div className="sticky top-0 z-20 bg-surface/85 backdrop-blur-[10px] border-b-[0.5px] border-foreground">
            <div className="flex items-center justify-between p-[25px] h-[72px]">
              <p className="text-body-base font-medium text-foreground">
                {filteredCareers.length === 1
                  ? t(language, "search.showing").replace("{count}", "1")
                  : t(language, "search.showingPlural").replace("{count}", filteredCareers.length.toString())}
              </p>
              <Link
                to="/compare"
                className="text-body-base font-medium text-foreground hover:underline hover:underline-offset-4 hover:decoration-foreground"
              >
                {careerIds.length > 0
                  ? `${t(language, "search.compare")} ${careerIds.length} ${careerIds.length === 1 ? t(language, "search.career").toLowerCase() : t(language, "search.careers").toLowerCase()}`
                  : t(language, "search.compareCareers")}
              </Link>
            </div>
          </div>

          {filteredCareers.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-foreground/60">{t(language, "search.noCareers")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-surface">
              {filteredCareers.map(career => {
                const title = getLocalizedString(language, career.title) || ""
                const salary = displaySalary(career)
                const isInCompare = careerIds.includes(career._id)
                const canAddToCompare = !isInCompare && careerIds.length < 4

                const handleToggleCompare = () => {
                  if (isInCompare) {
                    removeCareer(career._id)
                  } else {
                    addCareer(career._id)
                  }
                }

                return (
                  <div key={career._id} className="bg-surface border-r-[0.5px] border-b-[0.5px] border-foreground last:border-b-0 lg:last:border-b-0 lg:[&:nth-last-child(2)]:border-b-0">
                    <CareerCard
                      language={language}
                      title={title}
                      salary={salary}
                      to={`/careers/${career.slug || career._id}`}
                      imageUrl={career.imageUrl}
                      videoUrl={career.videoUrl}
                      isInCompare={isInCompare}
                      canAddToCompare={canAddToCompare}
                      onToggleCompare={handleToggleCompare}
                    />
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
