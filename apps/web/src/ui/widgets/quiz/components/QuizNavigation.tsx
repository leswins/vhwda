import React from "react"

type QuizNavigationProps = {
    hasPrevious: boolean
    hasNext: boolean
    onCancel: () => void
    onPrevious: () => void
    onNext: () => void
    onFinish: () => void
}

export function QuizNavigation({
    hasPrevious,
    hasNext,
    onCancel,
    onPrevious,
    onNext,
    onFinish,
}: QuizNavigationProps) {
    return (
        <div style={{ marginTop: "20px" }}>
            <button onClick={onCancel}>Cancel</button>
            {hasPrevious && (
                <button 
                    onClick={onPrevious}
                    style={{ marginLeft: "10px" }}
                >
                    Previous
                </button>
            )}
            {hasNext ? (
                <button 
                    onClick={onNext}
                    style={{ marginLeft: "10px" }}
                >
                    Next
                </button>
            ) : (
                <button 
                    onClick={onFinish}
                    style={{ marginLeft: "10px" }}
                >
                    Finish Quiz
                </button>
            )}
        </div>
    )
}


