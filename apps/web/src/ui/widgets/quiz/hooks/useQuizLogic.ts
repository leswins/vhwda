import { useState, useEffect } from "react"
import { useLanguageStore } from "../../../../zustand/useLanguageStore"
import { useGlobalLoadingStore } from "../../../../zustand/useGlobalLoadingStore"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { fetchCareersForQuiz } from "../../../../sanity/queries/careers"
import type { Question } from "../questions"
import { fetchQuizQuestions } from "../../../../sanity/queries/quiz"
import { createEmptyVector, calculateMatchingScore } from "../../../../utils/vector-aux"
import { collectHardFiltersFromAnswers, shouldExcludeCareer } from "../../../../utils/hard-filters"

export type QuizStep = "intro" | "questions" | "results"

export function useQuizLogic() {
    const { language } = useLanguageStore()
    const { setLoading } = useGlobalLoadingStore()
    const [currentStep, setCurrentStep] = useState<QuizStep>("questions")
    const [userVector, setUserVector] = useState<QuizVector>(createEmptyVector())
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({})
    const [questions, setQuestions] = useState<Question[]>([])
    const [loadingQuestions, setLoadingQuestions] = useState(true)
    const [errorLoadingQuestions, setErrorLoadingQuestions] = useState<string | null>(null)
    const [matchedCareers, setMatchedCareers] = useState<Array<CareerForMatching & { score: number }>>([])
    const [loadingResults, setLoadingResults] = useState(false)

    // Load questions from Sanity when component mounts
    useEffect(() => {
        async function loadQuestions() {
            setLoadingQuestions(true)
            setLoading(true)
            setErrorLoadingQuestions(null)
            try {
                const sanityQuestions = await fetchQuizQuestions(language)
                if (sanityQuestions.length > 0) {
                    setQuestions(sanityQuestions)
                    // Automatically start the quiz when questions are loaded
                    setCurrentStep("questions")
                } else {
                    setErrorLoadingQuestions("No questions found in Sanity. Please add questions to the quiz.")
                }
            } catch (error) {
                console.error("Error loading questions from Sanity:", error)
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : "Unknown error"
                console.error("Error details:", errorMessage)
                setErrorLoadingQuestions(`Failed to load questions from Sanity: ${errorMessage}`)
            } finally {
                setLoadingQuestions(false)
                setLoading(false)
            }
        }
        loadQuestions()
    }, [language, setLoading])

    const handleStart = () => {
        setUserVector(createEmptyVector())
        setCurrentQuestionIndex(0)
        setSelectedAnswers({})
        setCurrentStep("questions")
    }

    const handleAnswer = (questionId: string, optionId: string) => {
        const question = questions.find(q => q.id === questionId)
        if (!question) {
            console.warn("Question not found:", questionId)
            return
        }

        const isMultiSelect = question.type === "multi_select"
        const currentSelection = selectedAnswers[questionId]
        const currentSelectedIds = Array.isArray(currentSelection) 
            ? currentSelection 
            : currentSelection 
                ? [currentSelection] 
                : []

        const newOption = question.options.find(o => o.id === optionId)
        if (!newOption) {
            console.warn("Option not found:", { 
                questionId, 
                optionId, 
                availableOptions: question.options.map(o => ({ id: o.id, label: o.label }))
            })
            return
        }

        // For multi-select: toggle selection, respecting maxSelect
        if (isMultiSelect) {
            const isCurrentlySelected = currentSelectedIds.includes(optionId)
            let newSelectedIds: string[]

            if (isCurrentlySelected) {
                // Deselect: remove from array
                newSelectedIds = currentSelectedIds.filter(id => id !== optionId)
            } else {
                // Select: add to array if under maxSelect limit
                const maxSelect = question.maxSelect
                if (maxSelect != null && maxSelect > 0 && currentSelectedIds.length >= maxSelect) {
                    // Already at max, don't add
                    return
                }
                newSelectedIds = [...currentSelectedIds, optionId]
            }

            // Recalculate vector: remove all previous weights, add all new weights
            setUserVector(prev => {
                const updated = { ...prev }
                
                // Remove weights from all previously selected options
                currentSelectedIds.forEach(prevOptionId => {
                    const prevOption = question.options.find(o => o.id === prevOptionId)
                    if (prevOption?.weights) {
                        Object.entries(prevOption.weights).forEach(([dimension, value]) => {
                            const dim = dimension as keyof QuizVector
                            updated[dim] = (updated[dim] || 0) - (value || 0)
                        })
                    }
                })
                
                // Add weights from all newly selected options
                newSelectedIds.forEach(newOptionId => {
                    const opt = question.options.find(o => o.id === newOptionId)
                    if (opt?.weights) {
                        Object.entries(opt.weights).forEach(([dimension, value]) => {
                            const dim = dimension as keyof QuizVector
                            updated[dim] = (updated[dim] || 0) + (value || 0)
                        })
                    }
                })
                
                return updated
            })

            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: newSelectedIds
            }))
        } else {
            // Single-select: replace previous selection
            const previousOptionId = Array.isArray(currentSelection) 
                ? currentSelection[0] 
                : currentSelection
            const previousOption = previousOptionId 
                ? question.options.find(o => o.id === previousOptionId)
                : null

            setUserVector(prev => {
                const updated = { ...prev }
                
                // First subtract previous weight -> then add new weight
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
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleCancel = () => {
        setCurrentStep("intro")
    }

    const handleFinish = async () => {
        setCurrentStep("results")
        setLoadingResults(true)
        setLoading(true)
        
        try {
            // Fetch all careers with quiz data
            const careers = await fetchCareersForQuiz()
            console.log("📥 Careers fetched for matching:", careers.length, careers)
            
            // Collect hard filters from user's answers (deduplicated)
            const userHardFilters = collectHardFiltersFromAnswers(selectedAnswers, questions)
            console.log("🔍 User hard filters:", userHardFilters)
            
            // Calculate matching score for each career and apply hard filters
            const careersWithScores = careers
                .map(career => {
                    const score = calculateMatchingScore(userVector, career.quizVector)
                    return { ...career, score }
                })
                .filter(career => {
                    // First filter: only include careers with positive scores
                    if (career.score <= 0) {
                        return false
                    }
                    
                    // Second filter: exclude careers that don't meet hard filter requirements
                    const shouldExclude = shouldExcludeCareer(userHardFilters, career)
                    if (shouldExclude) {
                        console.log(
                            "❌ Excluding career",
                            career._id,
                            (language === "es" && career.title.es ? career.title.es : career.title.en) ?? "Untitled",
                            "due to hard filter"
                        )
                        return false
                    }
                    
                    return true
                })
                .sort((a, b) => b.score - a.score) // Sort by score descending
            
            console.log("✅ Matching careers (after filters):", careersWithScores.length, careersWithScores)
            setMatchedCareers(careersWithScores)
        } catch (error) {
            console.error("Error calculating career matches:", error)
        } finally {
            setLoadingResults(false)
            setLoading(false)
        }
    }

    const handleStartOver = () => {
        setCurrentStep("intro")
        setUserVector(createEmptyVector())
        setCurrentQuestionIndex(0)
        setSelectedAnswers({})
        setMatchedCareers([])
    }

    const currentQuestion = questions[currentQuestionIndex]
    const hasNext = currentQuestionIndex < questions.length - 1
    const hasPrevious = currentQuestionIndex > 0
    
    const isCurrentQuestionAnswered = (): boolean => {
        if (!currentQuestion) return false
        const answer = selectedAnswers[currentQuestion.id]
        if (!answer) return false
        if (Array.isArray(answer)) {
            return answer.length > 0
        }
        return typeof answer === "string" && answer.length > 0
    }

    return {
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
        isCurrentQuestionAnswered: isCurrentQuestionAnswered(), 
        language,
        // Actions
        handleStart,
        handleAnswer,
        handleNext,
        handlePrevious,
        handleCancel,
        handleFinish,
        handleStartOver,
    }
}


