import React, { useEffect, useState } from "react"
import type { Language } from "../../utils/i18n"
import { fetchScholarships } from "../../sanity/queries/scholarships"
import type { Scholarship } from "../../sanity/queries/scholarships"
import { ScholarshipCard } from "./ScholarshipCard"

type Props = {
  language: Language
  onCountChange?: (count: number) => void
}

export function ScholarshipList({ language, onCountChange }: Props) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadScholarships() {
      try {
        setLoading(true)
        const data = await fetchScholarships()
        setScholarships(data)
        onCountChange?.(data.length)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load scholarships"))
      } finally {
        setLoading(false)
      }
    }
    loadScholarships()
  }, [onCountChange])

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Loading scholarships...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Error loading scholarships: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      {scholarships.length === 0 ? (
        <p className="text-muted">No scholarships found.</p>
      ) : (
        scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship._id} language={language} scholarship={scholarship} />
        ))
      )}
    </div>
  )
}

