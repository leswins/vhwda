import React, { useEffect, useRef } from "react"
import type { Question } from "../questions"
import { t } from "../../../../utils/i18n"
import checkmarkIcon from "../../../../assets/icons/checkmark.svg"

type MobileQuizStepsProps = {
  questions: Question[]
  currentQuestionIndex: number
  visitedQuestions: Set<string>
  language: "en" | "es"
}

const QUIZ_SECTIONS = [
  { id: "interests-values", labelKey: "quiz.section.interestsValues" as const, sanityValue: "Interests & Values" },
  { id: "skills-aptitudes", labelKey: "quiz.section.skillsAptitudes" as const, sanityValue: "Skills & Aptitudes" },
  { id: "work-environment", labelKey: "quiz.section.workEnvironment" as const, sanityValue: "Work Environment" },
  { id: "schedule-lifestyle", labelKey: "quiz.section.scheduleLifestyle" as const, sanityValue: "Schedule & Lifestyle" },
  { id: "education-path", labelKey: "quiz.section.educationPath" as const, sanityValue: "Education Path" },
  { id: "salary-outlook", labelKey: "quiz.section.salaryOutlook" as const, sanityValue: "Salary & Outlook" },
  { id: "career-features", labelKey: "quiz.section.careerFeatures" as const, sanityValue: "Career Features" },
  { id: "deal-breakers", labelKey: "quiz.section.dealBreakers" as const, sanityValue: "Deal-breakers" },
] as const

const getSectionId = (sanitySection: string | undefined): string | null => {
  if (!sanitySection) return null
  const section = QUIZ_SECTIONS.find(s => s.sanityValue === sanitySection)
  return section?.id || null
}

export function MobileQuizSteps({
  questions,
  currentQuestionIndex,
  visitedQuestions,
  language,
}: MobileQuizStepsProps) {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const questionsBySection = questions.reduce((acc, q, index) => {
    const sectionId = getSectionId(q.section)
    if (!sectionId) return acc
    if (!acc[sectionId]) acc[sectionId] = []
    acc[sectionId].push({ question: q, index })
    return acc
  }, {} as Record<string, Array<{ question: Question; index: number }>>)

  const isSectionCompleted = (sectionId: string) => {
    const sectionQuestions = questionsBySection[sectionId] || []
    if (sectionQuestions.length === 0) return false
    return sectionQuestions.every(({ question }) => visitedQuestions.has(question.id))
  }

  const isCurrentSection = (sectionId: string) => {
    const sectionQuestions = questionsBySection[sectionId] || []
    return sectionQuestions.some(({ index }) => index === currentQuestionIndex)
  }

  useEffect(() => {
    const currentSectionEntry = Object.entries(questionsBySection).find(([sectionId]) =>
      isCurrentSection(sectionId)
    )
    if (!currentSectionEntry) return

    const [sectionId] = currentSectionEntry
    const sectionOrderIndex = QUIZ_SECTIONS.findIndex(section => section.id === sectionId)

    // Avoid auto-scrolling when we're in the last two sections
    if (sectionOrderIndex >= QUIZ_SECTIONS.length - 2) {
      return
    }

    const element = itemRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [currentQuestionIndex, questionsBySection])

  return (
    <div className="lg:hidden border-b-[0.5px] border-foreground bg-surface1">
      <div className="px-fluid-20 py-fluid-15 flex gap-fluid-15 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {QUIZ_SECTIONS.map(section => {
          const isCompleted = isSectionCompleted(section.id)
          const isCurrent = isCurrentSection(section.id)

          return (
            <div
              key={section.id}
              ref={el => {
                itemRefs.current[section.id] = el
              }}
              className={`flex items-center gap-fluid-7 whitespace-nowrap snap-start flex-shrink-0 ${
                !isCompleted && !isCurrent ? "opacity-50" : ""
              }`}
            >
              <div className="w-icon-20 h-icon-20 flex items-center justify-center">
                {isCompleted ? (
                  <img src={checkmarkIcon} alt="" className="h-icon-20 w-icon-20" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      opacity={isCurrent ? 1 : 0.3}
                    />
                  </svg>
                )}
              </div>
              <p
                className={`text-body-sm ${
                  isCurrent ? "text-foreground" : "text-muted"
                }`}
              >
                {t(language, section.labelKey)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

