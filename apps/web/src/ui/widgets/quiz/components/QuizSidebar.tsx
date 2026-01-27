import React from "react"
import type { Question } from "../questions"
import { t } from "../../../../utils/i18n"
import checkmarkIcon from "../../../../assets/icons/checkmark.svg"

type QuizSidebarProps = {
    questions: Question[]
    currentQuestionIndex: number
    selectedAnswers: Record<string, string | string[]>
    visitedQuestions: Set<string>
    language: "en" | "es"
}

// Define quiz sections based on Figma design
const QUIZ_SECTIONS = [
    { id: "interests-values", labelKey: "quiz.section.interestsValues" as const, sanityValue: "Interests & Values" },
    { id: "skills-aptitudes", labelKey: "quiz.section.skillsAptitudes" as const, sanityValue: "Skills & Aptitudes" },
    { id: "work-environment", labelKey: "quiz.section.workEnvironment" as const, sanityValue: "Work Environment" },
    { id: "schedule-lifestyle", labelKey: "quiz.section.scheduleLifestyle" as const, sanityValue: "Schedule & Lifestyle" },
    { id: "education-path", labelKey: "quiz.section.educationPath" as const, sanityValue: "Education Path" },
    { id: "salary-outlook", labelKey: "quiz.section.salaryOutlook" as const, sanityValue: "Salary & Outlook" },
    { id: "career-features", labelKey: "quiz.section.careerFeatures" as const, sanityValue: "Career Features" },
    { id: "deal-breakers", labelKey: "quiz.section.dealBreakers" as const, sanityValue: "Deal-breakers" },
]

// Map Sanity section values to sidebar section IDs
const getSectionId = (sanitySection: string | undefined): string | null => {
    if (!sanitySection) return null
    const section = QUIZ_SECTIONS.find(s => s.sanityValue === sanitySection)
    return section?.id || null
}

export function QuizSidebar({ questions, currentQuestionIndex, selectedAnswers, visitedQuestions, language }: QuizSidebarProps) {
    // Group questions by section ID (mapped from Sanity section values)
    const questionsBySection = questions.reduce((acc, q, index) => {
        const sectionId = getSectionId(q.section)
        if (!sectionId) return acc // Skip questions without a valid section
        if (!acc[sectionId]) acc[sectionId] = []
        acc[sectionId].push({ question: q, index })
        return acc
    }, {} as Record<string, Array<{ question: Question; index: number }>>)

    const isSectionCompleted = (sectionId: string) => {
        const sectionQuestions = questionsBySection[sectionId] || []
        if (sectionQuestions.length === 0) return false
        return sectionQuestions.every(({ question }) => {
            return visitedQuestions.has(question.id)
        })
    }

    // Check if current question is in this section
    const isCurrentSection = (sectionId: string) => {
        const sectionQuestions = questionsBySection[sectionId] || []
        return sectionQuestions.some(({ index }) => index === currentQuestionIndex)
    }

    return (
        <div className="flex flex-col w-[380px] border-r border-foreground self-stretch">
            <div className="bg-foreground text-surface p-fluid-30">
                <h2 className="text-h5">
                    {t(language, "quiz.sidebar.title")}
                </h2>
            </div>
            {QUIZ_SECTIONS.map((section) => {
                const isCompleted = isSectionCompleted(section.id)
                const isCurrent = isCurrentSection(section.id)
                
                return (
                    <div
                        key={section.id}
                        className={`
                            flex items-center justify-between px-fluid-30 py-fluid-25 gap-fluid-10
                            border-t border-foreground
                            ${isCurrent ? "bg-surface2" : "bg-surface"}
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
                        <div className="w-icon-25 h-icon-25 flex items-center justify-center">
                            {isCompleted ? (
                                <img src={checkmarkIcon} alt="" className="h-icon-20 w-icon-25" />
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

