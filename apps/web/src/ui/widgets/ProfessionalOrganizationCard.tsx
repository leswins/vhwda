import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { ProfessionalOrganization } from "../../sanity/queries/professionalOrganizations"
import { getLocalizedText } from "../../sanity/queries/careers"

type Props = {
  language: Language
  organization: ProfessionalOrganization
}

export function ProfessionalOrganizationCard({ language, organization }: Props) {
  const description = getLocalizedText(language, organization.description)
  const institution = organization.institution || organization.name

  return (
    <div className="space-y-4 border-b border-border pb-6 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{organization.name}</h3>
          {institution && (
            <p className="text-sm font-medium text-onSurfaceSecondary uppercase">{institution}</p>
          )}
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {organization.link && (
          <a
            href={organization.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md bg-[rgb(var(--color-accent-pink))] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            {t(language, "common.visitSite")}
          </a>
        )}
      </div>
    </div>
  )
}

