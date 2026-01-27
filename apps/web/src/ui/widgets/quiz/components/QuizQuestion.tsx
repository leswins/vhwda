import React from "react"
import type { Question } from "../questions"
import { LikertSlider } from "./LikertSlider"
import { RatingSlider } from "./RatingSlider"
import { SelectList } from "./SelectList"
import { BooleanToggle } from "./BooleanToggle"
import { t } from "../../../../utils/i18n"

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

    const isDealBreakerQuestion = question.section === "Deal-breakers"
    const isSkillsAptitudes = question.section === "Skills & Aptitudes"
    const isSliderQuestion = question.type === "likert_5" || question.type === "rating_1_5"

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
                        helperText={isSkillsAptitudes ? t(language, "quiz.adjustSliderShort") : undefined}
                        hideValue={isSkillsAptitudes}
                    />
                )

            case "boolean":
                return (
                    <BooleanToggle
                        questionId={question.id}
                        value={getCurrentValue()}
                        options={question.options}
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

    const isSelectQuestion = question.type === "multi_select" || question.type === "single_select"

    return (
        <div className={`flex flex-col items-stretch lg:items-center w-full max-w-full lg:max-w-[600px] ${isSelectQuestion ? "gap-fluid-50" : "gap-[75px]"}`}>
            <div className={`flex flex-col gap-fluid-25 items-center w-full ${isSliderQuestion ? "h-[132px] justify-center" : ""}`}>
                {isSkillsAptitudes && (
                    <p className="text-sub1 font-medium text-foreground text-center">
                        {t(language, "quiz.skillsAptitudes.prompt")}
                    </p>
                )}
                {isDealBreakerQuestion && question.type === "boolean" && (
                    <p className="text-sub1 font-medium leading-[135%] tracking-[-0.025em] text-foreground text-center">
                        {t(language, "quiz.isDealbreaker")}
                    </p>
                )}
                <h2 className="text-h2 font-bold text-foreground text-center w-full">
                    {question.prompt}
                </h2>
            </div>

            {/* Question input component */}
            {isDealBreakerQuestion && question.type === "boolean" ? (
                <div className="flex flex-col items-center gap-6 w-full">
                    {renderQuestionInput()}
                </div>
            ) : (
                renderQuestionInput()
            )}
        </div>
    )
}


