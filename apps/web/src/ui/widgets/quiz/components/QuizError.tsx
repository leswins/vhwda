import React from "react"

type QuizErrorProps = {
    message: string
}

export function QuizError({ message }: QuizErrorProps) {
    return (
        <div>
            <h1>Error Loading Quiz</h1>
            <p style={{ color: "red" }}>{message}</p>
        </div>
    )
}


