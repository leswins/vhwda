import type { Language } from "../utils/i18n"
import { sanityClient } from "../sanity/client"
import { getLocalizedString, getLocalizedText, type QuizVector, type HardRequirements } from "../sanity/queries/careers"

export type CareerSummary = {
  _id: string
  slug?: string
  title: { en: string; es?: string }
  summary?: { en: string; es?: string }
  quizVector?: QuizVector
  hardRequirements?: HardRequirements
  educationMin?: string
  licensureRequired?: boolean
  salary?: {
    rangeMin?: number
    rangeMax?: number
    median?: number
  }
}

const CAREERS_SUMMARY_QUERY = /* groq */ `
*[_type == "career"]{
  _id,
  "slug": slug.current,
  title,
  summary,
  quizVector,
  hardRequirements,
  educationMin,
  licensureRequired,
  salary{
    rangeMin,
    rangeMax,
    median
  }
}
`

export async function fetchCareersForChat(): Promise<CareerSummary[]> {
  return await sanityClient.fetch<CareerSummary[]>(CAREERS_SUMMARY_QUERY)
}

function formatVectorInfo(career: CareerSummary): string {
  if (!career.quizVector) return ""
  
  const vector = career.quizVector
  const traits: string[] = []
  
  if (vector.w_patient_facing && vector.w_patient_facing > 0) traits.push("patient-facing")
  if (vector.w_tech_equipment && vector.w_tech_equipment > 0) traits.push("tech/equipment-focused")
  if (vector.w_lab_research && vector.w_lab_research > 0) traits.push("lab/research-oriented")
  if (vector.w_counseling_education && vector.w_counseling_education > 0) traits.push("counseling/education")
  if (vector.w_pediatrics && vector.w_pediatrics > 0) traits.push("pediatrics")
  if (vector.w_geriatrics && vector.w_geriatrics > 0) traits.push("geriatrics")
  if (vector.w_analytical && vector.w_analytical > 0) traits.push("analytical")
  if (vector.w_admin && vector.w_admin > 0) traits.push("administrative")
  if (vector.w_procedural_dexterity && vector.w_procedural_dexterity > 0) traits.push("procedural/hands-on")
  if (vector.w_collaboration && vector.w_collaboration > 0) traits.push("collaborative")
  if (vector.w_pace_routine && vector.w_pace_routine > 0) traits.push("routine pace")
  if (vector.w_pace_fast && vector.w_pace_fast > 0) traits.push("fast-paced")
  if (vector.w_schedule_flex && vector.w_schedule_flex > 0) traits.push("flexible schedule")
  if (vector.w_physical_light && vector.w_physical_light > 0) traits.push("light physical work")
  if (vector.w_physical_on_feet && vector.w_physical_on_feet > 0) traits.push("on-feet work")
  if (vector.w_physical_lifting && vector.w_physical_lifting > 0) traits.push("lifting required")
  
  const envs: string[] = []
  if (vector.w_env_hospital && vector.w_env_hospital > 0) envs.push("hospital")
  if (vector.w_env_clinic && vector.w_env_clinic > 0) envs.push("clinic")
  if (vector.w_env_community && vector.w_env_community > 0) envs.push("community")
  if (vector.w_env_school && vector.w_env_school > 0) envs.push("school")
  if (vector.w_env_lab && vector.w_env_lab > 0) envs.push("lab")
  if (vector.w_env_office && vector.w_env_office > 0) envs.push("office")
  
  let info = ""
  if (traits.length > 0) {
    info += ` Traits: ${traits.slice(0, 5).join(", ")}`
  }
  if (envs.length > 0) {
    info += ` Environments: ${envs.join(", ")}`
  }
  
  return info
}

function formatHardRequirements(career: CareerSummary): string {
  if (!career.hardRequirements) return ""
  
  const reqs: string[] = []
  if (career.hardRequirements.requiresLicensure) reqs.push("requires licensure")
  if (career.hardRequirements.requiresLifting) reqs.push("requires lifting")
  if (career.hardRequirements.requiresNightsWeekends) reqs.push("requires nights/weekends")
  if (career.hardRequirements.requiresBloodNeedles) reqs.push("requires blood/needles exposure")
  if (career.hardRequirements.requiresAcuteStress) reqs.push("high stress environment")
  
  return reqs.length > 0 ? ` Requirements: ${reqs.join(", ")}` : ""
}

export async function getCareersContext(language: Language, careersCache?: CareerSummary[]): Promise<string> {
  const careers = careersCache && careersCache.length > 0 
    ? careersCache 
    : await fetchCareersForChat()
  
  if (careers.length === 0) {
    return ""
  }

  const careersList = careers
    .map((career) => {
      const title = getLocalizedString(language, career.title) || "Untitled"
      const summary = getLocalizedText(language, career.summary) || ""
      const slug = career.slug || ""
      const url = slug ? `/careers/${slug}` : ""
      
      const salary = career.salary?.median 
        ? ` Salary: $${career.salary.median.toLocaleString()}/year (median)`
        : career.salary?.rangeMin 
          ? ` Salary: $${career.salary.rangeMin.toLocaleString()}-${career.salary.rangeMax?.toLocaleString() || 'N/A'}/year`
          : ""
      
      const education = career.educationMin 
        ? ` Education: ${career.educationMin}`
        : ""
      
      const vectorInfo = formatVectorInfo(career)
      const hardReqs = formatHardRequirements(career)

      let careerInfo = `- ${title}`
      if (summary) {
        careerInfo += `: ${summary}`
      }
      if (salary) {
        careerInfo += salary
      }
      if (education) {
        careerInfo += education
      }
      if (vectorInfo) {
        careerInfo += vectorInfo
      }
      if (hardReqs) {
        careerInfo += hardReqs
      }
      if (url) {
        careerInfo += ` (URL: ${url})`
      }

      return careerInfo
    })
    .join("\n")

  const context = `Available careers in the system:\n${careersList}`
  return context
}

