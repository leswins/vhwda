import React from "react"
import { t } from "../../../../utils/i18n"

type BooleanToggleProps = {
    questionId: string
    value: string | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function BooleanToggle({ questionId, value, onChange, language }: BooleanToggleProps) {
    const isYesSelected = value === "yes" || value === "true" || value === "1"

    return (
        <div className="flex flex-col gap-[50px] items-center w-full max-w-[530px]">
            <p className="text-subh-1 font-medium text-on-surface-primary text-center tracking-tight leading-snug">
                {t(language, "quiz.isDealbreaker")}
            </p>
            <div className="flex items-stretch border border-on-surface-primary overflow-hidden">
                {/* Yes button */}
                <button
                    onClick={() => onChange(questionId, "yes")}
                    className={`
                        flex items-center justify-center gap-[15px] px-[30px] py-[30px]
                        transition-all border-r border-on-surface-primary
                        ${isYesSelected 
                            ? "bg-on-surface-primary text-surface-background" 
                            : "bg-surface-background text-on-surface-primary hover:bg-surface-above-1"
                        }
                    `}
                >
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <path
                            d="M20.625 9.375V16.875M24.375 11.25V15C24.375 16.0355 23.5355 16.875 22.5 16.875H18.5303C18.0578 16.875 17.605 17.0647 17.2727 17.4022L9.72727 25.1477C9.39496 25.485 8.94217 25.6747 8.46967 25.6747H7.5C6.46447 25.6747 5.625 24.8352 5.625 23.7997V20.0753C5.625 19.0398 6.46447 18.2003 7.5 18.2003H13.125L11.25 11.25H16.875L22.5 5.625H24.375C25.4105 5.625 26.25 6.46447 26.25 7.5V9.375C26.25 10.4105 25.4105 11.25 24.375 11.25Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="text-h4 font-bold tracking-tight leading-tight">
                        {t(language, "quiz.yes")}
                    </span>
                </button>

                {/* No button */}
                <button
                    onClick={() => onChange(questionId, "no")}
                    className={`
                        flex items-center justify-center gap-[15px] px-[30px] py-[30px]
                        transition-all
                        ${!isYesSelected && value !== null
                            ? "bg-on-surface-primary text-surface-background" 
                            : "bg-surface-background text-on-surface-primary hover:bg-surface-above-1"
                        }
                    `}
                >
                    <span className="text-h4 font-bold tracking-tight leading-tight">
                        {t(language, "quiz.no")}
                    </span>
                    <div className="transform rotate-180">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path
                                d="M20.625 9.375V16.875M24.375 11.25V15C24.375 16.0355 23.5355 16.875 22.5 16.875H18.5303C18.0578 16.875 17.605 17.0647 17.2727 17.4022L9.72727 25.1477C9.39496 25.485 8.94217 25.6747 8.46967 25.6747H7.5C6.46447 25.6747 5.625 24.8352 5.625 23.7997V20.0753C5.625 19.0398 6.46447 18.2003 7.5 18.2003H13.125L11.25 11.25H16.875L22.5 5.625H24.375C25.4105 5.625 26.25 6.46447 26.25 7.5V9.375C26.25 10.4105 25.4105 11.25 24.375 11.25Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    )
}

