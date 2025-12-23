/**
 * Quiz Questions Structure
 * Each question has options, and each option can affect multiple vector dimensions
 */

import type { QuizVector } from "../sanity/queries/careers"

/**
 * Question Option
 * Each option has weights that map to vector dimensions
 */
export type QuestionOption = {
    id: string
    label: string
    weights: Partial<QuizVector> // Can affect multiple dimensions
    // Example: { w_patient_facing: 2, w_pediatrics: 1 }
    hardFilterField?: string // e.g., "education_ceiling", "licensure_rule", "dealbreaker"
    hardFilterValue?: string // e.g., "FF", "CSC", "exclude_licensure_required"
}

/**
 * Question
 */
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

/**
 * Mock questions for testing
 */
export const MOCK_QUESTIONS: Question[] = [
    {
        id: "q1",
        prompt: "How much do you enjoy working directly with patients?",
        options: [
            {
                id: "q1_o1",
                label: "Not at all",
                weights: { w_patient_facing: -2 }
            },
            {
                id: "q1_o2",
                label: "A little",
                weights: { w_patient_facing: -1 }
            },
            {
                id: "q1_o3",
                label: "Neutral",
                weights: { w_patient_facing: 0 }
            },
            {
                id: "q1_o4",
                label: "Quite a bit",
                weights: { w_patient_facing: 1 }
            },
            {
                id: "q1_o5",
                label: "Very much",
                weights: { w_patient_facing: 2 }
            }
        ]
    },
    {
        id: "q2",
        prompt: "Do you enjoy working with children?",
        options: [
            {
                id: "q2_o1",
                label: "Not at all",
                weights: { w_pediatrics: -2, w_patient_facing: -1 }
            },
            {
                id: "q2_o2",
                label: "A little",
                weights: { w_pediatrics: -1 }
            },
            {
                id: "q2_o3",
                label: "Neutral",
                weights: { w_pediatrics: 0 }
            },
            {
                id: "q2_o4",
                label: "Quite a bit",
                weights: { w_pediatrics: 1, w_patient_facing: 1 }
            },
            {
                id: "q2_o5",
                label: "Very much",
                weights: { w_pediatrics: 2, w_patient_facing: 1 }
            }
        ]
    }
]

