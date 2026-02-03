import React from "react"
import { useNavigate } from "react-router-dom"
import type { Language } from "../../../utils/i18n"
import { getLocalizedString } from "../../../sanity/queries/careers"
import type { CareerSummary } from "../../../services/careerContext"
import { trackEvent } from "../../../utils/analytics"
import arrowIcon from "../../../assets/icons/arrow.svg"

type Props = {
  language: Language
  career: CareerSummary
  isSelected?: boolean
}

export function ChatCareerCard({ language, career, isSelected = false }: Props) {
  const navigate = useNavigate()
  const title = getLocalizedString(language, career.title) || "Untitled"
  
  const avgSalary = career.salary?.median 
    ? `$${Math.round(career.salary.median / 1000)}K`
    : career.salary?.rangeMin
      ? `$${Math.round(career.salary.rangeMin / 1000)}K`
      : undefined

  const salaryText = avgSalary ? `Avg. Salary: ${avgSalary}` : undefined

  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 bg-surface1 cursor-pointer hover:bg-surface2 transition-colors ${
        isSelected ? 'border-2 border-[rgb(var(--color-accent-pink))]' : ''
      }`}
      onClick={() => {
        trackEvent("ai_chat_career_click", {
          career_id: career._id,
          career_slug: career.slug ?? undefined,
          career_title: title,
          language
        })
        navigate(`/careers/${career.slug}`)
      }}
    >
      <div className="flex-1 min-w-0">
        <div className={`text-h5 font-bold text-foreground leading-[120%] tracking-[-0.025em] ${isSelected ? 'underline decoration-dotted decoration-[rgb(var(--color-accent-pink))] underline-offset-2' : ''}`}>
          {title}
        </div>
        {salaryText && (
          <div className={`text-body-base font-medium leading-[135%] tracking-[-0.025em] mt-1 text-foreground/75 ${isSelected ? 'underline decoration-dotted decoration-[rgb(var(--color-accent-pink))] underline-offset-2' : ''}`}>
            {salaryText}
          </div>
        )}
      </div>
      <img 
        src={arrowIcon}
        alt=""
        className={`shrink-0 ml-4 h-5 w-5 ${isSelected ? 'border border-dotted border-[rgb(var(--color-accent-pink))] rounded' : ''}`}
      />
    </div>
  )
}

