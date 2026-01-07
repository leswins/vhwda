# Data Model / Contract (Sanity)

This document defines the **initial content contract** based on `prd.md` §8.2. Treat this as the baseline for schema + queries + UI.

## Localization primitives
- **Localized string**: `{ en: string, es?: string }`
- **Localized rich text (Portable Text)**: `{ en: PortableText, es?: PortableText }`
- **Fallback**: prefer `es` when language is Spanish; otherwise fall back to `en` with a UI notice if missing.

## Document types

### `career` (Career)
**Purpose**: core catalog item.

- **Identity**
  - `title`: localized string (required)
  - `slug`: slug (required, derived from `title.en`)
  - `summary`: localized text/string (optional, but recommended)
- **Detail sections** (localized rich text)
  - `responsibilities`
  - `workEnvironment`
  - `educationRequirements`
  - `prerequisites`
- **Salary**
  - `salary.median`: number (optional)
  - `salary.rangeMin`: number (optional)
  - `salary.rangeMax`: number (optional)
  - `salary.notes`: localized string (optional)
  - `salary.source`: string/URL (optional)
  - `salary.year`: number (optional)
- **Outlook**
  - `outlook.label`: string (optional; e.g. High/Medium/Low)
  - `outlook.value`: number (optional)
  - `outlook.notes`: localized string (optional)
  - `outlook.source`: string/URL (optional)
  - `outlook.year`: number (optional)
- **Licensure & Certifications**
  - `licensureAndCerts`: localized array of strings or localized rich text (optional)
- **Taxonomy**
  - `categories`: array of references (optional; initial implementation may use string tags)
  - `tags`: array of references (optional)
- **Relationships**
  - `similarCareers`: array of references to `career` (optional)
  - `programs`: array of references to `program` (optional)
  - `scholarships`: array of references to `scholarship` (optional)
  - `professionalOrgs`: array of references to `professionalOrganization` (optional)
  - `resources`: array of references to `resource` (optional)
- **Media**
  - `images`: array of images (optional)
  - `videoUrl`: URL (optional)
- **Quiz Matching Fields** (for career matching algorithm)
  - `educationMin`: string (optional; "FF" | "CSC" | "CERT" | "AAS" | "BACH" | "GRAD")
  - `licensureRequired`: boolean (optional; does this career require licensure/certification?)
  - `quizVector`: object (optional; 27-dimensional vector for matching)
    - Dimensions: `w_patient_facing`, `w_tech_equipment`, `w_lab_research`, `w_counseling_education`, `w_pediatrics`, `w_geriatrics`, `w_exposure_tolerance`, `w_analytical`, `w_admin`, `w_procedural_dexterity`, `w_collaboration`, `w_pace_routine`, `w_pace_fast`, `w_schedule_flex`, `w_stress_tolerance`, `w_physical_light`, `w_physical_on_feet`, `w_physical_lifting`, `w_env_hospital`, `w_env_clinic`, `w_env_community`, `w_env_school`, `w_env_lab`, `w_env_office`, `w_multi_env`, `w_outlook_importance`, `w_short_path`
    - Each dimension: number (range -2 to +2)
  - `hardRequirements`: object (optional; deal-breaker flags)
    - `requiresLicensure`: boolean
    - `requiresLifting`: boolean
    - `requiresNightsWeekends`: boolean
    - `requiresBloodNeedles`: boolean
    - `requiresAcuteStress`: boolean
- **Governance**
  - `lastReviewedAt`: datetime (optional)
  - `lastUpdatedAt`: datetime (optional)

### `program` (Program / School)
**Purpose**: training provider or program listing.

- `name`: string (required)
- `region`: string (optional)
- `credentialType`: string (optional)
- `duration.value`: number (optional)
- `duration.unit`: string (optional; days/weeks/months/years)
- `cost.rangeMin`: number (optional)
- `cost.rangeMax`: number (optional)
- `cost.notes`: localized string (optional)
- `prerequisites`: localized text/rich text (optional)
- `accreditation`: localized string (optional)
- `link`: URL (optional)

### `scholarship`
**Purpose**: scholarship/financial aid listing.

- `name`: string (required)
- `summary`: localized string (optional)
- `eligibility`: localized text (optional)
- `region`: string (optional)
- `deadline`: date (optional)
- `link`: URL (required)

### `resource`
**Purpose**: generalized resource entries for the hub.

- `category`: string (required; aligned to PRD resource categories)
- `title`: localized string (required)
- `summary`: localized string (optional)
- `link`: URL (required)
- `region`: string (optional)
- `tags`: array (optional)

### `professionalOrganization`
**Purpose**: organization/network listing.

- `name`: string (required)
- `link`: URL (optional)
- `description`: localized text (optional)

### `quiz`
**Purpose**: quiz configuration (questions + scoring/mapping metadata).

- `questions[]` (required)
  - `order`: number (optional; question order 1, 2, 3...)
  - `section`: string (optional; section name like "Interests & Values", "Skills & Aptitudes", etc.)
  - `prompt`: localized string (required)
  - `type`: string (optional; "likert_5" | "rating_1_5" | "multi_select" | "single_select" | "boolean" | "region_select")
  - `maxSelect`: number (optional; for multi_select questions, max number of selections)
  - `isDealbreaker`: boolean (optional; true if this is a deal-breaker question)
  - `options[]` (required)
    - `label`: localized string (required)
    - `weights`: object (optional; partial QuizVector with 27 dimensions, values -2 to +2)
    - `hardFilterField`: string (optional; "education_ceiling" | "licensure_rule" | "dealbreaker" | "min_start_salary" | "region")
    - `hardFilterValue`: string (optional; value for the hard filter, e.g., "FF", "CSC", "exclude_licensure_required", "<35000")

**Note**: See `docs/quiz-system.md` for detailed documentation on the quiz system.

### `siteSettings`
**Purpose**: global settings.

- `nav`: structure (links, labels localized)
- `footerLinks`: structure (links, labels localized)
- `announcements`: localized text (optional)
- `featureFlags`: object (e.g. `aiChatEnabled: boolean`)
- `seoDefaults`: object (title/description localized)


