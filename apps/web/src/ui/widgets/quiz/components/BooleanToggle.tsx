import React from "react"
import { t } from "../../../../utils/i18n"
import { ThumbsUpIcon } from "../../icons/ThumbsUpIcon"
import { ThumbsDownIcon } from "../../icons/ThumbsDownIcon"
import type { QuestionOption } from "../questions"

type BooleanToggleProps = {
    questionId: string
    value: string | null
    options: QuestionOption[]
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function BooleanToggle({ questionId, value, options, onChange, language }: BooleanToggleProps) {
    // Find the "yes" and "no" options - they might have different IDs
    // Try to find by label first, then fall back to first/second option
    const yesOption = options.find(opt => 
        opt.label.toLowerCase().includes("yes") || 
        opt.label.toLowerCase().includes("sí") ||
        opt.id.toLowerCase().includes("yes")
    ) || options[0]
    
    const noOption = options.find(opt => 
        opt.label.toLowerCase().includes("no") ||
        opt.id.toLowerCase().includes("no")
    ) || options[1]

    const isYesSelected = value === yesOption?.id
    const isNoSelected = value === noOption?.id

    const handleYesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (yesOption) {
            onChange(questionId, yesOption.id)
        }
    }

    const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (noOption) {
            onChange(questionId, noOption.id)
        }
    }

    return (
        <div className="flex flex-col gap-12 items-center w-full max-w-[530px]">
            <div className="flex items-center gap-6">
                {/* Yes button */}
                <button
                    type="button"
                    onClick={handleYesClick}
                    className={`
                        flex items-center justify-center gap-4 px-8 py-6
                        transition-all rounded-md border-2 min-w-[140px]
                        ${isYesSelected 
                            ? "bg-foreground text-surface border-foreground" 
                            : "bg-surface text-foreground border-border hover:bg-surface1"
                        }
                    `}
                >
                    {/* Thumbs up icon */}
                    <div className="pointer-events-none">
                        <ThumbsUpIcon />
                    </div>
                    <span className="text-h4 pointer-events-none">
                        {t(language, "quiz.yes")}
                    </span>
                </button>

                {/* No button */}
                <button
                    type="button"
                    onClick={handleNoClick}
                    className={`
                        flex items-center justify-center gap-4 px-8 py-6
                        transition-all rounded-md border-2 min-w-[140px]
                        ${isNoSelected
                            ? "bg-foreground text-surface border-foreground" 
                            : "bg-surface text-foreground border-border hover:bg-surface1"
                        }
                    `}
                >
                    <span className="text-h4 pointer-events-none">
                        {t(language, "quiz.no")}
                    </span>
                    {/* Thumbs down icon */}
                    <div className="pointer-events-none">
                        <ThumbsDownIcon />
                    </div>
                </button>
            </div>
        </div>
    )
}

