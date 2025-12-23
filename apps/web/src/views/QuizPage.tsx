import React, { useState, useEffect } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { QuizVector, CareerForMatching } from "../sanity/queries/careers"
import { fetchCareersForQuiz } from "../sanity/queries/careers"
import type { Question } from "../quiz/questions"
import { fetchQuizQuestions } from "../sanity/queries/quiz"
import { createEmptyVector, calculateMatchingScore } from "../utils/vector-aux"

export function QuizPage() {
    const { language } = useLanguageStore()
    const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "results">("intro")
    const [userVector, setUserVector] = useState<QuizVector>(createEmptyVector())
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}) // questionId -> optionId
    const [questions, setQuestions] = useState<Question[]>([]) // Load from Sanity
    const [loadingQuestions, setLoadingQuestions] = useState(true)
    const [errorLoadingQuestions, setErrorLoadingQuestions] = useState<string | null>(null)
    const [matchedCareers, setMatchedCareers] = useState<Array<CareerForMatching & { score: number }>>([])
    const [loadingResults, setLoadingResults] = useState(false)

    // Load questions from Sanity when component mounts
    useEffect(() => {
        async function loadQuestions() {
            setLoadingQuestions(true)
            setErrorLoadingQuestions(null)
            try {
                const sanityQuestions = await fetchQuizQuestions(language)
                if (sanityQuestions.length > 0) {
                    setQuestions(sanityQuestions)
                } else {
                    setErrorLoadingQuestions("No questions found in Sanity. Please add questions to the quiz.")
                }
            } catch (error) {
                console.error("Error loading questions from Sanity:", error)
                setErrorLoadingQuestions("Failed to load questions from Sanity. Please try again later.")
            } finally {
                setLoadingQuestions(false)
            }
        }
        loadQuestions()
    }, [language])

    const handleStart = () => {
        setUserVector(createEmptyVector())
        setCurrentQuestionIndex(0)
        setSelectedAnswers({})
        setCurrentStep("questions")
    }

    const handleAnswer = (questionId: string, optionId: string) => {
        const question = questions.find(q => q.id === questionId)
        if (!question) return

        const previousOptionId = selectedAnswers[questionId]
        const previousOption = previousOptionId 
            ? question.options.find(o => o.id === previousOptionId)
            : null

        const newOption = question.options.find(o => o.id === optionId)
        if (!newOption) return

        setUserVector(prev => {
            const updated = { ...prev }
            
            // First substract previous weight -> then add new weight
            if (previousOption?.weights) {
                Object.entries(previousOption.weights).forEach(([dimension, value]) => {
                    const dim = dimension as keyof QuizVector
                    updated[dim] = (updated[dim] || 0) - (value || 0)
                })
            }
            if (newOption.weights) {
                Object.entries(newOption.weights).forEach(([dimension, value]) => {
                    const dim = dimension as keyof QuizVector
                    updated[dim] = (updated[dim] || 0) + (value || 0)
                })
            }
            
            return updated
        })

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }))
    }

    const currentQuestion = questions[currentQuestionIndex]
    const hasNext = currentQuestionIndex < questions.length - 1
    const hasPrevious = currentQuestionIndex > 0

    const handleFinish = async () => {
        setCurrentStep("results")
        setLoadingResults(true)
        
        try {
            // Fetch all careers with quiz data
            const careers = await fetchCareersForQuiz()
            console.log("📥 Careers fetched for matching:", careers.length, careers)
            
            // Calculate matching score for each career
            const careersWithScores = careers
                .map(career => {
                    const score = calculateMatchingScore(userVector, career.quizVector)
                    console.log(
                        "➡️ Score",
                        score,
                        "for career",
                        career._id,
                        (language === "es" && career.title.es ? career.title.es : career.title.en) ?? "Untitled",
                        "quizVector:",
                        career.quizVector
                    )
                    return { ...career, score }
                })
                .filter(career => career.score > 0) // Only include careers with positive scores
                .sort((a, b) => b.score - a.score) // Sort by score descending
            
            console.log("✅ Matching careers (score > 0):", careersWithScores.length, careersWithScores)
            setMatchedCareers(careersWithScores)
        } catch (error) {
            console.error("Error calculating career matches:", error)
        } finally {
            setLoadingResults(false)
        }
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            {loadingQuestions && (
                <div>
                    <h1>Loading Quiz...</h1>
                    <p>Please wait while we load the questions from Sanity.</p>
                </div>
            )}

            {errorLoadingQuestions && (
                <div>
                    <h1>Error Loading Quiz</h1>
                    <p style={{ color: "red" }}>{errorLoadingQuestions}</p>
                </div>
            )}

            {!loadingQuestions && !errorLoadingQuestions && currentStep === "intro" && questions.length > 0 && (
                <div>
                    <h1>Career Quiz</h1>
                    <p>This quiz will help you find careers that match your preferences.</p>
                    <p>It takes about 6-8 minutes to complete.</p>
                    <button onClick={handleStart}>Start Quiz</button>
                </div>
            )}

            {!loadingQuestions && !errorLoadingQuestions && questions.length === 0 && (
                <div>
                    <h1>No Questions Available</h1>
                    <p>No questions found. Please add questions to the quiz in Sanity Studio.</p>
                </div>
            )}

            {currentStep === "questions" && currentQuestion && (
                <div>
                    <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
                    {loadingQuestions && <p>Loading questions from Sanity...</p>}
                    <p>{currentQuestion.prompt}</p>
                    <div>
                        {currentQuestion.options.map((option) => (
                            <label key={option.id} style={{ display: "block", marginBottom: "10px" }}>
                                <input 
                                    type="radio" 
                                    name={`question_${currentQuestion.id}`}
                                    value={option.id}
                                    checked={selectedAnswers[currentQuestion.id] === option.id}
                                    onChange={() => handleAnswer(currentQuestion.id, option.id)}
                                /> 
                                {option.label}
                                <span style={{ fontSize: "12px", color: "#666", marginLeft: "10px" }}>
                                    (weights: {JSON.stringify(option.weights)})
                                </span>
                            </label>
                        ))}
                    </div>
                    
                    <div style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", fontSize: "12px" }}>
                        <strong>Current Vector (accumulating):</strong>
                        <pre>{JSON.stringify(userVector, null, 2)}</pre>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <button onClick={() => setCurrentStep("intro")}>Cancel</button>
                        {hasPrevious && (
                            <button 
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                style={{ marginLeft: "10px" }}
                            >
                                Previous
                            </button>
                        )}
                        {hasNext ? (
                            <button 
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                style={{ marginLeft: "10px" }}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                onClick={handleFinish}
                                style={{ marginLeft: "10px" }}
                            >
                                Finish Quiz
                            </button>
                        )}
                    </div>
                </div>
            )}

            {currentStep === "results" && (
                <div>
                    <h1>Your Results</h1>
                    
                    {loadingResults && (
                        <p>Calculating your career matches...</p>
                    )}
                    
                    {!loadingResults && matchedCareers.length > 0 && (
                        <div>
                            <h2>Top Matching Careers</h2>
                            <ul>
                                {matchedCareers.slice(0, 10).map((career) => (
                                    <li key={career._id} style={{ marginBottom: "10px", padding: "10px", background: "#f5f5f5" }}>
                                        <strong>{language === "es" && career.title.es ? career.title.es : career.title.en}</strong>
                                        <br />
                                        <span style={{ fontSize: "12px", color: "#666" }}>
                                            Matching Score: {career.score.toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {!loadingResults && matchedCareers.length === 0 && (
                        <p>No matching careers found. Try adjusting your answers.</p>
                    )}
                    
                    <div style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", fontSize: "12px" }}>
                        <strong>Your User Vector:</strong>
                        <pre>{JSON.stringify(userVector, null, 2)}</pre>
                    </div>
                    
                    <button onClick={() => setCurrentStep("intro")} style={{ marginTop: "20px" }}>Start Over</button>
                </div>
            )}
        </div>
    )
}


