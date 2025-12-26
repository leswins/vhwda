import React from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerMatchList } from "./CareerMatchList"
import { VectorDisplay } from "./VectorDisplay"

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
    return (
        <div>
            <h1>Your Results</h1>
            
            {loading && (
                <p>Calculating your career matches...</p>
            )}
            
            {!loading && (
                <CareerMatchList 
                    careers={matchedCareers}
                    language={language}
                />
            )}
            
            <VectorDisplay 
                vector={userVector}
                title="Your User Vector:"
            />
            
            <button onClick={onStartOver} style={{ marginTop: "20px" }}>Start Over</button>
        </div>
    )
}

