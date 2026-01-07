import React, { useEffect, useState, useMemo } from "react"
import type { Language } from "../../utils/i18n"
import { fetchProfessionalOrganizations } from "../../sanity/queries/professionalOrganizations"
import type { ProfessionalOrganization } from "../../sanity/queries/professionalOrganizations"
import { ProfessionalOrganizationCard } from "./ProfessionalOrganizationCard"
import { filterOrganizations } from "./utils/filterOrganizations"
import type { OrganizationFilters } from "./filters/organizationFilters"

type Props = {
  language: Language
  filters: OrganizationFilters
  onCountChange?: (count: number) => void
}

export function ProfessionalOrganizationList({ language, filters, onCountChange }: Props) {
  const [allOrganizations, setAllOrganizations] = useState<ProfessionalOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const filteredOrganizations = useMemo(() => {
    return filterOrganizations(allOrganizations, filters, language)
  }, [allOrganizations, filters, language])

  useEffect(() => {
    onCountChange?.(filteredOrganizations.length)
  }, [filteredOrganizations.length, onCountChange])

  useEffect(() => {
    async function loadOrganizations() {
      try {
        setLoading(true)
        const data = await fetchProfessionalOrganizations()
        setAllOrganizations(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load organizations"))
      } finally {
        setLoading(false)
      }
    }
    loadOrganizations()
  }, [])

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
      {filteredOrganizations.length === 0 ? (
        <p className="text-muted">No organizations found.</p>
      ) : (
        filteredOrganizations.map((organization) => (
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

