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

  const handleAddCareer = (id: string) => {
    addCareer(id)
    setShowSearch(false)
    setSearchQuery("")
  }

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

  if (loading) {
    return (
      <div className="space-y-8">
        <ComparePageHeader careerCount={0} language={language} />
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  const hasSelectedCareers = selectedCareers.length > 0
  const canAddCareer = selectedCareers.length < 4

  return (
    <div className="space-y-8">
      <ComparePageHeader careerCount={selectedCareers.length} language={language} />

      {hasSelectedCareers && (
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
      )}

      {loadingSelected ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-foreground/60">Loading careers...</p>
        </div>
      ) : !hasSelectedCareers ? (
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
        <CompareTable
          selectedCareers={selectedCareers}
          language={language}
          canAddCareer={canAddCareer}
        />
      )}
    </div>
  )
}
