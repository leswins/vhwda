import React from "react"
import { t } from "../../../../utils/i18n"
import { useLanguageStore } from "../../../../zustand/useLanguageStore"

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
    const { language } = useLanguageStore()

    return (
        <div className="flex items-center gap-[20px]">
            {/* Back button (only show if has previous) */}
            {hasPrevious && (
                <button
                    onClick={onPrevious}
                    className="
                        px-[15px] py-[10px]
                        border border-foreground
                        bg-surface text-foreground
                        hover:bg-surface1
                        transition-colors
                        text-body-base font-semibold
                    "
                >
                    {t(language, "quiz.back")}
                </button>
            )}

            {/* Next/Submit button */}
            {hasNext ? (
                <button
                    onClick={onNext}
                    disabled={!isCurrentQuestionAnswered}
                    className={`
                        px-[15px] py-[10px]
                        text-body-base font-semibold
                        transition-colors
                        ${isCurrentQuestionAnswered
                            ? "bg-foreground text-surface hover:opacity-90 cursor-pointer"
                            : "bg-surface1 text-foreground opacity-50 cursor-not-allowed"
                        }
                    `}
                >
                    {t(language, "quiz.nextQuestion")}
                </button>
            ) : (
                <button
                    onClick={onFinish}
                    disabled={!isCurrentQuestionAnswered}
                    className={`
                        px-[15px] py-[10px]
                        text-body-base font-semibold
                        transition-colors
                        ${isCurrentQuestionAnswered
                            ? "bg-foreground text-surface hover:opacity-90 cursor-pointer"
                            : "bg-surface1 text-foreground opacity-50 cursor-not-allowed"
                        }
                    `}
                >
                    {t(language, "quiz.submitAnswers")}
                </button>
            )}
        </div>
    )
}


