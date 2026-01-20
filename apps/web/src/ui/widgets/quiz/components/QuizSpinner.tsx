import React from "react"

export function QuizSpinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
                {/* Top-left square */}
                <div className="absolute top-0 left-0 w-7 h-7 bg-foreground quiz-spinner-square" />
                {/* Top-right square */}
                <div className="absolute top-0 right-0 w-7 h-7 bg-foreground quiz-spinner-square" />
                {/* Bottom-left square */}
                <div className="absolute bottom-0 left-0 w-7 h-7 bg-foreground quiz-spinner-square" />
                {/* Bottom-right square */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-foreground quiz-spinner-square" />
            </div>
        </div>
    )
}

