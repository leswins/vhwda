import React from "react"
import { Link } from "react-router-dom"
import type { CareerForMatching, QuizVector } from "../../../../sanity/queries/careers"
import { calculateMatchPercentage } from "../../../../utils/vector-aux"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { pickTypicalSalary } from "../../../../utils/salary"

type CareerMatch = CareerForMatching & { score: number }

type OtherMatchesListProps = {
  careers: CareerMatch[]
  userVector: QuizVector
  language: "en" | "es"
  maxResults?: number
}

function formatSalaryRange(salary?: { median?: number; rangeMin?: number; rangeMax?: number }): string | undefined {
  if (!salary) return undefined
  
  if (salary.rangeMin && salary.rangeMax) {
    return `$${Math.round(salary.rangeMin / 1000)}K-$${Math.round(salary.rangeMax / 1000)}K`
  }
  
  if (salary.median) {
    return `$${Math.round(salary.median / 1000)}K`
  }
  
  return undefined
}

function formatEducationLevel(educationMin?: string): string {
  if (!educationMin) return ""
  
  const educationMap: Record<string, string> = {
    "FF": "FastForward",
    "CSC": "Career Studies Certificate",
    "CERT": "Certificate",
    "AAS": "Associate",
    "BACH": "Bachelor's",
    "GRAD": "Master's"
  }
  
  return educationMap[educationMin] || educationMin
}

export function OtherMatchesList({ careers, userVector, language, maxResults = 20 }: OtherMatchesListProps) {
  if (careers.length === 0) {
    return (
      <p className="text-body-base text-foreground">
        {language === "es" ? "No se encontraron carreras coincidentes. Intenta ajustar tus respuestas." : "No matching careers found. Try adjusting your answers."}
      </p>
    )
  }

  const displayCareers = careers.slice(0, maxResults)

  // Split careers into two balanced columns for desktop layout.
  // On mobile, columns stack so the list still appears as a single column.
  const midIndex = Math.ceil(displayCareers.length / 2)
  const leftColumn = displayCareers.slice(0, midIndex)
  const rightColumn = displayCareers.slice(midIndex)

  const renderCareerLink = (career: CareerMatch) => {
    const matchPercentage = Math.round(calculateMatchPercentage(userVector, career.quizVector || {}))
    const title = getLocalizedString(language, career.title) ?? ""
    const salaryRange = formatSalaryRange(career.salary)
    const education = formatEducationLevel(career.educationMin)

    return (
      <Link
        key={career._id}
        to={`/careers/${career.slug ?? ""}`}
        className="group flex items-center py-[25px] px-fluid-30 transition-colors"
      >
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center bg-accentBlue mr-[30px] p-2 overflow-hidden">
          <div className="absolute inset-0 translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <div className="relative w-full text-center">
            <div className="text-sub2 font-bold leading-[135%] tracking-[0.15em] whitespace-nowrap text-foreground transition-colors duration-300 group-hover:text-surface">
              {matchPercentage}%
            </div>
            <div
              className="mt-1 text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap text-foreground transition-colors duration-300 group-hover:text-surface"
              style={{ fontSize: "0.95rem" }}
            >
              MATCH
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-h4 font-bold leading-[120%] tracking-[-0.03em] text-foreground">
            {title}
          </h3>
          <p className="text-body-lg text-muted leading-[135%] tracking-[-0.025em]">
            {[
              "Hospital/Clinic", // TODO: Get from career data
              education && education,
              salaryRange && salaryRange,
            ]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-surface border-[0.5px] border-foreground">
      <div className="divide-y-[0.5px] divide-foreground/30 md:divide-y-0 md:flex md:divide-x-[0.5px] md:divide-foreground/30">
        <div className="divide-y-[0.5px] divide-foreground/30 md:flex-1">
          {leftColumn.map(renderCareerLink)}
        </div>
        {rightColumn.length > 0 && (
          <div className="divide-y-[0.5px] divide-foreground/30 md:flex-1">
            {rightColumn.map(renderCareerLink)}
          </div>
        )}
      </div>
    </div>
  )
}