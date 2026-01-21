import React from "react"
import { t } from "../../../../utils/i18n"

type QuizCalculatingResultsProps = {
    language: "en" | "es"
}

export function QuizCalculatingResults({ language }: QuizCalculatingResultsProps) {
    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full h-full">
            {/* Main title */}
            <h2 className="text-h2 font-bold text-foreground text-center">
                {t(language, "quiz.calculatingTitle")}
            </h2>
            
            {/* Subtitle */}
            <p className="text-body-sm text-muted text-center">
                {t(language, "quiz.calculatingSubtitle")}
            </p>

            {/* Loading animation - 2x2 grid of squares */}
            <div className="flex flex-col gap-2 mt-8">
                <div className="flex gap-2">
                    <div 
                        className="w-4 h-4 bg-foreground quiz-loading-square" 
                        style={{ animationDelay: "0ms" }} 
                    />
                    <div 
                        className="w-4 h-4 bg-foreground quiz-loading-square" 
                        style={{ animationDelay: "300ms" }} 
                    />
                </div>
                <div className="flex gap-2">
                    <div 
                        className="w-4 h-4 bg-foreground quiz-loading-square" 
                        style={{ animationDelay: "600ms" }} 
                    />
                    <div 
                        className="w-4 h-4 bg-foreground quiz-loading-square" 
                        style={{ animationDelay: "900ms" }} 
                    />
                </div>
            </div>
        </div>
    )
}

