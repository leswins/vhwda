import React from "react"
import type { Question } from "../questions"
import { LikertSlider } from "./LikertSlider"
import { RatingSlider } from "./RatingSlider"
import { SelectList } from "./SelectList"
import { BooleanToggle } from "./BooleanToggle"

type QuizQuestionProps = {
    question: Question
    questionNumber: number
    totalQuestions: number
    selectedAnswers: Record<string, string | string[]>
    language: "en" | "es"
    onAnswer: (questionId: string, optionId: string) => void
}

export function QuizQuestion({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswers,
    language,
    onAnswer,
}: QuizQuestionProps) {
    const currentSelection = selectedAnswers[question.id]
    
    // Get current value for different question types
    const getCurrentValue = (): string | null => {
        if (!currentSelection) return null
        if (Array.isArray(currentSelection)) return currentSelection[0] || null
        return currentSelection
    }

    const getSelectedValues = (): string[] => {
        if (!currentSelection) return []
        if (Array.isArray(currentSelection)) return currentSelection
        return [currentSelection]
    }

    // Render the appropriate input component based on question type
    const renderQuestionInput = () => {
        switch (question.type) {
            case "likert_5":
                return (
                    <LikertSlider
                        questionId={question.id}
                        value={getCurrentValue() ? parseInt(getCurrentValue()!) : null}
                        onChange={onAnswer}
                        language={language}
                    />
                )

            case "rating_1_5":
                return (
                    <RatingSlider
                        questionId={question.id}
                        value={getCurrentValue() ? parseInt(getCurrentValue()!) : null}
                        onChange={onAnswer}
                        language={language}
                    />
                )

            case "boolean":
                return (
                    <BooleanToggle
                        questionId={question.id}
                        value={getCurrentValue()}
                        onChange={onAnswer}
                        language={language}
                    />
                )

            case "multi_select":
            case "single_select":
            default:
                return (
                    <SelectList
                        questionId={question.id}
                        options={question.options}
                        selectedValues={getSelectedValues()}
                        isMultiSelect={question.type === "multi_select"}
                        maxSelect={question.maxSelect}
                        onChange={onAnswer}
                    />
                )
        }
    }

    return (
        <div className="flex flex-col gap-[75px] items-center w-full max-w-[600px]">
            {/* Question prompt */}
            <h2 className="text-h3 font-bold tracking-tight leading-tight text-on-surface-primary text-center w-full">
                {question.prompt}
            </h2>

            {/* Question input component */}
            {renderQuestionInput()}
        </div>
    )
}


