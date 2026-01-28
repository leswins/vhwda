import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { Scholarship } from "../../sanity/queries/scholarships"
import { getLocalizedString, getLocalizedText } from "../../sanity/queries/careers"
import { trackEvent, trackOutboundClick } from "../../utils/analytics"

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
    <div className="space-y-fluid-8 lg:space-y-4 border-b-[0.5px] border-foreground pt-fluid-20 pb-fluid-20 lg:pt-[40px] lg:pb-[40px] first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-fluid-10">
        <h3 className="text-body-base lg:text-lg font-semibold text-foreground leading-snug">
          {scholarship.name}
        </h3>
        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-[rgb(var(--color-accent-green))] px-3 py-1.5 lg:px-4 lg:py-2 text-body-sm lg:text-sm font-semibold text-foreground rounded-none transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          onClick={() => {
            trackEvent("resource_click", {
              resource_type: "scholarship",
              resource_id: scholarship._id,
              resource_title: scholarship.name,
              language
            })
            trackOutboundClick({
              outbound_url: scholarship.link,
              resource_type: "scholarship",
              resource_id: scholarship._id,
              resource_title: scholarship.name,
              language
            })
          }}
        >
          {t(language, "common.visitSite")}
        </a>
      </div>
      {institution && (
        <p className="text-body-xs lg:text-body-sm font-medium text-onSurfaceSecondary uppercase tracking-[0.08em]">
          {institution}
        </p>
      )}
      {description && (
        <p className="text-body-sm text-muted leading-snug">
          {description}
        </p>
      )}

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

