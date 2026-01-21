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

  // Group careers into rows (2 per row)
  const rows: CareerMatch[][] = []
  for (let i = 0; i < displayCareers.length; i += 2) {
    rows.push(displayCareers.slice(i, i + 2))
  }

  return (
    <div className="bg-surface">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((career, colIndex) => {
            const matchPercentage = Math.round(calculateMatchPercentage(userVector, career.quizVector || {}))
            const title = getLocalizedString(language, career.title) ?? ""
            const salaryRange = formatSalaryRange(career.salary)
            const education = formatEducationLevel(career.educationMin)
            
            return (
              <div key={career._id} className={`flex-1 flex ${colIndex === 0 && row.length === 2 ? 'border-r-[0.5px] border-foreground' : ''}`}>
                <Link
                  to={`/careers/${career.slug ?? ""}`}
                  className="flex-1 flex items-center p-6 hover:bg-surface1 transition-colors"
                >
                  <div className="flex items-center justify-center w-20 h-20 bg-accentBlue mr-4 flex-shrink-0 p-2">
                    <div className="text-center w-full">
                      <div className="text-sub2 font-bold leading-[135%] tracking-[0.15em] whitespace-nowrap text-foreground">{matchPercentage}%</div>
                      <div className="text-xs font-bold uppercase tracking-[0.1em] mt-1 whitespace-nowrap" style={{ fontSize: '0.95rem' }}>MATCH</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-h4 font-bold text-foreground mb-2 leading-[120%] tracking-[-0.03em]">{title}</h3>
                    <p className="text-body-lg text-muted leading-[135%] tracking-[-0.025em]">
                      {[
                        "Hospital/Clinic", // TODO: Get from career data
                        education && education,
                        salaryRange && salaryRange
                      ].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
          {/* Fill empty space in last row if odd number of items */}
          {row.length === 1 && <div className="flex-1" />}
        </div>
      ))}
    </div>
  )
}