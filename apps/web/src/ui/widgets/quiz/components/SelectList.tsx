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
        <div className="flex flex-col gap-[12px] w-full max-w-full lg:max-w-[530px] relative z-10">
            {options.map((option) => {
                const isSelected = selectedValues.includes(option.id)
                // Only disable if: multi-select AND not selected AND maxSelect is defined (not null/undefined) AND we've reached the max
                // For single-select, never disable (except if explicitly disabled)
                const isDisabled = isMultiSelect 
                    ? (!isSelected && maxSelect != null && maxSelect > 0 && selectedValues.length >= maxSelect)
                    : false

                const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    // Early return if already disabled
                    if (isDisabled) {
                        return
                    }
                    
                    // Double-check the disabled condition before allowing the click
                    // This prevents race conditions where state hasn't updated yet
                    const currentSelectedCount = selectedValues.length
                    const wouldBeDisabled = isMultiSelect 
                        ? (!isSelected && maxSelect != null && maxSelect > 0 && currentSelectedCount >= maxSelect)
                        : false
                    
                    if (wouldBeDisabled) {
                        return
                    }
                    
                    // Only call onChange if we pass all checks
                    onChange(questionId, option.id)
                }

                return (
                    <button
                        key={option.id}
                        onClick={handleClick}
                        type="button"
                        aria-disabled={isDisabled}
                        style={{ position: 'relative', zIndex: 10 }}
                        className={`
                            flex items-center gap-[16px] px-[24px] py-[18px]
                            border border-foreground
                            text-left transition-all
                            relative
                            ${isSelected 
                                ? "bg-foreground text-surface" 
                                : "bg-surface text-foreground hover:bg-surface1"
                            }
                            ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        `}
                    >
                        {/* Checkbox/Radio indicator */}
                        <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0 pointer-events-none">
                            {isMultiSelect ? (
                                // Checkbox
                                <div
                                    className={`
                                        w-[24px] h-[24px] border-2 flex items-center justify-center
                                        ${isSelected 
                                            ? "bg-surface border-surface" 
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
                                                className="text-foreground"
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
                                            ? "bg-surface border-surface" 
                                            : "bg-transparent border-current"
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="w-[10px] h-[10px] rounded-full bg-foreground" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Option label */}
                        <span className="flex-1 text-body-base pointer-events-none">
                            {option.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

