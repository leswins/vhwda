import React from "react"

type QuizIntroProps = {
    onStart: () => void
}

export function QuizIntro({ onStart }: QuizIntroProps) {
    return (
        <div>
            <h1>Career Quiz</h1>
            <p>This quiz will help you find careers that match your preferences.</p>
            <p>It takes about 6-8 minutes to complete.</p>
            <button onClick={onStart}>Start Quiz</button>
        </div>
    )
}


