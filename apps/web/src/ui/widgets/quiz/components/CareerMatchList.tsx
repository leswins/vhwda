import React from "react"
import type { CareerForMatching } from "../../../../sanity/queries/careers"

type CareerMatch = CareerForMatching & { score: number }

type CareerMatchListProps = {
    careers: CareerMatch[]
    language: "en" | "es"
    maxResults?: number
}

export function CareerMatchList({ careers, language, maxResults = 10 }: CareerMatchListProps) {
    if (careers.length === 0) {
        return (
            <p>No matching careers found. Try adjusting your answers.</p>
        )
    }

    return (
        <div>
            <h2>Top Matching Careers</h2>
            <ul>
                {careers.slice(0, maxResults).map((career) => (
                    <li key={career._id} style={{ marginBottom: "10px", padding: "10px", background: "#f5f5f5" }}>
                        <strong>{language === "es" && career.title.es ? career.title.es : career.title.en}</strong>
                        <br />
                        <span style={{ fontSize: "12px", color: "#666" }}>
                            Matching Score: {career.score.toFixed(2)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}


