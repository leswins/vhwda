import React from "react"
import { useNavigate } from "react-router-dom"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import { getLocalizedString, getLocalizedText } from "../../../sanity/queries/careers"
import type { CareerSummary } from "../../../services/careerContext"

type Props = {
  language: Language
  career: CareerSummary
}

export function ChatCareerCard({ language, career }: Props) {
  const navigate = useNavigate()
  const title = getLocalizedString(language, career.title) || "Untitled"
  const summary = getLocalizedText(language, career.summary) || ""
  const salary = career.salary?.median 
    ? `$${career.salary.median.toLocaleString()}/year`
    : career.salary?.rangeMin
      ? `$${career.salary.rangeMin.toLocaleString()}-${career.salary.rangeMax?.toLocaleString() || 'N/A'}/year`
      : undefined

  return (
    <div className="w-[360px] shrink-0 border border-border bg-surface">
      <div className="border-y border-border bg-surface-1 px-5 py-5">
        <div className="text-2xl font-bold leading-tight">{title}</div>
      </div>
      <div className="px-5">
        {summary && (
          <div className="py-4 text-sm text-muted">{summary}</div>
        )}
        {salary && (
          <>
            <div className="flex items-center justify-between py-5 text-sm font-bold text-onSurfaceSecondary">
              <span>{t(language, "careerCard.typicalVaSalary")}</span>
              <span>{salary}</span>
            </div>
            <div className="h-[0.5px] w-full bg-foreground" />
          </>
        )}
        <div 
          className="flex items-center justify-between py-5 cursor-pointer hover:bg-surface-2 transition-colors rounded -mx-5 px-5"
          onClick={() => navigate(`/careers/${career.slug}`)}
        >
          <span className="text-sm text-muted hover:text-foreground">
            {t(language, "careerCard.learnMore")}
          </span>
          <span aria-hidden="true" className="text-xl text-foreground">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

