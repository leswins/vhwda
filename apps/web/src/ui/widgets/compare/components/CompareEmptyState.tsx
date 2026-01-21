import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { CareerSearchInput } from "./CareerSearchInput"
import { PlusIcon } from "../../../icons/PlusIcon"

interface CompareEmptyStateProps {
  language: Language
  searchQuery: string
  filteredCareers: CareerForCompare[]
  showSearch: boolean
  onSearchChange: (query: string) => void
  onSearchFocus: () => void
  onAddCareer: (id: string) => void
  onClearSearch: () => void
  onEscapeSearch: () => void
}

const CATEGORIES = [
  "compare.sections.dayToDay",
  "compare.sections.overview",
  "compare.sections.salaryDetails",
  "compare.sections.academicRequirements",
  "compare.sections.jobOutlook",
  "compare.sections.responsibilities",
  "compare.sections.workEnvironments",
  "compare.sections.areasOfSpecialization",
] as const

export function CompareEmptyState({
  language,
  searchQuery,
  filteredCareers,
  showSearch,
  onSearchChange,
  onSearchFocus,
  onAddCareer,
  onClearSearch,
  onEscapeSearch,
}: CompareEmptyStateProps) {
  return (
    <div className="flex flex-col">
      {/* Header row */}
      <div className="flex border-b border-foreground">
        {/* Fixed left: "Career" label */}
        <div className="sticky left-0 z-30 flex w-[250px] shrink-0 items-center bg-surface px-[50px] py-[25px]">
          <span className="text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-lg)]">
            {t(language, "compare.category")}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="sticky left-[250px] z-30 w-[0.5px] shrink-0 bg-foreground" />

        {/* Content area: Search input */}
        <div className="flex-1">
          <div className="flex items-center px-[50px] py-[25px]" style={{ minWidth: "350px" }}>
            {!showSearch ? (
              <button
                onClick={onSearchFocus}
                className="flex items-center gap-[25px] text-[length:var(--text-h5)] font-bold leading-[var(--leading-h5)] tracking-[var(--tracking-h5)] transition-opacity hover:opacity-80"
              >
                <span>{t(language, "compare.addCareer")}</span>
                <span className="text-[rgb(var(--color-accent-green))]">
                  <PlusIcon />
                </span>
              </button>
            ) : (
              <CareerSearchInput
                searchQuery={searchQuery}
                filteredCareers={filteredCareers}
                showSearch={showSearch}
                language={language}
                onSearchChange={onSearchChange}
                onSearchFocus={onSearchFocus}
                onAddCareer={onAddCareer}
                onClear={onClearSearch}
                onEscape={onEscapeSearch}
                showIcon={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content rows */}
      {CATEGORIES.map((categoryKey, idx) => {
        const isLast = idx === CATEGORIES.length - 1
        return (
          <React.Fragment key={categoryKey}>
            <div className="flex">
              {/* Fixed left: category label */}
              <div className="sticky left-0 z-10 flex w-[250px] shrink-0 items-start bg-surface px-[50px] py-[50px]">
                <span className="text-[length:var(--text-h5)] font-bold leading-[var(--leading-h5)] tracking-[var(--tracking-h5)]">
                  {t(language, categoryKey)}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="sticky left-[250px] z-10 w-[0.5px] shrink-0 bg-foreground" />

              {/* Content area: placeholder */}
              <div className="flex-1">
                <div className="flex items-start px-[50px] py-[50px]" style={{ minWidth: "350px" }}>
                  <p className="text-foreground/60 text-[length:var(--text-body-base)]">
                    {t(language, "compare.addCareerToCompare")}
                  </p>
                </div>
              </div>
            </div>
            {!isLast && (
              <div className="flex">
                <div className="sticky left-0 z-10 w-[250px] shrink-0 bg-surface px-[50px]">
                  <div className="h-[0.5px] w-full bg-foreground" />
                </div>
                <div className="sticky left-[250px] z-10 w-[0.5px] shrink-0 bg-foreground" />
                <div className="flex-1">
                  <div className="px-[50px]">
                    <div className="h-[0.5px] w-full bg-foreground" />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

