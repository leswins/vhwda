import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { HubResource } from "../../sanity/queries/hubResources"
import { getLocalizedString, getLocalizedText } from "../../sanity/queries/careers"
import { trackEvent, trackOutboundClick } from "../../utils/analytics"
import { accentBg } from "../../lib/resourceTypePresentation"
import type { ResourceAccent } from "../../sanity/queries/resourceTypes"

type Props = {
  language: Language
  resource: HubResource
  accent?: ResourceAccent
  typeSlug?: string
}

export function HubResourceCard({ language, resource, accent = "green", typeSlug }: Props) {
  const title = getLocalizedString(language, resource.title) ?? ""
  const description =
    getLocalizedText(language, resource.description) || getLocalizedString(language, resource.summary)
  const institution = resource.institution

  return (
    <div className="space-y-fluid-8 lg:space-y-4 border-b-[0.5px] border-foreground py-5 lg:py-[40px] first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-fluid-10">
        <h3 className="text-body-base lg:text-lg font-semibold text-foreground leading-snug">{title}</h3>
        {resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 ${accentBg(accent)} px-3 py-1.5 lg:px-4 lg:py-2 text-body-sm lg:text-sm font-semibold text-foreground rounded-none transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20`}
            onClick={() => {
              trackEvent("resource_click", {
                resource_type: typeSlug ?? "hub_resource",
                resource_id: resource._id,
                resource_title: title,
                language
              })
              trackOutboundClick({
                outbound_url: resource.link ?? "",
                resource_type: typeSlug ?? "hub_resource",
                resource_id: resource._id,
                resource_title: title,
                language
              })
            }}
          >
            {t(language, "common.visitSite")}
          </a>
        ) : null}
      </div>
      {institution ? (
        <p className="text-body-xs lg:text-body-sm font-medium text-onSurfaceSecondary uppercase tracking-[0.08em]">
          {institution}
        </p>
      ) : null}
      {description ? <p className="text-body-sm text-muted leading-snug">{description}</p> : null}
      {resource.tags && resource.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-none bg-surface2 px-2 py-1 text-xs text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
