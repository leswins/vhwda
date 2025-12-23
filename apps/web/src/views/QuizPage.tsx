import React, { useState, useEffect } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { QuizVector } from "../sanity/queries/careers"
import { MOCK_QUESTIONS, type Question } from "../quiz/questions"
import { fetchQuizQuestions } from "../sanity/queries/quiz"

/**
 * Initialize empty quiz vector (all zeros)
 */
function createEmptyVector(): QuizVector {
    return {
        w_patient_facing: 0,
        w_tech_equipment: 0,
        w_lab_research: 0,
        w_counseling_education: 0,
        w_pediatrics: 0,
        w_geriatrics: 0,
        w_exposure_tolerance: 0,
        w_analytical: 0,
        w_admin: 0,
        w_procedural_dexterity: 0,
        w_collaboration: 0,
        w_pace_routine: 0,
        w_pace_fast: 0,
        w_schedule_flex: 0,
        w_stress_tolerance: 0,
        w_physical_light: 0,
        w_physical_on_feet: 0,
        w_physical_lifting: 0,
        w_env_hospital: 0,
        w_env_clinic: 0,
        w_env_community: 0,
        w_env_school: 0,
        w_env_lab: 0,
        w_env_office: 0,
        w_multi_env: 0,
        w_outlook_importance: 0,
        w_short_path: 0
    }
}

export function QuizPage() {
    const { language } = useLanguageStore()
    const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "results">("intro")
    const [userVector, setUserVector] = useState<QuizVector>(createEmptyVector())
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}) // questionId -> optionId
    const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS) // Start with mock, load from Sanity
    const [loadingQuestions, setLoadingQuestions] = useState(false)

    // Load questions from Sanity when component mounts
    useEffect(() => {
        async function loadQuestions() {
            setLoadingQuestions(true)
            try {
                const sanityQuestions = await fetchQuizQuestions(language)
                if (sanityQuestions.length > 0) {
                    setQuestions(sanityQuestions)
                }
                // If no questions in Sanity, keep using MOCK_QUESTIONS
            } catch (error) {
                console.error("Error loading questions from Sanity:", error)
                // Keep using MOCK_QUESTIONS on error
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

        // Save the new answer
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }))
    }

    const currentQuestion = questions[currentQuestionIndex]
    const hasNext = currentQuestionIndex < questions.length - 1
    const hasPrevious = currentQuestionIndex > 0

    const handleFinish = () => {
        setCurrentStep("results")
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            {currentStep === "intro" && (
                <div>
                    <h1>Career Quiz</h1>
                    <p>This quiz will help you find careers that match your preferences.</p>
                    <p>It takes about 6-8 minutes to complete.</p>
                    <button onClick={handleStart}>Start Quiz</button>
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
                    <p>Here is your final user vector (this will be compared with career vectors):</p>
                    <div style={{ padding: "10px", background: "#f5f5f5", fontSize: "12px" }}>
                        <pre>{JSON.stringify(userVector, null, 2)}</pre>
                    </div>
                    <ul>
                        <li>TODO: Calculate from vector comparison</li>
                    </ul>
                    <button onClick={() => setCurrentStep("intro")}>Start Over</button>
                </div>
            )}
        </div>
    )
}


