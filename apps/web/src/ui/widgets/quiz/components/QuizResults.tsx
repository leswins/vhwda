import React, { useState } from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerMatchList } from "./CareerMatchList"
import { CareerCard } from "../../CareerCard"
import { calculateMatchPercentage } from "../../../../utils/vector-aux"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import reloadIcon from "../shapes/reload.png"
import shapesLong from "../shapes/shapes-long.png"

type CareerMatch = CareerForMatching & { score: number }

type QuizResultsProps = {
    loading: boolean
    matchedCareers: CareerMatch[]
    userVector: QuizVector
    language: "en" | "es"
    onStartOver: () => void
}

function formatMoney(value?: number): string | undefined {
    if (value === undefined || value === null) return undefined
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    } catch {
        return `$${value}`
    }
}

function pickTypicalSalary(salary?: { median?: number; rangeMin?: number; rangeMax?: number }): string | undefined {
    return formatMoney(salary?.median ?? salary?.rangeMin ?? salary?.rangeMax)
}

export function QuizResults({
    loading,
    matchedCareers,
    userVector,
    language,
    onStartOver,
}: QuizResultsProps) {
    const [searchQuery, setSearchQuery] = useState("")
    
    // Show calculating screen while loading
    if (loading) {
        return null
    }
    
    const topMatches = matchedCareers.slice(0, 3)
    const otherMatches = matchedCareers.slice(3)
    
    const filteredOtherMatches = searchQuery
        ? otherMatches.filter((career) => {
              const title = getLocalizedString(language, career.title)?.toLowerCase() ?? ""
              return title.includes(searchQuery.toLowerCase())
          })
        : otherMatches
    
    return (
        <div className="w-full">
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-body-base font-medium text-foreground">{t(language, "quiz.sidebar.title")}</span>
                    <span className="px-2.5 py-1 bg-accentOrange text-foreground text-xs font-bold uppercase tracking-wider">
                        {t(language, "quiz.title").split(" ").pop()}
                    </span>
                </div>
                <button
                    onClick={onStartOver}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-foreground/20 bg-surface2 hover:bg-surface2/90 text-body-base text-foreground transition-colors"
                >
                    <img src={reloadIcon} alt="" className="w-4 h-4" />
                    <span>{t(language, "quiz.results.retake")}</span>
                </button>
            </div>
            
            {/* Dashed separator */}
            <div className="border-b border-dashed border-foreground/30 mb-8" />

            {/* Your Top Matches */}
            <div className="mb-16">
                <div className="flex items-center mb-8">
                    <h1 className="text-h2 font-bold text-foreground whitespace-nowrap">{t(language, "quiz.results.topMatches")}</h1>
                    <div className="ml-4 flex-1 min-w-0" style={{ backgroundImage: `url(${shapesLong})`, backgroundRepeat: 'repeat-x', backgroundPosition: 'left center', backgroundSize: 'auto 3rem', height: '3rem' }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-surface border-[0.5px] border-foreground">
                    {topMatches.map((career, index) => {
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
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Other Strong Matches */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h2 className="text-h2 font-bold text-foreground">{t(language, "quiz.results.otherMatches")}</h2>
                    <div className="w-full md:w-auto md:min-w-[300px]">
                        <input
                            type="text"
                            placeholder={t(language, "quiz.results.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border-[0.5px] border-foreground bg-surface text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground"
                        />
                    </div>
                </div>
                <CareerMatchList
                    careers={filteredOtherMatches}
                    userVector={userVector}
                    language={language}
                    maxResults={20}
                />
            </div>
        </div>
    )
}