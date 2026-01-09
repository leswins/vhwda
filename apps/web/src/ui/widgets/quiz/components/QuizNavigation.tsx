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
                        border border-on-surface-primary
                        bg-surface-background text-on-surface-primary
                        hover:bg-surface-above-1
                        transition-colors
                        font-semibold text-body-default tracking-tight leading-snug
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
                        font-semibold text-body-default tracking-tight leading-snug
                        transition-colors
                        ${isCurrentQuestionAnswered
                            ? "bg-on-surface-primary text-surface-background hover:opacity-90 cursor-pointer"
                            : "bg-surface-above-1 text-on-surface-primary opacity-50 cursor-not-allowed"
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
                        font-semibold text-body-default tracking-tight leading-snug
                        transition-colors
                        ${isCurrentQuestionAnswered
                            ? "bg-on-surface-primary text-surface-background hover:opacity-90 cursor-pointer"
                            : "bg-surface-above-1 text-on-surface-primary opacity-50 cursor-not-allowed"
                        }
                    `}
                >
                    {t(language, "quiz.submitAnswers")}
                </button>
            )}
        </div>
    )
}


