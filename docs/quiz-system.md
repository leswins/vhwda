# Quiz System Documentation

This document describes the career matching quiz system implemented in the VHWDA Health Careers Catalog application.

## Overview

The quiz system allows users to answer questions about their preferences, skills, and constraints. Based on their answers, the system builds a **user vector** that is compared against **career vectors** to find the best matching careers.

## Core Concepts

### Important: Universal Weight System

**All question options, regardless of question type, have a `weights` field** that can affect any of the 27 vector dimensions. The question type (likert_5, multi_select, boolean, etc.) only determines:
- How the user interacts with the question (single vs. multiple selection)
- How the UI displays the options

But the underlying mechanism is the same: **every option has weights that accumulate into the user vector**.

For example:
- A `likert_5` question option might have `{ w_patient_facing: 2 }`
- A `boolean` question option might have `{ w_stress_tolerance: -2 }`
- A `multi_select` question option might have `{ w_env_hospital: 2, w_env_clinic: 1 }`

All of these contribute to the same user vector.

### 1. Quiz Vector

A **Quiz Vector** is a 27-dimensional numerical representation of preferences and characteristics. Each dimension ranges from -2 to +2, where:
- **-2**: Strong negative preference
- **-1**: Negative preference
- **0**: Neutral
- **+1**: Positive preference
- **+2**: Strong positive preference

#### Vector Dimensions

**Interest Dimensions:**
- `w_patient_facing`: Preference for direct patient/client interaction
- `w_tech_equipment`: Enjoyment of using technology/equipment
- `w_lab_research`: Interest in lab work and research tasks
- `w_counseling_education`: Interest in educating or counseling
- `w_pediatrics`: Preference for working with children/teens
- `w_geriatrics`: Preference for working with older adults
- `w_exposure_tolerance`: Comfort with blood, needles, medical procedures
- `w_analytical`: Preference for solving complex problems using data
- `w_admin`: Preference for administrative/office work
- `w_procedural_dexterity`: Interest in procedures using tools/equipment
- `w_collaboration`: Preference for team-based work

**Pace & Schedule Dimensions:**
- `w_pace_routine`: Preference for routine, predictable pace
- `w_pace_fast`: Preference for fast-paced/urgent work
- `w_schedule_flex`: Need for schedule flexibility
- `w_stress_tolerance`: Comfort in high-stress situations

**Physical Dimensions:**
- `w_physical_light`: Preference for light deskwork
- `w_physical_on_feet`: Comfort being on feet most of the day
- `w_physical_lifting`: Ability/comfort with frequent lifting/positioning

**Environment Dimensions:**
- `w_env_hospital`: Preference for hospital setting
- `w_env_clinic`: Preference for outpatient clinic
- `w_env_community`: Preference for community/home setting
- `w_env_school`: Preference for school setting
- `w_env_lab`: Preference for lab setting
- `w_env_office`: Preference for office/administrative setting
- `w_multi_env`: Preference for varied workplaces

**Additional Dimensions:**
- `w_outlook_importance`: Importance of job outlook/growth
- `w_short_path`: Preference for hands-on training and short-term credentials

### 2. User Vector Accumulation

As the user answers questions, their **user vector** is built by:
1. Starting with all dimensions at 0
2. For each question answered:
   - If the user changes an answer, **subtract** the weights from the previous option
   - **Add** the weights from the newly selected option
3. The final user vector represents their overall preferences

**Example:**
```
Initial vector: all zeros
User selects "Very much" for "Working with patients" → adds { w_patient_facing: 2 }
User changes to "A little" → subtracts { w_patient_facing: 2 }, adds { w_patient_facing: -1 }
Final: { w_patient_facing: -1, ... }
```

### 3. Career Vector

Each career in the system has a **career vector** (`quizVector` field) that represents the ideal user profile for that career. This vector has the same 27 dimensions as the user vector.

### 4. Hard Requirements (Deal-breakers)

**Hard Requirements** are boolean flags on careers that exclude them from results if the user refuses them. These are stored in the `hardRequirements` field on each career:

- `requiresLicensure`: Career requires licensure/certification
- `requiresLifting`: Career requires heavy lifting or patient transfers
- `requiresNightsWeekends`: Career requires nights/weekends/holidays
- `requiresBloodNeedles`: Career requires exposure to blood/needles/bodily fluids
- `requiresAcuteStress`: Career requires working in emergencies/high-acuity settings

