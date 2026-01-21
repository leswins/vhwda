import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { Scholarship } from "../../sanity/queries/scholarships"
import { getLocalizedString, getLocalizedText } from "../../sanity/queries/careers"

type Props = {
  language: Language
  scholarship: Scholarship
}

const badgeLabels: Record<string, string> = {
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  undergraduate_graduate: "Undergraduate and Graduate",
  multiple_cohorts: "Multiple cohorts available",
  health_related: "Health-related fields"
}

export function ScholarshipCard({ language, scholarship }: Props) {
  const description = getLocalizedText(language, scholarship.description)
  const institution = scholarship.institution

  return (
    <div className="space-y-4 border-b-[0.5px] border-foreground pb-[50px] pt-[50px] first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground">{scholarship.name}</h3>
        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-[rgb(var(--color-accent-green))] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
        >
          {t(language, "common.visitSite")}
        </a>
      </div>
      {institution && (
        <p className="text-sm font-medium text-onSurfaceSecondary uppercase">{institution}</p>
      )}
      {description && <p className="text-sm text-muted">{description}</p>}

      {scholarship.badges && scholarship.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {scholarship.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs text-foreground"
            >
              {badgeLabels[badge] || badge}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

