import type { QuizVector } from "../sanity/queries/careers"

export type QuestionOption = {
    id: string
    label: string
    weights: Partial<QuizVector> // Can affect multiple dimensions
    // Example: { w_patient_facing: 2, w_pediatrics: 1 }
    hardFilterField?: string // e.g., "education_ceiling", "licensure_rule", "dealbreaker"
    hardFilterValue?: string // e.g., "FF", "CSC", "exclude_licensure_required"
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

