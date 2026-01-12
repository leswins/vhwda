import React from "react"
import { useQuizLogic } from "../ui/widgets/quiz/hooks/useQuizLogic"
import {
    QuizLoading,
    QuizError,
    QuizEmpty,
    QuizQuestion,
    QuizNavigation,
    QuizResults,
} from "../ui/widgets/quiz/components"
import { QuizSidebar } from "../ui/widgets/quiz/components/QuizSidebar"
import { VectorModal } from "../ui/widgets/quiz/components/VectorModal"

export function QuizPage() {
    const {
        // State
        currentStep,
        userVector,
        currentQuestionIndex,
        selectedAnswers,
        questions,
        loadingQuestions,
        errorLoadingQuestions,
        matchedCareers,
        loadingResults,
        currentQuestion,
        hasNext,
        hasPrevious,
        isCurrentQuestionAnswered,
        language,
        // Actions
        handleStart,
        handleAnswer,
        handleNext,
        handlePrevious,
        handleCancel,
        handleFinish,
        handleStartOver,
    } = useQuizLogic()

    // Show loading/error states in full width
    if (loadingQuestions || errorLoadingQuestions || (questions.length === 0 && !loadingQuestions)) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                {loadingQuestions && <QuizLoading />}
                {errorLoadingQuestions && <QuizError message={errorLoadingQuestions} />}
                {!loadingQuestions && !errorLoadingQuestions && questions.length === 0 && <QuizEmpty />}
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-123px)] bg-surface-background border-t border-on-surface-primary">
            {currentStep === "questions" && currentQuestion ? (
                <>
                    {/* Left sidebar */}
                    <QuizSidebar
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex}
                        selectedAnswers={selectedAnswers}
                        language={language}
                    />

                    {/* Right content area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Question area - scrollable */}
                        <div className="flex-1 overflow-y-auto flex items-center justify-center p-12">
                            <QuizQuestion
                                question={currentQuestion}
                                questionNumber={currentQuestionIndex + 1}
                                totalQuestions={questions.length}
                                selectedAnswers={selectedAnswers}
                                language={language}
                                onAnswer={handleAnswer}
                            />
                        </div>

                        {/* Navigation area - fixed at bottom */}
                        <div className="border-t border-on-surface-primary p-8 flex justify-center">
                            <QuizNavigation
                                hasPrevious={hasPrevious}
                                hasNext={hasNext}
                                isCurrentQuestionAnswered={isCurrentQuestionAnswered}
                                onCancel={handleCancel}
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                                onFinish={handleFinish}
                            />
                        </div>
                    </div>

                    {/* Vector debug modal */}
                    <VectorModal vector={userVector} language={language} />
                </>
            ) : currentStep === "results" ? (
                <div className="flex-1 overflow-y-auto p-8">
                    <QuizResults
                        loading={loadingResults}
                        matchedCareers={matchedCareers}
                        userVector={userVector}
                        language={language}
                        onStartOver={handleStartOver}
                    />
                </div>
            ) : null}
        </div>
    )
}
