import React from "react"
import type { Question } from "../questions"
import { QuestionOption } from "./QuestionOption"

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
    const isMultiSelect = question.type === "multi_select"
    const currentSelection = selectedAnswers[question.id]

    return (
        <div>
            <h2>Question {questionNumber} of {totalQuestions}</h2>
            <p>{question.prompt}</p>
            {isMultiSelect && question.maxSelect && (
                <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                    {language === "es" 
                        ? `Selecciona hasta ${question.maxSelect} opciones`
                        : `Select up to ${question.maxSelect} options`}
                </p>
            )}
            <div>
                {question.options.map((option) => {
                    const isSelected = isMultiSelect
                        ? Array.isArray(currentSelection) && currentSelection.includes(option.id)
                        : currentSelection === option.id
                    const isDisabled = isMultiSelect && 
                        !isSelected && 
                        Array.isArray(currentSelection) && 
                        currentSelection.length >= (question.maxSelect || Infinity)

                    return (
                        <QuestionOption
                            key={option.id}
                            option={option}
                            questionId={question.id}
                            isMultiSelect={isMultiSelect}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            onSelect={onAnswer}
                        />
                    )
                })}
            </div>
        </div>
    )
}


