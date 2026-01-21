import React from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useCompareStore } from "../zustand/useCompareStore"
import { t } from "../utils/i18n"
import {
  ComparePageHeader,
  CompareTableHeader,
  CompareTable,
  CompareEmptyState,
} from "../ui/widgets/compare/components"
import { useCompareData, useCareerSearch } from "../ui/widgets/compare/hooks"

export function ComparePage() {
  const { language } = useLanguageStore()
  const { addCareer, removeCareer } = useCompareStore()
  const { selectedCareers, allCareers, loading, loadingSelected } = useCompareData()
  const { showSearch, searchQuery, filteredCareers, setShowSearch, setSearchQuery } = useCareerSearch(
    allCareers,
    language,
    selectedCareers.length
  )

  const headerScrollRef = React.useRef<HTMLDivElement>(null)
  const bodyScrollRef = React.useRef<HTMLDivElement>(null)

  const handleAddCareer = (id: string) => {
    addCareer(id)
    setShowSearch(false)
    setSearchQuery("")
  }

  // Synchronize horizontal scrolling
  React.useEffect(() => {
    const header = headerScrollRef.current
    const body = bodyScrollRef.current
    if (!header || !body) return

    let isSyncingHeader = false
    let isSyncingBody = false

    const handleHeaderScroll = () => {
      if (isSyncingHeader) {
        isSyncingHeader = false
        return
      }
      isSyncingBody = true
      body.scrollLeft = header.scrollLeft
    }

    const handleBodyScroll = () => {
      if (isSyncingBody) {
        isSyncingBody = false
        return
      }
      isSyncingHeader = true
      header.scrollLeft = body.scrollLeft
    }

    header.addEventListener("scroll", handleHeaderScroll)
    body.addEventListener("scroll", handleBodyScroll)

    return () => {
      header.removeEventListener("scroll", handleHeaderScroll)
      body.removeEventListener("scroll", handleBodyScroll)
    }
  }, [loading, loadingSelected, selectedCareers.length])

  const handleSearchFocus = () => {
    setShowSearch(true)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleEscapeSearch = () => {
    setShowSearch(false)
    setSearchQuery("")
  }

  // Don't render while loading - global loading overlay will show
  if (loading || loadingSelected) {
    return null
  }

  const hasSelectedCareers = selectedCareers.length > 0
  const canAddCareer = selectedCareers.length < 4

  return (
    <div className="py-[50px]">
      <ComparePageHeader language={language} />

      {!hasSelectedCareers ? (
        <CompareEmptyState
          language={language}
          searchQuery={searchQuery}
          filteredCareers={filteredCareers}
          showSearch={showSearch}
          onSearchChange={setSearchQuery}
          onSearchFocus={handleSearchFocus}
          onAddCareer={handleAddCareer}
          onClearSearch={handleClearSearch}
          onEscapeSearch={handleEscapeSearch}
        />
      ) : (
        <div className="overflow-visible">
          <div className="sticky top-0 z-30 bg-surface">
            <div
              ref={headerScrollRef}
              className="overflow-x-auto scrollbar-hide"
              style={{ overflowY: 'visible' }}
            >
              <div className="min-w-max">
                <CompareTableHeader
                  selectedCareers={selectedCareers}
                  language={language}
                  searchQuery={searchQuery}
                  filteredCareers={filteredCareers}
                  showSearch={showSearch}
                  onRemoveCareer={removeCareer}
                  onSearchChange={setSearchQuery}
                  onSearchFocus={handleSearchFocus}
                  onAddCareer={handleAddCareer}
                  onClearSearch={handleClearSearch}
                  onEscapeSearch={handleEscapeSearch}
                />
              </div>
            </div>
          </div>

          <div
            ref={bodyScrollRef}
            className="overflow-x-auto"
            style={{ overflowY: 'visible' }}
          >
            <div className="min-w-max">
              <CompareTable
                selectedCareers={selectedCareers}
                language={language}
                canAddCareer={canAddCareer}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
