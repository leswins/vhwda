import React from "react"

type QuizNavigationProps = {
    hasPrevious: boolean
    hasNext: boolean
    isCurrentQuestionAnswered: boolean
    onCancel: () => void
    onPrevious: () => void
    onNext: () => void
    onFinish: () => void
}

export function QuizNavigation({
    hasPrevious,
    hasNext,
    isCurrentQuestionAnswered,
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
                    disabled={!isCurrentQuestionAnswered}
                    style={{ 
                        marginLeft: "10px",
                        opacity: isCurrentQuestionAnswered ? 1 : 0.5,
                        cursor: isCurrentQuestionAnswered ? "pointer" : "not-allowed"
                    }}
                >
                    Next
                </button>
            ) : (
                <button 
                    onClick={onFinish}
                    disabled={!isCurrentQuestionAnswered}
                    style={{ 
                        marginLeft: "10px",
                        opacity: isCurrentQuestionAnswered ? 1 : 0.5,
                        cursor: isCurrentQuestionAnswered ? "pointer" : "not-allowed"
                    }}
                >
                    Finish Quiz
                </button>
            )}
        </div>
    )
}


