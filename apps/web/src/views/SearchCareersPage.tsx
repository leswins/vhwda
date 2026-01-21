/**
 * SearchCareersPage Component
 * 
 * Main page for browsing and filtering healthcare careers. Features:
 * - Sticky left sidebar with collapsible filters (30% width on large screens)
 * - Two-column career card grid on the right (70% width on large screens)
 * - Real-time filtering with search, categories, education, salary, outlook, etc.
 * - Compare functionality (up to 4 careers)
 * - Localized content (English/Spanish)
 * 
 * Layout Structure:
 * - Page Header: Title, subtitle, and CTA button
 * - Main Content:
 *   - Left: Sticky filter sidebar with search bar and collapsible filter groups
 *   - Right: Career cards grid with sticky header showing count and compare link
 */

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

/**
 * FilterState type defines all available filter options
 * Used for client-side filtering of career data
 */
type FilterState = {
  searchQuery: string // Text search for career titles
  selectedCategories: string[] // Career group categories (e.g., "Nursing", "Therapy")
  selectedEducation: string[] // Education level requirements (e.g., "FF", "AAS", "BACH")
  salaryRange: { min?: number; max?: number } // Salary range filter
  selectedOutlook: string[] // Job outlook (High, Medium, Low)
  selectedWorkEnvironments: string[] // Work settings (hospital, clinic, etc.)
  patientFacing: "yes" | "no" | null // Patient interaction preference
  selectedSpecializations: string[] // Areas of specialization (coming soon)
}

/**
 * Formats a number as US currency with no decimal places
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$50,000") or undefined
 */
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

/**
 * Applies all active filters to the careers array
 * Filters are applied in sequence (AND logic) to progressively narrow results
 * 
 * @param careers - Full array of career data from Sanity
 * @param filters - Current filter state from user selections
 * @param language - Current UI language for localized string matching
 * @returns Filtered array of careers matching all active filter criteria
 */
