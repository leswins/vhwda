import React from "react"
import type { QuizVector } from "../../../../sanity/queries/careers"

type VectorDisplayProps = {
    vector: QuizVector
    title?: string
}

export function VectorDisplay({ vector, title = "Current Vector (accumulating):" }: VectorDisplayProps) {
    return (
        <div style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", fontSize: "12px" }}>
            <strong>{title}</strong>
            <pre>{JSON.stringify(vector, null, 2)}</pre>
        </div>
    )
}


