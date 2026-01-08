import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { CareerSearchInput } from "./CareerSearchInput"

interface CompareTableHeaderProps {
  selectedCareers: CareerForCompare[]
  language: Language
  searchQuery: string
  filteredCareers: CareerForCompare[]
  showSearch: boolean
  onRemoveCareer: (id: string) => void
  onSearchChange: (query: string) => void
  onSearchFocus: () => void
  onAddCareer: (id: string) => void
  onClearSearch: () => void
  onEscapeSearch: () => void
}

export function CompareTableHeader({
  selectedCareers,
  language,
  searchQuery,
  filteredCareers,
  showSearch,
  onRemoveCareer,
  onSearchChange,
  onSearchFocus,
  onAddCareer,
  onClearSearch,
  onEscapeSearch,
}: CompareTableHeaderProps) {
  const gridCols = `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}`

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <div className="min-w-full border-b-2 border-foreground">
        <div className="grid gap-0" style={{ gridTemplateColumns: gridCols }}>
          <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
            Category
          </div>

          {selectedCareers.map(career => {
            const title = getLocalizedString(language, career.title) || ""
            return (
              <div
                key={career._id}
                className="flex items-center justify-between border-r border-foreground bg-surface1 p-4 last:border-r-0"
              >
                <span className="font-semibold">{title}</span>
                <button
                  onClick={() => onRemoveCareer(career._id)}
                  className="hover:bg-foreground/10 ml-2 rounded p-1"
                  aria-label={`Remove ${title}`}
                >
                  <span className="text-lg leading-none" aria-hidden="true">×</span>
                </button>
              </div>
            )
          })}

          {selectedCareers.length < 4 && (
            <div className="relative border-l border-foreground bg-surface1 p-4" style={{ minWidth: "200px" }}>
              {!showSearch ? (
                <button
                  onClick={onSearchFocus}
                  className="flex w-full items-center justify-center gap-1 rounded border border-foreground bg-primary px-3 py-2 text-sm font-medium text-onPrimary hover:bg-primary/90"
                >
                  <span className="text-lg leading-none" aria-hidden="true">+</span>
                  {t(language, "compare.addCareer")}
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
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

