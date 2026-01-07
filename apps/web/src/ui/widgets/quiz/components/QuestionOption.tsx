import React from "react"
import type { QuestionOption as QuestionOptionType } from "../questions"

type QuestionOptionProps = {
    option: QuestionOptionType
    questionId: string
    isMultiSelect: boolean
    isSelected: boolean
    isDisabled: boolean
    onSelect: (questionId: string, optionId: string) => void
}

export function QuestionOption({
    option,
    questionId,
    isMultiSelect,
    isSelected,
    isDisabled,
    onSelect,
}: QuestionOptionProps) {
    return (
        <label 
            style={{ 
                display: "block", 
                marginBottom: "10px",
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer"
            }}
        >
            <input 
                type={isMultiSelect ? "checkbox" : "radio"}
                name={`question_${questionId}`}
                value={option.id}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onSelect(questionId, option.id)}
            /> 
            {option.label}
            <span style={{ fontSize: "12px", color: "#666", marginLeft: "10px" }}>
                (weights: {JSON.stringify(option.weights)})
            </span>
        </label>
    )
}


