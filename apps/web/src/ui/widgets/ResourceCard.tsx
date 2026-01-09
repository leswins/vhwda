import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type ResourceType = "scholarships" | "professionalOrganizations" | "schoolsPrerequisites"

type Props = {
  language: Language
  type: ResourceType
}

const sectionIds: Record<ResourceType, string> = {
  scholarships: "scholarships",
  professionalOrganizations: "organizations",
  schoolsPrerequisites: "schools"
}

const iconColors: Record<ResourceType, string> = {
  scholarships: "bg-[rgb(var(--color-accent-green))]",
  professionalOrganizations: "bg-[rgb(var(--color-accent-pink))]",
  schoolsPrerequisites: "bg-[rgb(var(--color-accent-blue))]"
}

const iconSVGs: Record<ResourceType, React.ReactNode> = {
  scholarships: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dollar sign with graduation cap - simplified version */}
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6C9 5.44772 9.44772 5 10 5H14C14.5523 5 15 5.44772 15 6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H10C9.44772 11 9 10.5523 9 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graduation cap */}
      <path
        d="M6 14L12 11L18 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  professionalOrganizations: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stethoscope */}
      <path
        d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10C17.1046 10 18 10.8954 18 12C18 13.1046 17.1046 14 16 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  schoolsPrerequisites: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Graduation cap */}
      <path
        d="M22 10L12 2L2 10L12 18L22 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ResourceCard({ language, type }: Props) {
  const titleKey = `planNextSteps.card.${type}.title` as const
  const descriptionKey = `planNextSteps.card.${type}.description` as const
  const sectionId = sectionIds[type]

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <a
      href={`#${sectionId}`}
      onClick={handleClick}
      className="flex items-start gap-4 rounded-md border border-border bg-surface p-4 transition-colors hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${iconColors[type]}`}>
        <div className="text-foreground">{iconSVGs[type]}</div>
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-foreground">{t(language, titleKey)}</h3>
        <p className="text-sm text-muted">{t(language, descriptionKey)}</p>
      </div>
      <div className="flex shrink-0 items-center text-foreground" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </a>
  )
}

