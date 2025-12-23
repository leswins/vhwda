/**
 * Quiz queries from Sanity
 */

import { sanityClient } from "../client"
import type { QuizVector } from "./careers"
import type { Question, QuestionOption } from "../../quiz/questions"

/**
 * Quiz document from Sanity
 */
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
      hardFilterField?: string
      hardFilterValue?: string
    }>
  }>
}

/**
 * Query to fetch quiz from Sanity
 */
const QUIZ_QUERY = /* groq */ `
*[_type == "quiz"][0]{
  _id,
  title,
  questions[] | order(order asc){
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
      hardFilterField,
      hardFilterValue
    }
  }
}
`

/**
 * Transform Sanity quiz to our Question format
 */
function transformQuiz(sanityQuiz: SanityQuiz | null, language: "en" | "es"): Question[] {
  if (!sanityQuiz || !sanityQuiz.questions) return []

  return sanityQuiz.questions.map((q, index) => ({
    id: q._key || `q${index + 1}`,
    order: q.order ?? index + 1,
    section: q.section,
    prompt: language === "es" && q.prompt.es ? q.prompt.es : q.prompt.en,
    type: q.type,
    maxSelect: q.maxSelect,
    isDealbreaker: q.isDealbreaker,
    options: q.options.map((opt, optIndex) => ({
      id: opt._key || `${q._key || `q${index + 1}`}_o${optIndex + 1}`,
      label: language === "es" && opt.label.es ? opt.label.es : opt.label.en,
      weights: opt.weights || {},
      hardFilterField: opt.hardFilterField,
      hardFilterValue: opt.hardFilterValue
    }))
  }))
}

/**
 * Fetch quiz questions from Sanity
 */
export async function fetchQuizQuestions(language: "en" | "es" = "en"): Promise<Question[]> {
  const quiz = await sanityClient.fetch<SanityQuiz | null>(QUIZ_QUERY)
  return transformQuiz(quiz, language)
}

