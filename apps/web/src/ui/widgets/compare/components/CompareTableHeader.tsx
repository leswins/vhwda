import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { CareerSearchInput } from "./CareerSearchInput"
import { CloseIcon } from "../../../icons/CloseIcon"
import { PlusIcon } from "../../../icons/PlusIcon"

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
  return (
    <div className="flex border-b border-foreground bg-surface">
      {/* Fixed left: "Career" label */}
      <div className="sticky left-0 z-30 flex w-[250px] shrink-0 items-center bg-surface px-[50px] py-[25px]">
        <span className="text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-lg)]">
          {t(language, "compare.category")}
        </span>
      </div>

      {/* Vertical divider */}
      <div className="sticky left-[250px] z-30 w-[0.5px] shrink-0 bg-foreground" />

      {/* Content: Career titles and add button */}
      <div className="flex gap-[50px] pl-[50px] pr-[50px] py-[25px]">
        {selectedCareers.map((career, idx) => {
          const title = getLocalizedString(language, career.title) || ""
          const isLast = idx === selectedCareers.length - 1
          return (
            <React.Fragment key={career._id}>
              <div className="flex w-[300px] shrink-0 items-center gap-[25px]">
                <span className="text-[length:var(--text-h5)] font-bold leading-[var(--leading-h5)] tracking-[var(--tracking-h5)]">
                  {title}
                </span>
                <button
                  onClick={() => onRemoveCareer(career._id)}
                  className="shrink-0 text-[rgb(var(--color-accent-orange))] transition-opacity hover:opacity-80"
                  aria-label={`Remove ${title}`}
                >
                  <CloseIcon />
                </button>
              </div>
              {!isLast && <div className="h-full w-[0.5px] shrink-0 bg-foreground" />}
            </React.Fragment>
          )
        })}

        {selectedCareers.length < 4 && (
          <>
            <div className="h-full w-[0.5px] shrink-0 bg-foreground" />
            <div className={`flex shrink-0 items-center ${showSearch ? 'w-[350px]' : 'w-[300px]'}`} style={{ minWidth: showSearch ? "350px" : "200px" }}>
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
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

