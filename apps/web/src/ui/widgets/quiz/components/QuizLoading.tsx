import React from "react"
import { QuizSpinner } from "./QuizSpinner"
import { useLanguageStore } from "../../../../zustand/useLanguageStore"
import { t } from "../../../../utils/i18n"

export function QuizLoading() {
    const { language } = useLanguageStore()
    
    return (
        <div className="flex flex-col items-center justify-center gap-8 min-h-[400px]">
            <h1 className="text-h2 text-foreground text-center">
                {t(language, "quiz.calculating.title")}
            </h1>
            <p className="text-body-lg text-onSurfaceSecondary text-center">
                {t(language, "quiz.calculating.subtitle")}
            </p>
            <QuizSpinner />
        </div>
    )
}


