import { useState, useEffect, useMemo } from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { useCompareStore } from "../../../../zustand/useCompareStore"

export function useCareerSearch(allCareers: CareerForCompare[], language: Language, selectedCount: number) {
  const { careerIds } = useCompareStore()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (selectedCount === 0 && allCareers.length > 0 && careerIds.length === 0) {
      setShowSearch(true)
    }
  }, [selectedCount, allCareers.length, careerIds.length])

  const availableCareers = useMemo(
    () => allCareers.filter(c => !careerIds.includes(c._id)),
    [allCareers, careerIds]
  )

  const filteredCareers = useMemo(() => {
    if (searchQuery) {
      return availableCareers.filter(c => {
        const title = getLocalizedString(language, c.title)?.toLowerCase() || ""
        return title.includes(searchQuery.toLowerCase())
      })
    }
    return availableCareers.slice(0, 20)
  }, [availableCareers, searchQuery, language])

  return {
    showSearch,
    searchQuery,
    filteredCareers,
    setShowSearch,
    setSearchQuery,
  }
}

