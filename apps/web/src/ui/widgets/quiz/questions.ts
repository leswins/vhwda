import type { QuizVector } from "../../../sanity/queries/careers"

export type HardFilter = {
    type?: string
    educationLevel?: string // "FF" | "CSC" | "CERT" | "AAS" | "BACH" | "GRAD"
    excludeLicensure?: boolean
    salaryMin?: number // Minimum starting salary in USD
    dealbreakerType?: string // "exclude_requires_lifting" | "exclude_requires_nights_weekends" | "exclude_requires_blood_needles" | "exclude_requires_acute_stress"
    region?: string
    description?: string
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

