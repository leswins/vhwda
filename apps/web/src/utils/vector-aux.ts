import type { QuizVector } from "../sanity/queries/careers"

// Ordered list of quiz dimensions used for vector math
export const QUIZ_DIMENSIONS: (keyof QuizVector)[] = [
  "w_patient_facing",
  "w_tech_equipment",
  "w_lab_research",
  "w_counseling_education",
  "w_pediatrics",
  "w_geriatrics",
  "w_exposure_tolerance",
  "w_analytical",
  "w_admin",
  "w_procedural_dexterity",
  "w_collaboration",
  "w_pace_routine",
  "w_pace_fast",
  "w_schedule_flex",
  "w_stress_tolerance",
  "w_physical_light",
  "w_physical_on_feet",
  "w_physical_lifting",
  "w_env_hospital",
  "w_env_clinic",
  "w_env_community",
  "w_env_school",
  "w_env_lab",
  "w_env_office",
  "w_multi_env",
  "w_outlook_importance",
  "w_short_path"
]

// Initialize a zeroed quiz vector
export function createEmptyVector(): QuizVector {
  const vector: QuizVector = {}
  QUIZ_DIMENSIONS.forEach((dim) => {
    vector[dim] = 0
  })
  return vector
}

// Dot-product score between user vector and a career vector
export function calculateMatchingScore(userVector: QuizVector, careerVector?: QuizVector): number {
  if (!careerVector) return 0

  let score = 0
  for (const dim of QUIZ_DIMENSIONS) {
    const userValue = userVector[dim] || 0
    const careerValue = careerVector[dim] || 0
    score += userValue * careerValue
  }
  return score
}
