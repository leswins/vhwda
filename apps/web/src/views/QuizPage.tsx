import React from "react"
import { useQuizLogic } from "../ui/widgets/quiz/hooks/useQuizLogic"
import {
  QuizError,
  QuizEmpty,
  QuizQuestion,
  QuizNavigation,
  QuizResults,
  MobileQuizSteps,
} from "../ui/widgets/quiz/components"
import { QuizSidebar } from "../ui/widgets/quiz/components/QuizSidebar"
import { VectorModal } from "../ui/widgets/quiz/components/VectorModal"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import shapeClusterImage from "../assets/icons/shape-cluster.svg"

export function QuizPage() {
    const {
        currentStep,
        userVector,
        currentQuestionIndex,
        selectedAnswers,
        visitedQuestions,
        questions,
        loadingQuestions,
        errorLoadingQuestions,
        matchedCareers,
        loadingResults,
        resultsDelayReady,
        currentQuestion,
        hasNext,
        hasPrevious,
        isCurrentQuestionAnswered,
        language,
        handleStart,
        handleAnswer,
        handleNext,
        handleSkip,
        handlePrevious,
        handleCancel,
        handleFinish,
        handleStartOver,
    } = useQuizLogic()

    // Show error/empty states in full width (loading is handled by global loading overlay)
    if (loadingQuestions) {
        // Don't render anything while loading - global loading overlay will show
        return null
    }

    if (errorLoadingQuestions || (questions.length === 0 && !loadingQuestions)) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                {errorLoadingQuestions && <QuizError message={errorLoadingQuestions} />}
                {!loadingQuestions && !errorLoadingQuestions && questions.length === 0 && <QuizEmpty />}
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-123px)] bg-surface overflow-x-hidden">
            <div className="flex flex-1 min-h-0">
                {currentStep === "questions" && currentQuestion ? (
                    <>
                        <QuizSidebar
                            questions={questions}
                            currentQuestionIndex={currentQuestionIndex}
                            selectedAnswers={selectedAnswers}
                            visitedQuestions={visitedQuestions}
                            language={language}
                        />

                        <div className="flex-1 flex flex-col overflow-hidden">
                            <MobileQuizSteps
                                questions={questions}
                                currentQuestionIndex={currentQuestionIndex}
                                visitedQuestions={visitedQuestions}
                                language={language}
                            />

                            <div className="flex-1 overflow-y-auto flex px-fluid-30 pb-fluid-30 pt-fluid-50 lg:items-center lg:justify-center lg:px-12 lg:pb-12 lg:pt-[75px]">
                                <QuizQuestion
                                    question={currentQuestion}
                                    questionNumber={currentQuestionIndex + 1}
                                    totalQuestions={questions.length}
                                    selectedAnswers={selectedAnswers}
                                    language={language}
                                    onAnswer={handleAnswer}
                                />
                            </div>

                            <div className="p-fluid-30 lg:p-8 flex justify-center">
                                <QuizNavigation
                                    hasPrevious={hasPrevious}
                                    hasNext={hasNext}
                                    isCurrentQuestionAnswered={isCurrentQuestionAnswered}
                                    currentQuestion={currentQuestion}
                                    onCancel={handleCancel}
                                    onPrevious={handlePrevious}
                                    onNext={handleNext}
                                    onSkip={handleSkip}
                                    onFinish={handleFinish}
                                />
                            </div>
                        </div>

                        <VectorModal vector={userVector} language={language} />
                    </>
                ) : currentStep === "results" ? (
                    loadingResults || !resultsDelayReady ? null : (
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-0">
                                <QuizResults
                                    loading={loadingResults}
                                    matchedCareers={matchedCareers}
                                    userVector={userVector}
                                    language={language}
                                    onStartOver={handleStartOver}
                                />
                            </div>
                        </div>
                    )
                ) : null}
            </div>

            {currentStep === "questions" && currentQuestion && (
                <div className="relative border-t-[0.5px] border-foreground bg-surface1 overflow-hidden">
                    <div className="w-full p-fluid-50 relative">
                        <p className="text-sub2 font-bold uppercase text-foreground mb-4">
                            {t(language, "quiz.complete.title")}
                        </p>
                        <h3 className="text-h3 text-foreground">
                            {t(language, "quiz.complete.message")}
                        </h3>
                        <img
                            src={shapeClusterImage}
                            alt=""
                            className="block lg:hidden w-[130px] h-auto object-contain absolute right-fluid-20 bottom-0"
                        />
                    </div>
                    <img
                        src={shapeClusterImage}
                        alt=""
                        className="hidden lg:block absolute right-0 w-[170px] h-auto object-contain bottom-0"
                    />
                </div>
            )}
        </div>
    )
}
