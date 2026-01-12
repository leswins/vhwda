import React from "react"
import type { Question } from "../questions"
import { t } from "../../../../utils/i18n"

type QuizSidebarProps = {
    questions: Question[]
    currentQuestionIndex: number
    selectedAnswers: Record<string, string | string[]>
    language: "en" | "es"
}

// Define quiz sections based on Figma design
const QUIZ_SECTIONS = [
    { id: "interests-values", labelKey: "quiz.section.interestsValues" as const },
    { id: "skills-aptitudes", labelKey: "quiz.section.skillsAptitudes" as const },
    { id: "work-environment", labelKey: "quiz.section.workEnvironment" as const },
    { id: "schedule-lifestyle", labelKey: "quiz.section.scheduleLifestyle" as const },
    { id: "education-path", labelKey: "quiz.section.educationPath" as const },
    { id: "salary-outlook", labelKey: "quiz.section.salaryOutlook" as const },
    { id: "career-features", labelKey: "quiz.section.careerFeatures" as const },
    { id: "deal-breakers", labelKey: "quiz.section.dealBreakers" as const },
]

export function QuizSidebar({ questions, currentQuestionIndex, selectedAnswers, language }: QuizSidebarProps) {
    // Group questions by section
    const questionsBySection = questions.reduce((acc, q, index) => {
        const section = q.section || "other"
        if (!acc[section]) acc[section] = []
        acc[section].push({ question: q, index })
        return acc
    }, {} as Record<string, Array<{ question: Question; index: number }>>)

    // Check if a section is completed
    const isSectionCompleted = (sectionId: string) => {
        const sectionQuestions = questionsBySection[sectionId] || []
        return sectionQuestions.every(({ question }) => {
            const answer = selectedAnswers[question.id]
            if (!answer) return false
            if (Array.isArray(answer)) return answer.length > 0
            return typeof answer === "string" && answer.length > 0
        })
    }

    // Check if current question is in this section
    const isCurrentSection = (sectionId: string) => {
        const sectionQuestions = questionsBySection[sectionId] || []
        return sectionQuestions.some(({ index }) => index === currentQuestionIndex)
    }

    return (
        <div className="flex flex-col w-[380px] h-full border-r border-foreground">
            <div className="bg-foreground text-surface p-[30px]">
                <h2 className="text-h5">
                    {t(language, "quiz.title")}
                </h2>
            </div>
            {QUIZ_SECTIONS.map((section) => {
                const isCompleted = isSectionCompleted(section.id)
                const isCurrent = isCurrentSection(section.id)
                
                return (
                    <div
                        key={section.id}
                        className={`
                            flex items-center justify-between px-[30px] py-[25px] gap-[10px]
                            border-t border-foreground
                            ${isCurrent ? "bg-surface1" : "bg-surface"}
                        `}
                    >
                        <p
                            className={`
                                flex-1 text-body-base
                                ${!isCompleted && !isCurrent ? "opacity-50" : ""}
                            `}
                        >
                            {t(language, section.labelKey)}
                        </p>
                        <div className="w-[25px] h-[25px] flex items-center justify-center">
                            {isCompleted ? (
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path
                                        d="M9 12.5L11.5 15L16 10M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <circle
                                        cx="12.5"
                                        cy="12.5"
                                        r="11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        opacity={isCurrent ? "1" : "0.3"}
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

