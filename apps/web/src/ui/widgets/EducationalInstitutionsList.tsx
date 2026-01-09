import React, { useEffect, useState } from "react"
import type { Language } from "../../utils/i18n"
import { fetchEducationalInstitutions } from "../../sanity/queries/educationalInstitutions"
import type { EducationalInstitution } from "../../sanity/queries/careers"
import { EducationalInstitutionsMap } from "./EducationalInstitutionsMap"

type Props = {
  language: Language
  onCountChange?: (count: number) => void
}

export function EducationalInstitutionsList({ language, onCountChange }: Props) {
  const [institutions, setInstitutions] = useState<EducationalInstitution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadInstitutions() {
      try {
        setLoading(true)
        const data = await fetchEducationalInstitutions()
        setInstitutions(data)
        onCountChange?.(data.length)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load institutions"))
      } finally {
        setLoading(false)
      }
    }
    loadInstitutions()
  }, [onCountChange])

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Loading institutions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Error loading institutions: {error.message}</p>
      </div>
    )
  }

  return <EducationalInstitutionsMap language={language} institutions={institutions} />
}

