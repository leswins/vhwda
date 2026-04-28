import React, { useState } from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import { QuizResultsHeader } from "./QuizResultsHeader"
import { TopMatchesSection } from "./TopMatchesSection"
import { OtherMatchesSection } from "./OtherMatchesSection"
import { QuizNoResults } from "./QuizNoResults"
import { QuizResultsEmailModal } from "./QuizResultsEmailModal"
import { buildQuizResultsEmailPayload } from "../quizResultsEmail"

type CareerMatch = CareerForMatching & { score: number }

type QuizResultsProps = {
    loading: boolean
    matchedCareers: CareerMatch[]
    userVector: QuizVector
    language: "en" | "es"
    onStartOver: () => void
}

export function QuizResults({
    loading,
    matchedCareers,
    userVector,
    language,
    onStartOver,
}: QuizResultsProps) {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
    const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    if (loading) {
        return null
    }
    
    if (matchedCareers.length === 0) {
        return <QuizNoResults language={language} onStartOver={onStartOver} />
    }
    
    const topMatches = matchedCareers.slice(0, 3)
    const otherMatches = matchedCareers.slice(3)

    function handleOpenEmailModal() {
        setIsEmailModalOpen(true)
        setHasSubmittedEmail(false)
        setSubmitError(null)
    }

    function handleCloseEmailModal() {
        setIsEmailModalOpen(false)
        setIsSubmittingEmail(false)
        setHasSubmittedEmail(false)
        setSubmitError(null)
    }

    async function handleEmailResults(email: string) {
        setIsSubmittingEmail(true)
        setSubmitError(null)

        try {
            const response = await fetch("/api/quiz-results-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    results: buildQuizResultsEmailPayload(matchedCareers, userVector, language),
                }),
            })

            if (!response.ok) {
                throw new Error("quiz-results-email-request-failed")
            }

            setHasSubmittedEmail(true)
        } catch {
            setSubmitError(t(language, "quiz.results.email.error"))
        } finally {
            setIsSubmittingEmail(false)
        }
    }
    
    return (
        <div className="w-full overflow-x-hidden">
            <QuizResultsHeader
                language={language}
                onStartOver={onStartOver}
                onEmailResults={handleOpenEmailModal}
            />
            <TopMatchesSection careers={topMatches} userVector={userVector} language={language} />
            <OtherMatchesSection careers={otherMatches} userVector={userVector} language={language} />
            <QuizResultsEmailModal
                isOpen={isEmailModalOpen}
                isSubmitting={isSubmittingEmail}
                isSubmitted={hasSubmittedEmail}
                submitError={submitError}
                language={language}
                onClose={handleCloseEmailModal}
                onSubmit={handleEmailResults}
            />
        </div>
    )
}