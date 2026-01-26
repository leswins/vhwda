import React from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerCard } from "../../CareerCard"
import { calculateMatchPercentage } from "../../../../utils/vector-aux"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import { pickTypicalSalary } from "../../../../utils/salary"
import { trackEvent } from "../../../../utils/analytics"
import shapesLong from "../../icons/shapes/shapes-long.png"

type CareerMatch = CareerForMatching & { score: number }

type TopMatchesSectionProps = {
  careers: CareerMatch[]
  userVector: QuizVector
  language: "en" | "es"
}

export function TopMatchesSection({ careers, userVector, language }: TopMatchesSectionProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <h1 className="text-h2 font-bold text-foreground whitespace-nowrap">{t(language, "quiz.results.topMatches")}</h1>
        <div className="ml-4 flex-1 min-w-0" style={{ backgroundImage: `url(${shapesLong})`, backgroundRepeat: 'repeat-x', backgroundPosition: 'left center', backgroundSize: 'auto 3rem', height: '3rem' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-surface border-[0.5px] border-foreground">
        {careers.map((career) => {
          const matchPercentage = Math.round(calculateMatchPercentage(userVector, career.quizVector || {}))
          const title = getLocalizedString(language, career.title) ?? ""
          const salary = pickTypicalSalary(career.salary)
          
          return (
            <div 
              key={career._id} 
              className="bg-surface border-r-[0.5px] border-b-[0.5px] border-foreground [&:nth-child(3n)]:border-r-0 last:border-b-0 lg:last:border-b-0 lg:[&:nth-last-child(2)]:border-b-0"
            >
              <CareerCard
                language={language}
                title={title}
                salary={salary}
                to={`/careers/${career.slug ?? ""}`}
                imageUrl={career.imageUrl}
                videoUrl={career.videoUrl}
                showMatch={true}
                matchLabel={`${matchPercentage}% MATCH`}
                onClick={() => {
                  trackEvent("quiz_recommendation_click", {
                    source: "quiz_top_matches",
                    career_id: career._id,
                    career_slug: career.slug ?? undefined,
                    career_title: title,
                    match_percent: matchPercentage,
                    language
                  })
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}