**Filtering Logic:**
- If user answers "No" to a deal-breaker question, exclude all careers where the corresponding `hardRequirements` field is `true`
- Example: If user says "I cannot do heavy lifting", exclude all careers where `hardRequirements.requiresLifting === true`

### 5. Additional Hard Filters

Beyond deal-breakers, there are other hard filters:

**Education Ceiling (Q21):**
- User selects maximum education level they're willing to pursue
- Exclude careers where `educationMin` is higher than user's ceiling
- Education levels (ordered): `FF` < `CSC` < `CERT` < `AAS` < `BACH` < `GRAD`

**Minimum Starting Salary (Q24):**
- User selects minimum salary requirement
- Exclude careers where `salary.rangeMin` is below user's minimum

**Licensure Willingness (Q22):**
- If user answers "No" to "I'm willing to complete required licensure", exclude careers where `licensureRequired === true`

## Schema Structure

### Quiz Document (`quiz`)

Located in: `apps/studio/src/schemaTypes/documents/quiz.ts`

```typescript
{
  questions: [
    {
      order: number,              // Question order (1, 2, 3...)
      section: string,             // Section name (e.g., "Interests & Values")
      prompt: { en: string, es?: string },
      type: string,                // "likert_5", "rating_1_5", "multi_select", 
                                   // "single_select", "boolean", "region_select"
      maxSelect?: number,          // For multi_select questions
      isDealbreaker?: boolean,     // True if this is a deal-breaker question
      options: [
        {
          label: { en: string, es?: string },
          weights: {                // Partial QuizVector
            w_patient_facing?: number,
            // ... other dimensions
          },
          hardFilterField?: string, // "education_ceiling", "licensure_rule", 
                                   // "dealbreaker", "min_start_salary", "region"
          hardFilterValue?: string  // Value for the hard filter
        }
      ]
    }
  ]
}
```

### Career Document (`career`)

Located in: `apps/studio/src/schemaTypes/documents/career.ts`

**Quiz-related fields:**

```typescript
{
  educationMin?: string,           // "FF" | "CSC" | "CERT" | "AAS" | "BACH" | "GRAD"
  licensureRequired?: boolean,     // Does this career require licensure?
  
  quizVector?: {                   // Career's ideal user profile
    w_patient_facing?: number,
    // ... all 27 dimensions
  },
  
  hardRequirements?: {             // Deal-breaker flags
    requiresLicensure?: boolean,
    requiresLifting?: boolean,
    requiresNightsWeekends?: boolean,
    requiresBloodNeedles?: boolean,
    requiresAcuteStress?: boolean
  },
  
  salary?: {
    rangeMin?: number,             // Entry level salary (for hard filter)
    // ... other salary fields
  }
}
```

## Question Types

**Important**: Regardless of question type, **all options** have a `weights` field that can affect any of the 27 vector dimensions. The question type only determines how the user interacts with the question (single selection, multiple selection, etc.), but the underlying mechanism of accumulating weights into the user vector is the same.

### 1. Likert 5-point Scale (`likert_5`)
- 5 options: Strongly disagree, Disagree, Neutral, Agree, Strongly agree
- Each option has `weights` that typically map to: -2, -1, 0, +1, +2
- Example: Q01-Q08, Q19, Q27-Q30
- **Note**: Each option's `weights` can affect multiple dimensions simultaneously

### 2. Rating 1-5 (`rating_1_5`)
- 5 options: 1, 2, 3, 4, 5
- Each option has `weights` using the transform **(value - 3)**, yielding:  
  - 1 → -2, 2 → -1, 3 → 0, 4 → +1, 5 → +2  
  - En Sanity, ingresa directamente estos valores en `weights` para cada opción.
- Example: Q09-Q14
- **Note**: The transformation is conceptual; in Sanity, you directly set the weight values

### 3. Multi-select (`multi_select`)
- User can select up to `maxSelect` options (typically 3)
- **Each selected option contributes its `weights` to the user vector**
- If user selects multiple options, all their weights are added together
- Example: Q15 (work settings, max 3)
- **Note**: When user deselects an option, its weights are subtracted

