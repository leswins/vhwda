import React, { useEffect, useState } from "react"
import type { Language } from "../../utils/i18n"
import { fetchProfessionalOrganizations } from "../../sanity/queries/professionalOrganizations"
import type { ProfessionalOrganization } from "../../sanity/queries/professionalOrganizations"
import { ProfessionalOrganizationCard } from "./ProfessionalOrganizationCard"

type Props = {
  language: Language
  onCountChange?: (count: number) => void
}

export function ProfessionalOrganizationList({ language, onCountChange }: Props) {
  const [organizations, setOrganizations] = useState<ProfessionalOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadOrganizations() {
      try {
        setLoading(true)
        const data = await fetchProfessionalOrganizations()
        setOrganizations(data)
        onCountChange?.(data.length)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load organizations"))
      } finally {
        setLoading(false)
      }
    }
    loadOrganizations()
  }, [onCountChange])

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Loading organizations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <p className="text-muted">Error loading organizations: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      {organizations.length === 0 ? (
        <p className="text-muted">No organizations found.</p>
      ) : (
        organizations.map((organization) => (
          <ProfessionalOrganizationCard
            key={organization._id}
            language={language}
            organization={organization}
          />
        ))
      )}
    </div>
  )
}

