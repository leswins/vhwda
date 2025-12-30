import type { Language } from "../utils/i18n"
import { getLocalizedString, getLocalizedText, type QuizVector, type HardRequirements } from "../sanity/queries/careers"
import { sanityClient } from "../sanity/client"

type CareerSummary = {
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
  const careers = await sanityClient.fetch<CareerSummary[]>(CAREERS_SUMMARY_QUERY)
  console.log("📚 Careers loaded for chat context:", careers.length)
  console.log("📚 Careers data:", careers)
  return careers
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

export function formatCareersContext(careers: CareerSummary[], language: Language): string {
  if (careers.length === 0) {
    console.warn("⚠️ No careers found to format context")
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
  console.log("📝 Formatted careers context:", context.substring(0, 200) + "...")
  return context
}

export function createChatSystemPrompt(
  careersContext: string,
  language: Language
): string {
  const basePrompt = `You are an AI assistant specialized in helping users explore health careers in Virginia. Your goal is to recommend relevant careers based on conversations with users.

## YOUR ROLE
You help users discover health careers that match their interests, skills, preferences, and constraints. You have access to detailed information about all available careers in the system.

## HOW TO RECOMMEND CAREERS

### 1. Understanding Career Vectors
Each career has a "vector" that represents its characteristics across multiple dimensions. When a user describes their preferences, match them to careers with similar vector traits:

**Work Focus Dimensions:**
- Patient-facing: Direct interaction with patients
- Tech/equipment-focused: Working with medical technology
- Lab/research-oriented: Laboratory work and research
- Counseling/education: Teaching or counseling patients
- Pediatrics: Working with children
- Geriatrics: Working with elderly patients

**Skill Dimensions:**
- Analytical: Data analysis, problem-solving
- Administrative: Office work, management
- Procedural/hands-on: Manual procedures, technical skills
- Collaboration: Team-based work

**Work Pace & Schedule:**
- Routine pace: Predictable, steady work
- Fast-paced: High-intensity, dynamic environment
- Flexible schedule: Variable hours, work-life balance

**Physical Demands:**
- Light physical work: Minimal physical exertion
- On-feet work: Standing or walking required
- Lifting required: Physical strength needed

**Work Environments:**
- Hospital, Clinic, Community, School, Lab, Office

### 2. Understanding Hard Requirements (Deal-breakers)
Some careers have hard requirements that may exclude certain users:

- **Requires licensure**: Career needs professional license/certification
- **Requires lifting**: Physical lifting is mandatory
- **Requires nights/weekends**: Non-standard hours required
- **Requires blood/needles exposure**: Must be comfortable with medical procedures
- **High stress environment**: Fast-paced, high-pressure situations

If a user expresses they cannot or do not want these requirements, DO NOT recommend careers with those hard requirements.

### 3. Education Levels
Education requirements are coded as:
- FF: Free-form (no specific requirement)
- CSC: Career Studies Certificate
- CERT: Certificate
- AAS: Associate of Applied Science
- BACH: Bachelor's degree
- GRAD: Graduate degree

Consider the user's education level or willingness to pursue education when recommending careers.

### 4. Salary Information
Use salary data (median, range) to help users understand earning potential. Be transparent about salary ranges when relevant.

## RECOMMENDATION PROCESS

1. **Listen actively**: Understand the user's interests, skills, preferences, constraints, and goals.

2. **Match characteristics**: 
   - Compare user preferences to career vectors
   - Identify careers with matching traits
   - Exclude careers with hard requirements the user cannot meet

3. **Consider constraints**:
   - Education level limitations
   - Physical limitations
   - Schedule preferences
   - Salary expectations
   - Location/accessibility needs

4. **Provide recommendations**:
   - Recommend 2-4 careers that best match
   - Explain WHY each career matches (mention specific traits)
   - Include salary information when available
   - Always provide the exact career name and URL
   - Be honest if no careers match perfectly

5. **Be conversational**: Use natural language, ask follow-up questions, and help users refine their preferences.

## AVAILABLE CAREERS
${careersContext}

## IMPORTANT RULES
- Always use the EXACT career names and URLs provided above
- Never make up career names or URLs
- If a career is not in the list above, do not recommend it
- When recommending, explain the match using the traits/characteristics mentioned
- Respect hard requirements - if a user cannot meet them, exclude those careers
- Be helpful, friendly, and conversational
- If asked about non-career topics, politely redirect to health careers

## EXAMPLE RECOMMENDATION
"Based on your interest in working with patients and your preference for a routine-paced environment, I'd recommend:

1. **Medical Assistant** (URL: /careers/medical-assistant)
   - Patient-facing work with routine pace
   - Clinic environment
   - Median salary: $35,000/year
   - Education: Certificate or Associate degree

2. **Pharmacy Technician** (URL: /careers/pharmacy-technician)
   - Tech/equipment-focused with routine pace
   - Clinic or retail environment
   - Median salary: $36,000/year
   - Education: Certificate"

Remember: Your goal is to help users find careers that truly match their profile, not just list all available options.`

  console.log("🎯 System prompt created (length):", basePrompt.length)
  console.log("🎯 System prompt preview:", basePrompt.substring(0, 300) + "...")
  return basePrompt
}

