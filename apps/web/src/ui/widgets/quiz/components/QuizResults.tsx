import React from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerMatchList } from "./CareerMatchList"
import { VectorDisplay } from "./VectorDisplay"
import { QuizCalculatingResults } from "./QuizCalculatingResults"

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
    // Show calculating screen while loading
    if (loading) {
        return <QuizCalculatingResults language={language} />
    }
    
    return (
        <div>
            <h1>Your Results</h1>
            
            <CareerMatchList 
                careers={matchedCareers}
                userVector={userVector}
                language={language}
            />
            
            <VectorDisplay 
                vector={userVector}
                title="Your User Vector:"
            />
            
            <button onClick={onStartOver} style={{ marginTop: "20px" }}>Start Over</button>
        </div>
    )
}

