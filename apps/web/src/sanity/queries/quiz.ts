
import { sanityClient } from "../client"
import type { QuizVector } from "./careers"
import type { Question, QuestionOption } from "../../ui/widgets/quiz/questions"

type SanityHardFilter = {
  type?: string
  educationLevel?: string
  excludeLicensure?: boolean
  salaryMin?: number
  dealbreakerType?: string
  region?: string
  description?: string
}

type SanityQuiz = {
  _id: string
  title?: { en: string; es?: string }
  questions: Array<{
    _key: string
    order?: number
    title?: { en: string; es?: string }
    section?: string
    prompt: { en: string; es?: string }
    type?: string
    maxSelect?: number
    isDealbreaker?: boolean
    options: Array<{
      _key: string
      label: { en: string; es?: string }
      weights?: Partial<QuizVector>
      hardFilter?: SanityHardFilter
    }>
  }>
}

const QUIZ_QUERY = /* groq */ `
*[_type == "quiz"][0]{
  _id,
  title,
  questions[] | order(coalesce(order, 9999) asc){
    _key,
    order,
    title,
    section,
    prompt,
    type,
    maxSelect,
    isDealbreaker,
    options[]{
      _key,
      label,
      weights,
      hardFilter{
        type,
        educationLevel,
        excludeLicensure,
        salaryMin,
        dealbreakerType,
        region,
        description
      }
    }
  }
}
`

function transformQuiz(sanityQuiz: SanityQuiz | null, language: "en" | "es"): Question[] {
  if (!sanityQuiz || !sanityQuiz.questions) return []

  return sanityQuiz.questions
    .filter(q => q && q._key)
    .map((q, index) => {
      const prompt = (language === "es" && q.prompt?.es) 
        ? q.prompt.es 
        : (q.prompt?.en || "")

      return {
        id: q._key || `q${index + 1}`,
        order: q.order ?? index + 1,
        section: q.section,
        prompt,
        type: q.type,
        maxSelect: q.maxSelect,
        isDealbreaker: q.isDealbreaker,
        options: (q.options || [])
          .filter(opt => opt && opt._key)
          .map((opt, optIndex) => {
            const label = (language === "es" && opt.label?.es)
              ? opt.label.es
              : (opt.label?.en || "")

            const hardFilter = opt.hardFilter && opt.hardFilter.type
              ? {
                  type: opt.hardFilter.type,
                  educationLevel: opt.hardFilter.educationLevel,
                  excludeLicensure: opt.hardFilter.excludeLicensure,
                  salaryMin: opt.hardFilter.salaryMin,
                  dealbreakerType: opt.hardFilter.dealbreakerType,
                  region: opt.hardFilter.region,
                  description: opt.hardFilter.description
                }
              : undefined

            return {
              id: opt._key || `${q._key || `q${index + 1}`}_o${optIndex + 1}`,
              label,
              weights: opt.weights || {},
              hardFilter
            }
          })
      }
    })
    .filter(q => q.prompt && q.options.length > 0)
}

export async function fetchQuizQuestions(language: "en" | "es" = "en"): Promise<Question[]> {
  try {
    const quiz = await sanityClient.fetch<SanityQuiz | null>(QUIZ_QUERY)
    console.log("📥 Raw quiz data from Sanity:", quiz)
    
    if (!quiz) {
      throw new Error("No quiz found in Sanity")
    }
    
    const transformed = transformQuiz(quiz, language)
    console.log("✅ Transformed questions:", transformed)
    
    if (transformed.length === 0) {
      throw new Error("Quiz has no valid questions after transformation")
    }
    
    return transformed
  } catch (error) {
    console.error("❌ Error in fetchQuizQuestions:", error)
    throw error
  }
}