function applyFilters(careers: CareerSummaryCard[], filters: FilterState, language: "en" | "es"): CareerSummaryCard[] {
  let filtered = [...careers]

  // Text search filter: matches career titles (case-insensitive, localized)
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(career => {
      const title = getLocalizedString(language, career.title)?.toLowerCase() || ""
      return title.includes(query)
    })
  }

  // Category filter: matches careers belonging to selected career groups
  if (filters.selectedCategories.length > 0) {
    filtered = filtered.filter(career =>
      career.categories?.some(cat => filters.selectedCategories.includes(cat.title))
    )
  }

  // Education filter: matches careers by minimum education requirement
  if (filters.selectedEducation.length > 0) {
    filtered = filtered.filter(career => {
      if (!career.educationMin) return false
      return filters.selectedEducation.includes(career.educationMin)
    })
  }

  // Salary minimum filter: uses rangeMin or median as fallback
  if (filters.salaryRange.min !== undefined) {
    filtered = filtered.filter(career => {
      const salary = career.salary?.rangeMin ?? career.salary?.median
      return salary !== undefined && salary >= filters.salaryRange.min!
    })
  }

  // Salary maximum filter: uses rangeMax or median as fallback
  if (filters.salaryRange.max !== undefined) {
    filtered = filtered.filter(career => {
      const salary = career.salary?.rangeMax ?? career.salary?.median
      return salary !== undefined && salary <= filters.salaryRange.max!
    })
  }

  // Job outlook filter: matches careers by growth outlook (High, Medium, Low)
  if (filters.selectedOutlook.length > 0) {
    filtered = filtered.filter(career => {
      if (!career.outlook?.label) return false
      return filters.selectedOutlook.includes(career.outlook.label)
    })
  }

  // Work environment filter: uses quiz vector data (value >= 1 indicates match)
  // Maps UI-friendly names to vector field names in career data
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

  // Patient interaction filter: uses quiz vector data
  // value >= 1: patient-facing, value <= -1: non-patient-facing
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
  // Global stores for language, career data, and comparison list
  const { language } = useLanguageStore()
  const { careers, loading, fetchCareers } = useCareersStore()
  const { addCareer, removeCareer, careerIds } = useCompareStore()

  // UI state for search bar toggle and collapsible sections
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isCategoryGroupExpanded, setIsCategoryGroupExpanded] = useState(false)

  // Filter state: tracks all user-selected filter criteria
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

  // Fetch career data on mount
  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  // Memoized filtered results: recomputes only when careers, filters, or language changes
  const filteredCareers = useMemo(
    () => applyFilters(careers, filters, language),
    [careers, filters, language]
  )

  /**
   * Helper: Extracts displayable salary from career data
   * Prefers median, falls back to rangeMin
   */
  const displaySalary = (career: CareerSummaryCard) => {
    return formatMoney(career.salary?.median) ?? formatMoney(career.salary?.rangeMin) ?? undefined
  }

  /**
   * Memoized list of all unique career categories (sorted alphabetically)
   * Used to populate the "Career Group" filter checkboxes
   */
  const categories = Array.from(
    new Set(
      careers
        .flatMap(c => c.categories?.map(cat => cat.title) || [])
        .filter(Boolean)
    )
  ).sort()

  /**
   * Gets the count of careers in a category after applying other filters
   * Used to show "(X)" next to each category and disable empty categories
   * Excludes the category filter itself to show total available in that category
   */
  const getCategoryCount = (category: string) => {
    return applyFilters(
      careers.filter(c => c.categories?.some(cat => cat.title === category)),
      { ...filters, selectedCategories: [] },
      language
    ).length
  }

  /**
   * Toggles a category filter on/off
   * Adds if not present, removes if already selected
   */
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category]
    setFilters({ ...filters, selectedCategories: newCategories })
  }

  // Loading state: Don't render page content while loading - global loading overlay will show
  if (loading) {
    return null
  }

  return (
    <div>
      {/* Page Header: Title and subtitle with bottom border */}
      <div className="flex flex-col gap-[15px] p-[50px] border-b border-foreground">
        <p className="text-sub2 font-bold uppercase text-foreground">{t(language, "search.title")}</p>
        <h1 className="text-h2 font-bold text-foreground">{t(language, "search.subtitle")}</h1>
      </div>

      {/* Main Content Area: Two-column layout (filters left, careers right) */}
      <div className="flex">
        {/* 
          Left Sidebar: Filters and Search
          - Sticky to viewport (h-screen, sticky top-0)
          - 30% width on large screens
          - Vertically scrollable content area with hidden scrollbar
          - Fixed header with Filter/Sort/Search controls
        */}
        <div className="w-full lg:w-[30%] shrink-0 border-r-[0.5px] border-foreground sticky top-0 h-screen overflow-hidden flex flex-col">
          {/* 
            Filter Header (Fixed at top of sidebar)
            - Contains Filter/Sort buttons and Search toggle
            - Uses absolute positioning for smooth fade transition between states
            - shrink-0 prevents this header from being compressed by flex layout
            - Height set to 72px to match right column header
          */}
          <div className="sticky top-0 z-10 bg-surface border-b-[0.5px] border-foreground shrink-0">
            <div className="relative flex items-center gap-[20px] p-[25px] h-[72px]">
              {/* Default state: Filter and Sort buttons with vertical divider */}
              <div
                className={`flex items-center gap-[20px] transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
              >
                <button className="text-body-base font-medium text-foreground hover:underline hover:underline-offset-4 hover:decoration-foreground">
                  {t(language, "filters.filter")}
                </button>
                <div className="h-[20px] w-[0.5px] bg-foreground" />
                <button className="text-body-base font-medium text-muted hover:underline hover:underline-offset-4 hover:decoration-muted">
                  {t(language, "filters.sort")}
                </button>
              </div>

              {/* Search icon: triggers search mode, fades out when active */}
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

              {/* 
                Search state: Input field and close button
                - Positioned absolutely to overlay the default buttons
                - Fades in when isSearchActive is true
                - Auto-focuses input when activated
              */}
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

          {/* 
            Filter Content Area (Scrollable)
            - flex-1 takes remaining vertical space
            - overflow-y-auto enables vertical scrolling
            - scrollbar-hide class (from globals.css) hides the scrollbar for cleaner look
            - Contains collapsible filter groups
          */}
          <div className="flex flex-col gap-[25px] p-[25px] overflow-y-auto flex-1 scrollbar-hide">
            {/* 
              Career Group Filter (Collapsible)
              - First filter section in the sidebar
              - Shows career categories with result counts
              - Disables categories with 0 matching results
            */}
            <div className="flex flex-col gap-[20px]">
              <button
                onClick={() => setIsCategoryGroupExpanded(!isCategoryGroupExpanded)}
                className="flex w-full items-center justify-between gap-[10px]"
              >
                <span className="text-h5 font-bold text-foreground">{t(language, "filters.careerGroup")}</span>
                {/* Toggle icon: minus when expanded, plus when collapsed */}
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
              {/* Category checkboxes: only rendered when expanded */}
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
                          {/* Custom checkmark SVG: only shown when checked and enabled */}
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

            {/* 
              Horizontal divider between filter sections
              - shrink-0 prevents flexbox from compressing this 0.5px line
              - Critical for maintaining visibility when sections expand/collapse
            */}
            <div className="h-[0.5px] w-full bg-foreground shrink-0" />

            {/* CareerFilters component: Contains remaining filter groups (education, salary, etc.) */}
            <CareerFilters
              language={language}
              careers={careers}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>

        {/* 
          Right Column: Career Cards Grid
          - 70% width on large screens
          - Scrolls independently while left sidebar stays fixed
        */}
        <div className="w-full lg:w-[70%] flex flex-col">
          {/* 
            Sticky Header Bar
            - Shows result count and compare link
            - Stays at top when scrolling through careers
            - Semi-transparent background with blur for visual hierarchy
            - Nested structure (outer div with border, inner div with h-72px) matches left header
          */}
          <div className="sticky top-0 z-20 bg-surface/85 backdrop-blur-[10px] border-b-[0.5px] border-foreground">
            <div className="flex items-center justify-between p-[25px] h-[72px]">
              {/* Result count: Uses singular/plural based on count */}
              <p className="text-body-base font-medium text-foreground">
                {filteredCareers.length === 1
                  ? t(language, "search.showing").replace("{count}", "1")
                  : t(language, "search.showingPlural").replace("{count}", filteredCareers.length.toString())}
              </p>
              {/* 
                Compare link: Grammar-aware text
                - Shows "Compare 1 career" (singular) or "Compare X careers" (plural)
                - Only shows count when careers are selected, otherwise generic "Compare careers"
              */}
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

          {/* Empty state: shown when no careers match filters */}
          {filteredCareers.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-foreground/60">{t(language, "search.noCareers")}</p>
            </div>
          ) : (
            /* 
              Career Cards Grid:
              - 1 column on mobile, 2 columns on large screens
              - Cards are wrapped in divs that handle borders/dividers
              - CareerCard component handles internal layout and interactions
            */
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

                /* 
                  Card wrapper with grid dividers:
                  - border-r-[0.5px]: vertical divider between columns
                  - border-b-[0.5px]: horizontal divider between rows
                  - last:border-b-0: removes bottom border from last card (mobile)
                  - lg:last:border-b-0: removes bottom border from last card (desktop)
                  - lg:[&:nth-last-child(2)]:border-b-0: removes bottom border from 2nd-to-last card
                    (handles last row in 2-column layout when even number of cards)
                  - Cards themselves have NO borders; dividers create the grid effect
                */
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

/**
 * Recent Changes Summary:
 * 
 * 1. Sticky Filter Sidebar (Left Column):
 *    - Made entire sidebar sticky with h-screen and overflow-hidden
 *    - Filter content area is scrollable with hidden scrollbar (scrollbar-hide class)
 *    - Header remains fixed at top with shrink-0 to prevent compression
 * 
 * 2. Layout Alignment:
 *    - Removed space-y-6 from page container to eliminate unwanted margins
 *    - Restructured right header to match left header height (nested div structure)
 *    - Both headers now have consistent 72px content height + 0.5px border
 * 
 * 3. Border & Divider System:
 *    - Removed borders from main content container
 *    - Card wrappers create grid effect with right/bottom borders
 *    - Last row borders hidden (last:border-b-0, etc.) for clean bottom edge
 *    - Added shrink-0 to all 0.5px dividers to prevent compression
 * 
 * 4. Grammar & Localization:
 *    - Added singular "career" translation for proper grammar
 *    - Compare link uses singular/plural appropriately (1 career vs X careers)
 * 
 * 5. Filter Improvements:
 *    - "Patient Interaction Level" shortened to "Patient Interaction"
 *    - All filters properly maintain divider visibility when expanded/collapsed
 */

