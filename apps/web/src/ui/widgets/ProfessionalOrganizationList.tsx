import React, { useEffect, useState, useMemo } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
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
  const [visibleCount, setVisibleCount] = useState(5)

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

  const mobileVisibleOrgs = filteredOrganizations.slice(0, visibleCount)

  return (
    <div className="flex-1">
      {filteredOrganizations.length === 0 ? (
        <p className="text-muted">No organizations found.</p>
      ) : (
        <>
          {/* Mobile: show in batches with "show more" */}
          <div className="block lg:hidden">
            {mobileVisibleOrgs.map((organization) => (
              <ProfessionalOrganizationCard
                key={organization._id}
                language={language}
                organization={organization}
              />
            ))}
            {visibleCount < filteredOrganizations.length && (
              <div className="bg-surface border-t-[0.5px] border-foreground flex justify-center py-fluid-20">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => Math.min(count + 5, filteredOrganizations.length))
                  }
                  className="inline-flex items-center justify-center px-fluid-24 py-fluid-10 border-[0.5px] border-foreground bg-surface text-body-sm font-semibold text-foreground tracking-[0.12em] uppercase hover:bg-surface2 transition-colors"
                >
                  {t(language, "resources.showMoreOrganizations")}
                </button>
              </div>
            )}
          </div>

          {/* Desktop: show full list */}
          <div className="hidden lg:block">
            {filteredOrganizations.map((organization) => (
              <ProfessionalOrganizationCard
                key={organization._id}
                language={language}
                organization={organization}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