export function createChatSystemPrompt(
  careersContext: string,
  language: Language
): string {
  const basePrompt = `You are an AI assistant helping users find health careers in Virginia. Your PRIMARY GOAL is to quickly redirect users to specific career pages. Keep responses SHORT to minimize token usage.

## YOUR ROLE
Quickly match users to careers and redirect them to career detail pages. Ask clarifying questions if requests are too generic.

## QUIZ VECTOR PARAMETERS - Understanding Career Characteristics

Each career has a "quiz vector" with weighted parameters. Use these to match user preferences:

### Work Focus Dimensions:
- **w_patient_facing**: Direct interaction with patients (high = more patient contact)
- **w_tech_equipment**: Working with medical technology/equipment
- **w_lab_research**: Laboratory work and research activities
- **w_counseling_education**: Teaching or counseling patients/families
- **w_pediatrics**: Working with children
- **w_geriatrics**: Working with elderly patients

### Skill Dimensions:
- **w_analytical**: Data analysis, problem-solving, critical thinking
- **w_admin**: Office work, management, administrative tasks
- **w_procedural_dexterity**: Manual procedures, technical hands-on skills
- **w_collaboration**: Team-based work, working with others

### Work Pace & Schedule:
- **w_pace_routine**: Predictable, steady, routine-paced work
- **w_pace_fast**: High-intensity, dynamic, fast-paced environment
- **w_schedule_flex**: Variable hours, work-life balance, flexible schedule

### Physical Demands:
- **w_physical_light**: Minimal physical exertion, sedentary work
- **w_physical_on_feet**: Standing or walking required for extended periods
- **w_physical_lifting**: Physical strength needed, lifting required

### Work Environments:
- **w_env_hospital**: Hospital setting
- **w_env_clinic**: Clinic/outpatient setting
- **w_env_community**: Community-based work
- **w_env_school**: School setting
- **w_env_lab**: Laboratory setting
- **w_env_office**: Office setting

### Other Parameters:
- **w_exposure_tolerance**: Comfort with blood, needles, bodily fluids
- **w_stress_tolerance**: Ability to handle high-stress situations
- **w_multi_env**: Works across multiple environments
- **w_outlook_importance**: Job growth/outlook significance
- **w_short_path**: Quick entry/short training path

### Hard Requirements (Deal-breakers):
- **requiresLicensure**: Must have professional license/certification
- **requiresLifting**: Physical lifting is mandatory
- **requiresNightsWeekends**: Non-standard hours required
- **requiresBloodNeedles**: Must be comfortable with medical procedures involving blood/needles
- **requiresAcuteStress**: Fast-paced, high-pressure situations

If a user expresses they CANNOT or DO NOT WANT these requirements, DO NOT recommend careers with those hard requirements.

## RESPONSE STRATEGY

### When user request is SPECIFIC:
1. Keep introduction text SHORT (1-2 sentences max)
2. Immediately provide JSON with 2-4 matching career slugs
3. Redirect users to career pages quickly

### When user request is TOO GENERIC:
1. Ask 1-2 clarifying questions to narrow down preferences
2. Focus on key dimensions: patient-facing preference, work environment, physical demands, schedule flexibility
3. Do NOT provide JSON until you have enough information to make specific recommendations
4. Examples of clarifying questions:
   - "Do you prefer working directly with patients or in a lab/research setting?"
   - "Are you looking for a fast-paced environment or something more routine?"
   - "Do you have any physical limitations or preferences regarding standing/lifting?"
   - "What's your preferred work environment: hospital, clinic, community, or office?"

## RESPONSE FORMAT
When recommending careers, respond in this format:

1. SHORT introduction (1-2 sentences) - minimize tokens
2. JSON with career slugs ONLY in a code block:

\`\`\`json
{
  "careers": [
    {
      "slug": "career-slug"
    }
  ]
}
\`\`\`

**CRITICAL**: 
- NEVER include JSON in the plain text response
- ONLY include JSON inside the \`\`\`json code block
- The text before the code block should be natural language ONLY
- Do NOT repeat career information in the text if it's already in the JSON

## CRITICAL RULES
- **MINIMIZE TOKENS**: Keep all text responses brief
- **REDIRECT FAST**: Get users to career pages as quickly as possible
- **USE EXACT SLUGS**: Only use slugs from the available careers list
- **MATCH VECTORS**: Compare user preferences to quiz vector parameters
- **RESPECT HARD REQUIREMENTS**: Never recommend careers with deal-breakers the user cannot meet
- **ASK IF UNCLEAR**: If request is too generic, ask 1-2 targeted questions before recommending

## AVAILABLE CAREERS
${careersContext}

Remember: Be brief, match quickly, redirect fast. Minimize token usage while being helpful.`

  return basePrompt
}

export function getCareersBySlugs(slugs: string[], careersCache?: CareerSummary[]): Promise<CareerSummary[]> {
  if (slugs.length === 0) return Promise.resolve([])
  
  if (careersCache && careersCache.length > 0) {
    return Promise.resolve(
      careersCache.filter(career => career.slug && slugs.includes(career.slug))
    )
  }
  
  return fetchCareersForChat().then(careers => 
    careers.filter(career => career.slug && slugs.includes(career.slug))
  )
}
