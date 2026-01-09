import React from "react"
import type { QuestionOption } from "../questions"

type SelectListProps = {
    questionId: string
    options: QuestionOption[]
    selectedValues: string[]
    isMultiSelect: boolean
    maxSelect?: number
    onChange: (questionId: string, optionId: string) => void
}

export function SelectList({
    questionId,
    options,
    selectedValues,
    isMultiSelect,
    maxSelect,
    onChange,
}: SelectListProps) {
    return (
        <div className="flex flex-col gap-[12px] w-full max-w-[530px]">
            {options.map((option) => {
                const isSelected = selectedValues.includes(option.id)
                const isDisabled = isMultiSelect && !isSelected && maxSelect !== undefined && selectedValues.length >= maxSelect

                return (
                    <button
                        key={option.id}
                        onClick={() => !isDisabled && onChange(questionId, option.id)}
                        disabled={isDisabled}
                        className={`
                            flex items-center gap-[16px] px-[24px] py-[18px]
                            border border-on-surface-primary
                            text-left transition-all
                            ${isSelected 
                                ? "bg-on-surface-primary text-surface-background" 
                                : "bg-surface-background text-on-surface-primary hover:bg-surface-above-1"
                            }
                            ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        `}
                    >
                        {/* Checkbox/Radio indicator */}
                        <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                            {isMultiSelect ? (
                                // Checkbox
                                <div
                                    className={`
                                        w-[24px] h-[24px] border-2 flex items-center justify-center
                                        ${isSelected 
                                            ? "bg-surface-background border-surface-background" 
                                            : "bg-transparent border-current"
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-on-surface-primary"
                                            />
                                        </svg>
                                    )}
                                </div>
                            ) : (
                                // Radio
                                <div
                                    className={`
                                        w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center
                                        ${isSelected 
                                            ? "bg-surface-background border-surface-background" 
                                            : "bg-transparent border-current"
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="w-[10px] h-[10px] rounded-full bg-on-surface-primary" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Option label */}
                        <span className="flex-1 text-body-default font-medium tracking-tight leading-snug">
                            {option.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

