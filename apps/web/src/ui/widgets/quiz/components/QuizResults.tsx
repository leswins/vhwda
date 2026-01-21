import React from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { QuizResultsHeader } from "./QuizResultsHeader"
import { TopMatchesSection } from "./TopMatchesSection"
import { OtherMatchesSection } from "./OtherMatchesSection"

type CareerMatch = CareerForMatching & { score: number }

type QuizResultsProps = {
    loading: boolean
    matchedCareers: CareerMatch[]
    userVector: QuizVector
    language: "en" | "es"
    onStartOver: () => void
}

export function QuizResults({
    loading,
    matchedCareers,
    userVector,
    language,
    onStartOver,
}: QuizResultsProps) {
    if (loading) {
        return null
    }
    
    const topMatches = matchedCareers.slice(0, 3)
    const otherMatches = matchedCareers.slice(3)
    
    return (
        <div className="w-full">
            <QuizResultsHeader language={language} onStartOver={onStartOver} />
            <TopMatchesSection careers={topMatches} userVector={userVector} language={language} />
            <OtherMatchesSection careers={otherMatches} userVector={userVector} language={language} />
        </div>
    )
}