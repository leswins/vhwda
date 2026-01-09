import type { QuizVector } from "../../../sanity/queries/careers"

export type HardFilter = {
    requiresLicensure?: boolean
    requiresLifting?: boolean
    requiresNightsWeekends?: boolean
    requiresBloodNeedles?: boolean
    requiresAcuteHighStress?: boolean
    hasMinimumEducation?: boolean
    educationLevel?: string // "FF" | "CSC" | "CERT" | "AAS" | "BACH" | "GRAD"
    hasMinimumSalary?: boolean // When true, uses career's salary.rangeMin
    region?: string
    description?: string
    type?: string // Legacy field for backward compatibility
    excludeLicensure?: boolean // Legacy field
    salaryMin?: number // Legacy field
    dealbreakerType?: string // Legacy field
}

export type QuestionOption = {
    id: string
    label: string
    weights: Partial<QuizVector> // Can affect multiple dimensions
    // Example: { w_patient_facing: 2, w_pediatrics: 1 }
    hardFilter?: HardFilter // Structured hard filter
}

export type Question = {
    id: string
    order?: number
    section?: string
    prompt: string
    type?: string // "likert_5", "rating_1_5", "multi_select", "single_select", "boolean", "region_select"
    maxSelect?: number // For multi_select questions
    isDealbreaker?: boolean
    options: QuestionOption[]
}

