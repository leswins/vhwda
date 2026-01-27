import React, { useEffect, useRef } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useCompareStore } from "../zustand/useCompareStore"
import { trackEvent } from "../utils/analytics"
import { getLocalizedString } from "../sanity/queries/careers"
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
  const compareViewTrackedRef = useRef(false)

  const findCareer = (id: string) => {
    return allCareers.find((career) => career._id === id) || selectedCareers.find((career) => career._id === id)
  }

  const handleAddCareer = (id: string) => {
    const career = findCareer(id)
    const isStart = selectedCareers.length === 0
    addCareer(id)
    setShowSearch(false)
    setSearchQuery("")
    trackEvent("compare_add", {
      source: "compare",
      career_id: id,
      career_slug: career?.slug ?? undefined,
      career_title: career ? getLocalizedString(language, career.title) ?? undefined : undefined,
      compare_count: Math.min(selectedCareers.length + 1, 4),
      language
    })
    if (isStart) {
      trackEvent("compare_start", {
        source: "compare",
        compare_count: 1,
        language
      })
    }
  }

  const handleRemoveCareer = (id: string) => {
    const career = findCareer(id)
    removeCareer(id)
    trackEvent("compare_remove", {
      source: "compare",
      career_id: id,
      career_slug: career?.slug ?? undefined,
      career_title: career ? getLocalizedString(language, career.title) ?? undefined : undefined,
      compare_count: Math.max(selectedCareers.length - 1, 0),
      language
    })
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

  useEffect(() => {
    if (selectedCareers.length === 0) {
      compareViewTrackedRef.current = false
      return
    }

    if (!compareViewTrackedRef.current && selectedCareers.length >= 2) {
      trackEvent("compare_view", {
        compare_count: selectedCareers.length,
        language
      })
      compareViewTrackedRef.current = true
    }
  }, [language, selectedCareers.length])

  useEffect(() => {
    const query = searchQuery.trim()
    if (!query) return
    const timer = window.setTimeout(() => {
      trackEvent("compare_search", {
        query,
        results_count: filteredCareers.length,
        language
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [filteredCareers.length, language, searchQuery])

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
    <div className="py-fluid-40 lg:py-[50px]">
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
                  onRemoveCareer={handleRemoveCareer}
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
