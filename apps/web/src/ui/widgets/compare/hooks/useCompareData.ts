import { useState, useEffect } from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { fetchCareersByIds, fetchCareersForCompare } from "../../../../sanity/queries/careers"
import { useCompareStore } from "../../../../zustand/useCompareStore"

export function useCompareData() {
  const { careerIds } = useCompareStore()
  const [selectedCareers, setSelectedCareers] = useState<CareerForCompare[]>([])
  const [allCareers, setAllCareers] = useState<CareerForCompare[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSelected, setLoadingSelected] = useState(false)

  useEffect(() => {
    async function loadAllCareers() {
      try {
        const careers = await fetchCareersForCompare()
        setAllCareers(careers)
      } catch (error) {
        console.error("Error loading careers for compare:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAllCareers()
  }, [])

  useEffect(() => {
    async function loadSelectedCareers() {
      if (!careerIds.length) {
        setSelectedCareers([])
        return
      }
      setLoadingSelected(true)
      try {
        const careers = await fetchCareersByIds(careerIds)
        const ordered = careerIds
          .map(id => careers.find(c => c._id === id))
          .filter((c): c is CareerForCompare => c !== undefined)
        setSelectedCareers(ordered)
      } catch (error) {
        console.error("Error loading selected careers:", error)
      } finally {
        setLoadingSelected(false)
      }
    }
    loadSelectedCareers()
  }, [careerIds])

  return {
    selectedCareers,
    allCareers,
    loading,
    loadingSelected,
  }
}

