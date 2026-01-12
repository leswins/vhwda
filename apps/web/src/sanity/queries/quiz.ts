
import { sanityClient } from "../client"
import type { QuizVector } from "./careers"
import type { Question, QuestionOption } from "../../ui/widgets/quiz/questions"

type SanityHardFilter = {
  requiresLicensure?: boolean
  requiresLifting?: boolean
  requiresNightsWeekends?: boolean
  requiresBloodNeedles?: boolean
  requiresAcuteHighStress?: boolean
  hasMinimumEducation?: boolean
  educationLevel?: string
  hasMinimumSalary?: boolean
  region?: string
  description?: string
  type?: string // Legacy
  excludeLicensure?: boolean // Legacy
  salaryMin?: number // Legacy
  dealbreakerType?: string // Legacy
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
        requiresLicensure,
        requiresLifting,
        requiresNightsWeekends,
        requiresBloodNeedles,
        requiresAcuteHighStress,
        hasMinimumEducation,
        educationLevel,
        hasMinimumSalary,
        region,
        description,
        type,
        excludeLicensure,
        salaryMin,
        dealbreakerType
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

      // For likert_5 and rating_1_5 questions, ensure we have 5 options with IDs "1", "2", "3", "4", "5"
      const isLikertOrRating = q.type === "likert_5" || q.type === "rating_1_5"
      
      let options: QuestionOption[]
      
      if (isLikertOrRating && q.options && q.options.length >= 5) {
        // Map existing options to IDs "1", "2", "3", "4", "5" based on their order
        options = q.options
          .filter(opt => opt && opt._key)
          .slice(0, 5) // Take first 5 options
          .map((opt, optIndex) => {
            const label = (language === "es" && opt.label?.es)
              ? opt.label.es
              : (opt.label?.en || "")

            const hardFilter = opt.hardFilter && (
              opt.hardFilter.requiresLicensure ||
              opt.hardFilter.requiresLifting ||
              opt.hardFilter.requiresNightsWeekends ||
              opt.hardFilter.requiresBloodNeedles ||
              opt.hardFilter.requiresAcuteHighStress ||
              opt.hardFilter.hasMinimumEducation ||
              opt.hardFilter.hasMinimumSalary ||
              opt.hardFilter.region ||
              opt.hardFilter.type // Legacy support
            )
              ? {
                  requiresLicensure: opt.hardFilter.requiresLicensure,
                  requiresLifting: opt.hardFilter.requiresLifting,
                  requiresNightsWeekends: opt.hardFilter.requiresNightsWeekends,
                  requiresBloodNeedles: opt.hardFilter.requiresBloodNeedles,
                  requiresAcuteHighStress: opt.hardFilter.requiresAcuteHighStress,
                  hasMinimumEducation: opt.hardFilter.hasMinimumEducation,
                  educationLevel: opt.hardFilter.educationLevel,
                  hasMinimumSalary: opt.hardFilter.hasMinimumSalary,
                  region: opt.hardFilter.region,
                  description: opt.hardFilter.description,
                  type: opt.hardFilter.type,
                  excludeLicensure: opt.hardFilter.excludeLicensure,
                  salaryMin: opt.hardFilter.salaryMin,
                  dealbreakerType: opt.hardFilter.dealbreakerType
                }
              : undefined

            return {
              id: String(optIndex + 1), // Use "1", "2", "3", "4", "5" as IDs
              label,
              weights: opt.weights || {},
              hardFilter
            }
          })
      } else {
        // For other question types, use the original mapping
        options = (q.options || [])
          .filter(opt => opt && opt._key)
          .map((opt, optIndex) => {
            const label = (language === "es" && opt.label?.es)
              ? opt.label.es
              : (opt.label?.en || "")

            const hardFilter = opt.hardFilter && (
              opt.hardFilter.requiresLicensure ||
              opt.hardFilter.requiresLifting ||
              opt.hardFilter.requiresNightsWeekends ||
              opt.hardFilter.requiresBloodNeedles ||
              opt.hardFilter.requiresAcuteHighStress ||
              opt.hardFilter.hasMinimumEducation ||
              opt.hardFilter.hasMinimumSalary ||
              opt.hardFilter.region ||
              opt.hardFilter.type // Legacy support
            )
              ? {
                  requiresLicensure: opt.hardFilter.requiresLicensure,
                  requiresLifting: opt.hardFilter.requiresLifting,
                  requiresNightsWeekends: opt.hardFilter.requiresNightsWeekends,
                  requiresBloodNeedles: opt.hardFilter.requiresBloodNeedles,
                  requiresAcuteHighStress: opt.hardFilter.requiresAcuteHighStress,
                  hasMinimumEducation: opt.hardFilter.hasMinimumEducation,
                  educationLevel: opt.hardFilter.educationLevel,
                  hasMinimumSalary: opt.hardFilter.hasMinimumSalary,
                  region: opt.hardFilter.region,
                  description: opt.hardFilter.description,
                  type: opt.hardFilter.type,
                  excludeLicensure: opt.hardFilter.excludeLicensure,
                  salaryMin: opt.hardFilter.salaryMin,
                  dealbreakerType: opt.hardFilter.dealbreakerType
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

      return {
        id: q._key || `q${index + 1}`,
        order: q.order ?? index + 1,
        section: q.section,
        prompt,
        type: q.type,
        maxSelect: q.maxSelect,
        isDealbreaker: q.isDealbreaker,
        options
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

