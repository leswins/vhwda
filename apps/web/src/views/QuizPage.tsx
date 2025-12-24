import React from "react"
import { useQuizLogic } from "../quiz/hooks/useQuizLogic"
import {
    QuizLoading,
    QuizError,
    QuizIntro,
    QuizEmpty,
    QuizQuestion,
    QuizNavigation,
    VectorDisplay,
    QuizResults,
} from "../quiz/components"

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

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            {loadingQuestions && <QuizLoading />}

            {errorLoadingQuestions && <QuizError message={errorLoadingQuestions} />}

            {!loadingQuestions && !errorLoadingQuestions && currentStep === "intro" && questions.length > 0 && (
                <QuizIntro onStart={handleStart} />
            )}

            {!loadingQuestions && !errorLoadingQuestions && questions.length === 0 && <QuizEmpty />}

            {currentStep === "questions" && currentQuestion && (
                <>
                    <QuizQuestion
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        selectedAnswers={selectedAnswers}
                        language={language}
                        onAnswer={handleAnswer}
                    />
                    <VectorDisplay vector={userVector} />
                    <QuizNavigation
                        hasPrevious={hasPrevious}
                        hasNext={hasNext}
                        onCancel={handleCancel}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onFinish={handleFinish}
                    />
                </>
            )}

            {currentStep === "results" && (
                <QuizResults
                    loading={loadingResults}
                    matchedCareers={matchedCareers}
                    userVector={userVector}
                    language={language}
                    onStartOver={handleStartOver}
                />
            )}
        </div>
    )
}
