import React, { useState } from "react"
import type { Language, TranslationKey } from "../../utils/i18n"
import { t } from "../../utils/i18n"

export type FiltersPanelProps = {
  language: Language
  searchPlaceholderKey: TranslationKey
  searchQuery: string
  onSearchChange: (query: string) => void
  children?: React.ReactNode
  sortChildren?: React.ReactNode
  showSort?: boolean
  showContentDivider?: boolean
  /** Keep the filter column visible on mobile instead of collapsing behind Filter/Sort. */
  alwaysShowFilters?: boolean
}

export function FiltersPanel({
  language,
  searchPlaceholderKey,
  searchQuery,
  onSearchChange,
  children,
  sortChildren,
  showSort = true,
  showContentDivider = true,
  alwaysShowFilters = false
}: FiltersPanelProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter")
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false)
  const showFilterBody = alwaysShowFilters || (showFiltersOnMobile && !isSearchActive)

  return (
    <div className="flex min-h-0 flex-col lg:h-full lg:overflow-hidden lg:border-b-0 lg:border-r-[0.5px] lg:border-foreground">
      <div className="sticky top-0 z-10 shrink-0 bg-surface lg:static">
        <div className="relative flex items-center gap-0 p-5 border-b-[0.5px] border-foreground lg:border-y-0 lg:gap-fluid-20 lg:px-fluid-25 lg:py-fluid-25 lg:h-[72px] lg:border-b-[0.5px] lg:border-foreground">
          <div
            className={`flex items-center gap-fluid-20 transition-opacity duration-300 ${isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("filter")
                if (!alwaysShowFilters) {
                  setShowFiltersOnMobile((prev) => (activeTab === "filter" ? !prev : true))
                }
              }}
              className={`text-body-base lg:text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "filter" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
            >
              {t(language, "filters.filter")}
            </button>
            {showSort && (
              <>
                <div className="h-fluid-20 w-[0.5px] bg-foreground" />
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("sort")
                    if (!alwaysShowFilters) {
                      setShowFiltersOnMobile((prev) => (activeTab === "sort" ? !prev : true))
                    }
                  }}
                  className={`text-body-base lg:text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "sort" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
                >
                  {t(language, "filters.sort")}
                </button>
              </>
            )}
          </div>

          <button
            type="button"
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
              type="button"
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
        className={`flex min-h-0 flex-col gap-0 overflow-y-auto p-5 border-b-[0.5px] border-foreground lg:gap-fluid-25 lg:p-fluid-25 lg:border-b-0 flex-1 scrollbar-hide ${showFilterBody ? "" : "hidden lg:flex"}`}
      >
        {activeTab === "filter" && !isSearchActive ? children : null}
        {activeTab === "sort" && !isSearchActive ? sortChildren : null}
      </div>
    </div>
  )
}

export function ResourceSplit({
  sidebar,
  children
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[30%_1fr] lg:h-[max(800px,calc(95vh-75px))]">
      <div className="min-h-0 lg:h-full lg:overflow-hidden">{sidebar}</div>
      <div className="min-h-0 p-5 lg:h-full lg:overflow-y-auto lg:p-fluid-50 lg:scrollbar-hide">{children}</div>
    </div>
  )
}
