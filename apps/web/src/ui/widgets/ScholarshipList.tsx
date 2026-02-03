import React, { useEffect, useState, useMemo } from "react"
import type { Language } from "../../utils/i18n"
import { fetchScholarships } from "../../sanity/queries/scholarships"
import type { Scholarship } from "../../sanity/queries/scholarships"
import { ScholarshipCard } from "./ScholarshipCard"
import { filterScholarships } from "./utils/filterScholarships"
import type { ScholarshipFilters } from "./filters/scholarshipFilters"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  filters: ScholarshipFilters
  onCountChange?: (count: number) => void
}

export function ScholarshipList({ language, filters, onCountChange }: Props) {
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const filteredScholarships = useMemo(() => {
    return filterScholarships(allScholarships, filters, language)
  }, [allScholarships, filters, language])

  useEffect(() => {
    onCountChange?.(filteredScholarships.length)
  }, [filteredScholarships.length, onCountChange])

  useEffect(() => {
    async function loadScholarships() {
      try {
        setLoading(true)
        const data = await fetchScholarships()
        setAllScholarships(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t(language, "resources.scholarships.loadFailed")))
      } finally {
        setLoading(false)
      }
    }
    loadScholarships()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">{t(language, "resources.scholarships.loading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">
          {t(language, "resources.scholarships.loadErrorPrefix")} {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {filteredScholarships.length === 0 ? (
        <p className="text-muted">{t(language, "resources.scholarships.noneFound")}</p>
      ) : (
        filteredScholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship._id} language={language} scholarship={scholarship} />
        ))
      )}
    </div>
  )
}

