import type { CareerForMatching, QuizVector } from "../../../sanity/queries/careers"
import type { Language } from "../../../utils/i18n"
import { pickTypicalSalary } from "../../../utils/salary"
import { calculateMatchPercentage } from "../../../utils/vector-aux"

type CareerMatch = CareerForMatching & { score: number }

const EDUCATION_LABELS: Record<string, string> = {
  FF: "FastForward",
  CSC: "Career Studies Certificate",
  CERT: "Certificate",
  AAS: "Associate",
  BACH: "Bachelor's",
  GRAD: "Master's",
}

export type QuizResultsEmailCareer = {
  id: string
  title: string
  careerPath?: string
  matchPercentage: number
  typicalSalary?: string
  salaryRange?: string
  educationLabel?: string
}

export type QuizResultsEmailPayload = {
  language: Language
  topMatches: QuizResultsEmailCareer[]
  otherMatches: QuizResultsEmailCareer[]
  generatedAt: string
}

export type QuizResultsEmailRequest = {
  email: string
  results: QuizResultsEmailPayload
}

function getLocalizedString(language: Language, value?: { en: string; es?: string }): string | undefined {
  if (!value) return undefined
  return language === "es" ? value.es ?? value.en : value.en
}

function formatSalaryRange(salary?: { median?: number; rangeMin?: number; rangeMax?: number }): string | undefined {
  if (!salary) return undefined

  if (salary.rangeMin && salary.rangeMax) {
    return `$${Math.round(salary.rangeMin / 1000)}K-$${Math.round(salary.rangeMax / 1000)}K`
  }

  if (salary.median) {
    return `$${Math.round(salary.median / 1000)}K`
  }

  return undefined
}

function formatEducationLevel(educationMin?: string): string | undefined {
  if (!educationMin) return undefined
  return EDUCATION_LABELS[educationMin] || educationMin
}

function buildEmailCareer(career: CareerMatch, userVector: QuizVector, language: Language): QuizResultsEmailCareer {
  return {
    id: career._id,
    title: getLocalizedString(language, career.title) ?? "",
    careerPath: career.slug ? `/careers/${career.slug}` : undefined,
    matchPercentage: Math.round(calculateMatchPercentage(userVector, career.quizVector || {})),
    typicalSalary: pickTypicalSalary(career.salary),
    salaryRange: formatSalaryRange(career.salary),
    educationLabel: formatEducationLevel(career.educationMin),
  }
}

export function buildQuizResultsEmailPayload(
  matchedCareers: CareerMatch[],
  userVector: QuizVector,
  language: Language
): QuizResultsEmailPayload {
  return {
    language,
    topMatches: matchedCareers.slice(0, 3).map((career) => buildEmailCareer(career, userVector, language)),
    otherMatches: matchedCareers.slice(3).map((career) => buildEmailCareer(career, userVector, language)),
    generatedAt: new Date().toISOString(),
  }
}

export function isValidEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