### 4. Single-select (`single_select`)
- User selects exactly one option
- The selected option's `weights` are added to the user vector
- Example: Q16 (work pace), Q17 (teaming style), Q20 (physical activity)
- **Note**: Changing selection subtracts previous option's weights and adds new option's weights

### 5. Boolean (`boolean`)
- Two options: Yes/No
- Often used for deal-breakers
- Each option has `weights` (can be 0 if it only affects hard filters)
- Example: Q18, Q22, QD1-QD4
- **Note**: Even deal-breaker questions can have weights that affect the vector

### 6. Region Select (`region_select`)
- Dynamic list from app's region data
- Each region option has `weights`
- Example: Q26
- **Note**: May primarily use `hardFilterValue` for region filtering, but can also affect vector dimensions

## Implementation Details

### Frontend Types

**Location:** `apps/web/src/quiz/questions.ts`

```typescript
export type QuestionOption = {
  id: string
  label: string
  weights: Partial<QuizVector>
  hardFilterField?: string
  hardFilterValue?: string
}

export type Question = {
  id: string
  order?: number
  section?: string
  prompt: string
  type?: string
  maxSelect?: number
  isDealbreaker?: boolean
  options: QuestionOption[]
}
```

### Quiz Vector Type

**Location:** `apps/web/src/sanity/queries/careers.ts`

```typescript
export type QuizVector = {
  w_patient_facing?: number
  // ... all 27 dimensions
}

export type HardRequirements = {
  requiresLicensure?: boolean
  requiresLifting?: boolean
  requiresNightsWeekends?: boolean
  requiresBloodNeedles?: boolean
  requiresAcuteStress?: boolean
}
```

### Fetching Quiz Questions

**Location:** `apps/web/src/sanity/queries/quiz.ts`

```typescript
export async function fetchQuizQuestions(language: "en" | "es"): Promise<Question[]>
```

- Fetches the quiz document from Sanity
- Transforms localized strings based on language
- Returns questions ordered by `order` field
- Falls back to mock questions if Sanity data is unavailable

### Quiz Page Component

**Location:** `apps/web/src/views/QuizPage.tsx`

**State Management:**
- `currentStep`: "intro" | "questions" | "results"
- `userVector`: Accumulated QuizVector
- `currentQuestionIndex`: Current question being shown
- `selectedAnswers`: Record of questionId → optionId
- `questions`: Array of Question objects

**Key Functions:**
- `createEmptyVector()`: Creates a QuizVector with all dimensions at 0
- `handleAnswer(questionId, optionId)`: Updates userVector by subtracting previous option weights and adding new option weights

## Matching Algorithm (To Be Implemented)

The matching algorithm will:

1. **Apply Hard Filters:**
   - Filter out careers that don't meet education ceiling
   - Filter out careers below minimum salary
   - Filter out careers that require refused deal-breakers
   - Filter out careers requiring licensure if user refuses

2. **Calculate Similarity Score:**
   - Compare user vector with each career's quizVector
   - Use cosine similarity or dot product
   - Consider only non-zero dimensions

3. **Rank Results:**
   - Sort careers by similarity score
   - Return top N matches

## Question Sections

Based on the quiz structure:

1. **Interests & Values** (Q01-Q08)
2. **Skills & Aptitudes** (Q09-Q14)
3. **Work Environment** (Q15-Q17)
4. **Schedule & Lifestyle** (Q18-Q20)
5. **Education Path** (Q21-Q23)
6. **Salary & Outlook** (Q24-Q25)
7. **Location & Access** (Q26)
8. **Career Features** (Q27-Q30)
9. **Deal-breakers** (QD1-QD4)

## Data Flow

```
User answers questions
    ↓
handleAnswer() updates userVector
    ↓
User completes quiz
    ↓
Apply hard filters to careers
    ↓
Calculate similarity scores
    ↓
Display ranked results
```

## Future Enhancements

- [ ] Implement matching algorithm
- [ ] Add result explanation (why each career matches)
- [ ] Support for saving/loading quiz progress
- [ ] A/B testing for question order
- [ ] Analytics on question responses
- [ ] Dynamic question branching based on answers

## References

- Schema definitions: `apps/studio/src/schemaTypes/documents/`
- Frontend types: `apps/web/src/quiz/` and `apps/web/src/sanity/queries/`
- Quiz component: `apps/web/src/views/QuizPage.tsx`
- Data model: `docs/data-model.md`

