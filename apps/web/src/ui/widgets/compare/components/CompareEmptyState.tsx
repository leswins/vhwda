import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { CareerSearchInput } from "./CareerSearchInput"

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
    <div className="overflow-x-auto overflow-y-visible">
      <div className="min-w-full border border-foreground">
        <div className="grid border-b border-foreground" style={{ gridTemplateColumns: "200px 1fr" }}>
          <div className="flex items-start border-r border-foreground bg-surface1 p-4 font-semibold">
            Category
          </div>
          <div className="relative border-l border-foreground bg-surface1 p-4" style={{ minWidth: "200px" }}>
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
          </div>
        </div>

        {CATEGORIES.map((categoryKey, idx) => (
          <div
            key={categoryKey}
            className={`grid ${idx === CATEGORIES.length - 1 ? "" : "border-b border-foreground"}`}
            style={{ gridTemplateColumns: "200px 1fr" }}
          >
            <div className="flex items-start border-r border-foreground bg-surface1 p-4 font-semibold">
              {t(language, categoryKey)}
            </div>
            <div className="flex items-start border-l border-foreground p-4">
              <p className="text-foreground/60">{t(language, "compare.addCareerToCompare")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

