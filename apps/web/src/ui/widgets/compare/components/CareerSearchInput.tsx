import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import type { Language } from "../../../../utils/i18n"

interface CareerSearchInputProps {
  searchQuery: string
  filteredCareers: CareerForCompare[]
  showSearch: boolean
  language: Language
  onSearchChange: (query: string) => void
  onSearchFocus: () => void
  onAddCareer: (id: string) => void
  onClear: () => void
  onEscape: () => void
  placeholder?: string
  showIcon?: boolean
}

export function CareerSearchInput({
  searchQuery,
  filteredCareers,
  showSearch,
  language,
  onSearchChange,
  onSearchFocus,
  onAddCareer,
  onClear,
  onEscape,
  placeholder,
  showIcon = false,
}: CareerSearchInputProps) {
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={placeholder || t(language, "compare.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value)
              onSearchFocus()
            }}
            onFocus={onSearchFocus}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onEscape()
              }
            }}
            className={`w-full rounded border border-foreground bg-surface2 px-3 py-2 text-sm focus:border-foreground focus:outline-none${showIcon ? " pl-9" : ""}`}
          />
          {showIcon && (
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        {searchQuery && (
          <button
            onClick={onClear}
            className="rounded p-1 hover:bg-foreground/10"
            aria-label="Clear search"
          >
            <span className="text-lg leading-none" aria-hidden="true">×</span>
          </button>
        )}
      </div>
      {showSearch && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-64 overflow-y-auto rounded-md border border-foreground bg-surface1 shadow-2xl">
          {filteredCareers.length > 0 ? (
            filteredCareers.map(career => {
              const title = getLocalizedString(language, career.title) || ""
              return (
                <button
                  key={career._id}
                  onClick={() => onAddCareer(career._id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface2 focus:bg-surface2 focus:outline-none"
                  type="button"
                >
                  <span className="text-sm font-medium">{title}</span>
                  <span className="ml-2 text-lg leading-none text-primary" aria-hidden="true">+</span>
                </button>
              )
            })
          ) : searchQuery ? (
            <div className="px-4 py-3 text-sm text-foreground/60">
              {t(language, "compare.noCareersFound")}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-foreground/60">
              {t(language, "compare.startTyping")}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

