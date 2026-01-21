import React from "react"
import type { CareerForMatching, QuizVector } from "../../../../sanity/queries/careers"
import { calculateMatchPercentage } from "../../../../utils/vector-aux"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { pickTypicalSalary } from "../../../../utils/salary"
import { CareerCard } from "../../CareerCard"

type CareerMatch = CareerForMatching & { score: number }

type CareerMatchListProps = {
    careers: CareerMatch[]
    userVector: QuizVector
    language: "en" | "es"
    maxResults?: number
}

export function CareerMatchList({ careers, userVector, language, maxResults = 20 }: CareerMatchListProps) {
    if (careers.length === 0) {
        return (
            <p className="text-body-base text-foreground">
                {language === "es" ? "No se encontraron carreras coincidentes. Intenta ajustar tus respuestas." : "No matching careers found. Try adjusting your answers."}
            </p>
        )
    }

    const displayCareers = careers.slice(0, maxResults)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-surface border-[0.5px] border-foreground">
            {displayCareers.map((career) => {
                const matchPercentage = Math.round(calculateMatchPercentage(userVector, career.quizVector || {}))
                const title = getLocalizedString(language, career.title) ?? ""
                const salary = pickTypicalSalary(career.salary)
                
                return (
                    <div 
                        key={career._id} 
                        className="bg-surface border-r-[0.5px] border-b-[0.5px] border-foreground [&:nth-child(2n)]:border-r-0 last:border-b-0 lg:last:border-b-0 lg:[&:nth-last-child(2)]:border-b-0"
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
                        />
                    </div>
                )
            })}
        </div>
    )
}