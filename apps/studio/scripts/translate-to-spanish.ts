#!/usr/bin/env node
/**
 * Spanish Translation Script for Sanity Content
 *
 * This script translates all English content in Sanity to Spanish using Gemini AI.
 * It handles multiple localization types: LocalizedString, LocalizedText,
 * LocalizedBulletList, LocalizedPortableText, and LocalizedPortableTextSmall.
 *
 * Content Types Processed:
 * - Career: title, summary, responsibilities, workEnvironment, specializations,
 *           specializationsNote, educationRequirements, prerequisites, licensureAndCerts,
 *           academicRequirementsHighlight, programLengthHighlight, salary.notes, outlook.notes
 * - Scholarship: summary, eligibility
 * - Quiz: title, questions[].title, questions[].prompt, questions[].options[].label
 * - Professional Organization: description
 * - Resource: title, summary
 * - Program: prerequisites, accreditation, cost.notes
 * - Career Category: description
 * - Site Settings: navLinks[].label, footerLinks[].label, announcements,
 *                  seoDefaults.title, seoDefaults.description
 *
 * Usage:
 *   pnpm --filter studio tsx scripts/translate-to-spanish.ts [options]
 *
 * Options:
 *   --dry-run       Preview translations without writing to Sanity
 *   --type <type>   Process only specific content type (career, scholarship, quiz, etc.)
 *   --limit <n>     Process only n documents per type
 *   --force         Overwrite existing Spanish translations
 *   --verbose       Show detailed translation progress
 *
 * Environment Variables:
 *   SANITY_API_TOKEN  Sanity write token (required)
 *   GEMINI_API_KEY    Google Gemini API key (required)
 *   GEMINI_MODEL      Gemini model to use (default: gemini-2.0-flash)
 *
 * @example
 *   # Dry run to preview all translations
 *   pnpm --filter studio tsx scripts/translate-to-spanish.ts --dry-run
 *
 *   # Translate only careers with a limit of 5
 *   pnpm --filter studio tsx scripts/translate-to-spanish.ts --type career --limit 5
 *
 *   # Force overwrite existing translations
 *   pnpm --filter studio tsx scripts/translate-to-spanish.ts --force
 */

import "dotenv/config"
import { createClient, type SanityClient } from "@sanity/client"
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const SANITY_PROJECT_ID = "j0yc55ca"
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2024-01-01"

/** Delay between API calls to avoid rate limiting (ms) */
const API_DELAY_MS = 500

/** Content types that can be translated */
const VALID_CONTENT_TYPES = [
  "career",
  "scholarship",
  "quiz",
  "professionalOrganization",
  "resource",
  "program",
  "careerCategory",
  "siteSettings"
] as const

type ContentType = (typeof VALID_CONTENT_TYPES)[number]

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Simple localized string or text field */
interface LocalizedString {
  en?: string
  es?: string
}

/** Localized array of strings (bullet list) */
interface LocalizedBulletList {
  en?: string[]
  es?: string[]
}

/** Portable Text block span */
interface PortableTextSpan {
  _type: "span"
  _key: string
  text?: string
  marks?: string[]
}

/** Portable Text link mark definition */
interface PortableTextLinkMarkDef {
  _type: "link"
  _key: string
  href?: string
}

/** Portable Text block */
interface PortableTextBlock {
  _type: "block"
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: PortableTextSpan[]
  markDefs?: PortableTextLinkMarkDef[]
}

/** Localized Portable Text field */
interface LocalizedPortableText {
  en?: PortableTextBlock[]
  es?: PortableTextBlock[]
}

/** CLI options */
interface CLIOptions {
  dryRun: boolean
  contentType: ContentType | null
  limit: number | null
  force: boolean
  verbose: boolean
}

/** Translation statistics */
interface TranslationStats {
  total: number
  translated: number
  skipped: number
  errors: number
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Argument Parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)

  const options: CLIOptions = {
    dryRun: false,
    contentType: null,
    limit: null,
    force: false,
    verbose: false
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--dry-run":
        options.dryRun = true
        break

      case "--type": {
        const type = args[++i] as ContentType
        if (!VALID_CONTENT_TYPES.includes(type)) {
          console.error(`❌ Invalid content type: ${type}`)
          console.error(`   Valid types: ${VALID_CONTENT_TYPES.join(", ")}`)
          process.exit(1)
        }
        options.contentType = type
        break
      }

      case "--limit": {
        const limit = parseInt(args[++i], 10)
        if (isNaN(limit) || limit < 1) {
          console.error("❌ --limit requires a positive number")
          process.exit(1)
        }
        options.limit = limit
        break
      }

      case "--force":
        options.force = true
        break

      case "--verbose":
        options.verbose = true
        break

      case "--help":
        printHelp()
        process.exit(0)

      default:
        console.error(`❌ Unknown option: ${arg}`)
        printHelp()
        process.exit(1)
    }
  }

  return options
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Spanish Translation Script for Sanity Content

Usage: tsx scripts/translate-to-spanish.ts [options]

Options:
  --dry-run       Preview translations without writing to Sanity
  --type <type>   Process only specific content type
                  Valid types: ${VALID_CONTENT_TYPES.join(", ")}
  --limit <n>     Process only n documents per type
  --force         Overwrite existing Spanish translations
  --verbose       Show detailed translation progress
  --help          Show this help message

Environment Variables:
  SANITY_API_TOKEN  Sanity write token (required)
  GEMINI_API_KEY    Google Gemini API key (required)
  GEMINI_MODEL      Gemini model to use (default: gemini-2.0-flash)

Examples:
  # Dry run to preview all translations
  tsx scripts/translate-to-spanish.ts --dry-run

  # Translate only careers with a limit of 5
  tsx scripts/translate-to-spanish.ts --type career --limit 5

  # Force overwrite existing translations with verbose output
  tsx scripts/translate-to-spanish.ts --force --verbose
`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanity Client Setup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create and configure the Sanity client
 */
function createSanityClient(): SanityClient {
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN environment variable is required")
    console.error("   Get a token from: https://www.sanity.io/manage/project/j0yc55ca/api#tokens")
    process.exit(1)
  }

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini Translation Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translation service using Gemini AI
 */
class TranslationService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel
  private verbose: boolean

  constructor(verbose: boolean = false) {
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY environment variable is required")
      process.exit(1)
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
    this.model = this.genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { temperature: 0.1 } // Low temperature for consistent translations
    })
    this.verbose = verbose

    if (verbose) {
      console.log(`   Using Gemini model: ${modelName}`)
    }
  }

  /**
   * Build translation prompt with healthcare context
   */
  private buildPrompt(text: string, context?: string): string {
    return [
      "You are a professional translator specializing in healthcare and medical terminology.",
      "Translate the following English text to Spanish.",
      "Maintain the same tone, formatting, and any technical/medical terms.",
      "If there are acronyms that are commonly used in Spanish-speaking regions, keep them as-is.",
      "Return ONLY the translated text, no explanations or additional text.",
      "",
      context ? `Context: ${context}` : "",
      "",
      "English text to translate:",
      text
    ]
      .filter(Boolean)
      .join("\n")
  }

  /**
   * Translate a simple string
   */
  async translateString(
    text: string | undefined,
    context?: string
  ): Promise<string | undefined> {
    if (!text || text.trim() === "") {
      return undefined
    }

    try {
      const prompt = this.buildPrompt(text, context)
      const result = await this.model.generateContent(prompt)
      const translation = result.response.text().trim()

      if (this.verbose) {
        console.log(`      EN: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`)
        console.log(`      ES: "${translation.substring(0, 50)}${translation.length > 50 ? "..." : ""}"`)
      }

      await this.delay()
      return translation
    } catch (error) {
      console.error(`      ⚠️  Translation error: ${(error as Error).message}`)
      return undefined
    }
  }

  /**
   * Translate an array of strings (bullet list)
   */
  async translateBulletList(
    items: string[] | undefined,
    context?: string
  ): Promise<string[] | undefined> {
    if (!items || items.length === 0) {
      return undefined
    }

    try {
      // Batch translate all items in one API call for efficiency
      const prompt = [
        "You are a professional translator specializing in healthcare and medical terminology.",
        "Translate each of the following English bullet points to Spanish.",
        "Maintain the same order and formatting.",
        "Return ONLY a JSON array of translated strings, no explanations.",
        "",
        context ? `Context: ${context}` : "",
        "",
        "English bullet points (JSON array):",
        JSON.stringify(items)
      ]
        .filter(Boolean)
        .join("\n")

      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text().trim()

      // Extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("Could not parse JSON array from response")
      }

      const translations = JSON.parse(jsonMatch[0]) as string[]

      if (this.verbose) {
        console.log(`      Translated ${translations.length} bullet points`)
      }

      await this.delay()
      return translations
    } catch (error) {
      console.error(`      ⚠️  Bullet list translation error: ${(error as Error).message}`)
      return undefined
    }
  }

  /**
   * Translate Portable Text blocks
   * Preserves structure (styles, marks, links) while translating text content
   */
  async translatePortableText(
    blocks: PortableTextBlock[] | undefined,
    context?: string
  ): Promise<PortableTextBlock[] | undefined> {
    if (!blocks || blocks.length === 0) {
      return undefined
    }

    try {
      // Extract all text from spans for batch translation
      const textsToTranslate: string[] = []
      const textMap: Map<string, number> = new Map() // text -> index

      for (const block of blocks) {
        if (block.children) {
          for (const child of block.children) {
            if (child.text && child.text.trim() !== "" && !textMap.has(child.text)) {
              textMap.set(child.text, textsToTranslate.length)
              textsToTranslate.push(child.text)
            }
          }
        }
      }

      if (textsToTranslate.length === 0) {
        return undefined
      }

      // Batch translate all texts
      const prompt = [
        "You are a professional translator specializing in healthcare and medical terminology.",
        "Translate each of the following English text segments to Spanish.",
        "Maintain the exact same formatting, spacing, and line breaks.",
        "Return ONLY a JSON array of translated strings in the same order.",
        "",
        context ? `Context: ${context}` : "",
        "",
        "English text segments (JSON array):",
        JSON.stringify(textsToTranslate)
      ]
        .filter(Boolean)
        .join("\n")

      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text().trim()

      // Extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("Could not parse JSON array from response")
      }

      const translations = JSON.parse(jsonMatch[0]) as string[]

      // Build translation lookup
      const translationLookup: Map<string, string> = new Map()
      textsToTranslate.forEach((text, index) => {
        if (translations[index]) {
          translationLookup.set(text, translations[index])
        }
      })

      // Reconstruct blocks with translated text
      const translatedBlocks: PortableTextBlock[] = blocks.map((block) => ({
        ...block,
        children: block.children?.map((child) => ({
          ...child,
          text: child.text ? (translationLookup.get(child.text) ?? child.text) : child.text
        }))
      }))

      if (this.verbose) {
        console.log(`      Translated ${textsToTranslate.length} text segments in ${blocks.length} blocks`)
      }

      await this.delay()
      return translatedBlocks
    } catch (error) {
      console.error(`      ⚠️  Portable text translation error: ${(error as Error).message}`)
      return undefined
    }
  }

  /**
   * Delay to avoid rate limiting
   */
  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS))
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Type Processors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a localized field needs translation
 */
function needsTranslation(
  field: LocalizedString | LocalizedBulletList | LocalizedPortableText | undefined,
  force: boolean
): boolean {
  if (!field) return false

  // Check if English content exists
  const hasEnglish =
    "en" in field &&
    field.en !== undefined &&
    (typeof field.en === "string" ? field.en.trim() !== "" : Array.isArray(field.en) && field.en.length > 0)

  if (!hasEnglish) return false

  // Check if Spanish already exists (unless force is true)
  if (!force) {
    const hasSpanish =
      "es" in field &&
      field.es !== undefined &&
      (typeof field.es === "string" ? field.es.trim() !== "" : Array.isArray(field.es) && field.es.length > 0)

    if (hasSpanish) return false
  }

  return true
}

/**
 * Process Career documents
 */
async function processCareers(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n📋 Processing Careers...")

  const query = `*[_type == "career" && !(_id in path("drafts.**"))]{
    _id,
    title,
    summary,
    responsibilities,
    workEnvironment,
    specializations,
    specializationsNote,
    educationRequirements,
    prerequisites,
    licensureAndCerts,
    academicRequirementsHighlight,
    programLengthHighlight,
    salary,
    outlook
  }`

  const careers = await client.fetch(query)
  const limitedCareers = options.limit ? careers.slice(0, options.limit) : careers
  stats.total = limitedCareers.length

  console.log(`   Found ${careers.length} careers${options.limit ? `, processing ${limitedCareers.length}` : ""}`)

  for (const career of limitedCareers) {
    const careerName = career.title?.en ?? career._id
    console.log(`   Processing: ${careerName}`)

    try {
      const updates: Record<string, unknown> = {}

      // title (LocalizedString)
      if (needsTranslation(career.title, options.force)) {
        const translation = await translator.translateString(career.title?.en, "Healthcare career title")
        if (translation) updates["title.es"] = translation
      }

      // summary (LocalizedText)
      if (needsTranslation(career.summary, options.force)) {
        const translation = await translator.translateString(career.summary?.en, "Healthcare career summary/description")
        if (translation) updates["summary.es"] = translation
      }

      // responsibilities (LocalizedBulletList)
      if (needsTranslation(career.responsibilities, options.force)) {
        const translation = await translator.translateBulletList(career.responsibilities?.en, "Job responsibilities")
        if (translation) updates["responsibilities.es"] = translation
      }

      // workEnvironment (LocalizedBulletList)
      if (needsTranslation(career.workEnvironment, options.force)) {
        const translation = await translator.translateBulletList(career.workEnvironment?.en, "Work environment settings")
        if (translation) updates["workEnvironment.es"] = translation
      }

      // specializations (LocalizedBulletList)
      if (needsTranslation(career.specializations, options.force)) {
        const translation = await translator.translateBulletList(career.specializations?.en, "Career specializations")
        if (translation) updates["specializations.es"] = translation
      }

      // specializationsNote (LocalizedPortableTextSmall)
      if (needsTranslation(career.specializationsNote, options.force)) {
        const translation = await translator.translatePortableText(career.specializationsNote?.en, "Specialization notes")
        if (translation) updates["specializationsNote.es"] = translation
      }

      // educationRequirements (LocalizedPortableTextSmall)
      if (needsTranslation(career.educationRequirements, options.force)) {
        const translation = await translator.translatePortableText(career.educationRequirements?.en, "Education requirements")
        if (translation) updates["educationRequirements.es"] = translation
      }

      // prerequisites (LocalizedPortableText)
      if (needsTranslation(career.prerequisites, options.force)) {
        const translation = await translator.translatePortableText(career.prerequisites?.en, "Career prerequisites")
        if (translation) updates["prerequisites.es"] = translation
      }

      // licensureAndCerts (LocalizedBulletList)
      if (needsTranslation(career.licensureAndCerts, options.force)) {
        const translation = await translator.translateBulletList(career.licensureAndCerts?.en, "Licenses and certifications")
        if (translation) updates["licensureAndCerts.es"] = translation
      }

      // academicRequirementsHighlight (LocalizedString)
      if (needsTranslation(career.academicRequirementsHighlight, options.force)) {
        const translation = await translator.translateString(career.academicRequirementsHighlight?.en, "Academic requirements highlight")
        if (translation) updates["academicRequirementsHighlight.es"] = translation
      }

      // programLengthHighlight (LocalizedString)
      if (needsTranslation(career.programLengthHighlight, options.force)) {
        const translation = await translator.translateString(career.programLengthHighlight?.en, "Program length highlight")
        if (translation) updates["programLengthHighlight.es"] = translation
      }

      // salary.notes (LocalizedString)
      if (career.salary && needsTranslation(career.salary.notes, options.force)) {
        const translation = await translator.translateString(career.salary.notes?.en, "Salary notes")
        if (translation) updates["salary.notes.es"] = translation
      }

      // outlook.notes (LocalizedString)
      if (career.outlook && needsTranslation(career.outlook.notes, options.force)) {
        const translation = await translator.translateString(career.outlook.notes?.en, "Job outlook notes")
        if (translation) updates["outlook.notes.es"] = translation
      }

      // Apply updates
      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
          if (options.verbose) {
            console.log(`         Fields: ${Object.keys(updates).join(", ")}`)
          }
        } else {
          await client.patch(career._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Scholarship documents
 */
async function processScholarships(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n🎓 Processing Scholarships...")

  const query = `*[_type == "scholarship" && !(_id in path("drafts.**"))]{
    _id,
    name,
    summary,
    eligibility
  }`

  const scholarships = await client.fetch(query)
  const limited = options.limit ? scholarships.slice(0, options.limit) : scholarships
  stats.total = limited.length

  console.log(`   Found ${scholarships.length} scholarships${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const scholarship of limited) {
    const name = scholarship.name ?? scholarship._id
    console.log(`   Processing: ${name}`)

    try {
      const updates: Record<string, unknown> = {}

      // summary (LocalizedString)
      if (needsTranslation(scholarship.summary, options.force)) {
        const translation = await translator.translateString(scholarship.summary?.en, "Scholarship summary")
        if (translation) updates["summary.es"] = translation
      }

      // eligibility (LocalizedPortableText)
      if (needsTranslation(scholarship.eligibility, options.force)) {
        const translation = await translator.translatePortableText(scholarship.eligibility?.en, "Scholarship eligibility requirements")
        if (translation) updates["eligibility.es"] = translation
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        } else {
          await client.patch(scholarship._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Quiz documents
 */
async function processQuiz(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n❓ Processing Quiz...")

  const query = `*[_type == "quiz" && !(_id in path("drafts.**"))]{
    _id,
    title,
    questions
  }`

  const quizzes = await client.fetch(query)
  const limited = options.limit ? quizzes.slice(0, options.limit) : quizzes
  stats.total = limited.length

  console.log(`   Found ${quizzes.length} quizzes${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const quiz of limited) {
    const quizTitle = quiz.title?.en ?? quiz._id
    console.log(`   Processing: ${quizTitle}`)

    try {
      const updates: Record<string, unknown> = {}

      // title (LocalizedString)
      if (needsTranslation(quiz.title, options.force)) {
        const translation = await translator.translateString(quiz.title?.en, "Quiz title")
        if (translation) updates["title.es"] = translation
      }

      // Process questions array
      if (quiz.questions && Array.isArray(quiz.questions)) {
        for (let qIndex = 0; qIndex < quiz.questions.length; qIndex++) {
          const question = quiz.questions[qIndex]

          // question.title (LocalizedString - optional)
          if (question.title && needsTranslation(question.title, options.force)) {
            const translation = await translator.translateString(question.title?.en, "Quiz question title")
            if (translation) updates[`questions[${qIndex}].title.es`] = translation
          }

          // question.prompt (LocalizedString)
          if (needsTranslation(question.prompt, options.force)) {
            const translation = await translator.translateString(question.prompt?.en, "Quiz question prompt")
            if (translation) updates[`questions[${qIndex}].prompt.es`] = translation
          }

          // Process options array
          if (question.options && Array.isArray(question.options)) {
            for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
              const option = question.options[oIndex]

              // option.label (LocalizedString)
              if (needsTranslation(option.label, options.force)) {
                const translation = await translator.translateString(option.label?.en, "Quiz answer option")
                if (translation) updates[`questions[${qIndex}].options[${oIndex}].label.es`] = translation
              }
            }
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
          if (options.verbose) {
            console.log(`         Sample fields: ${Object.keys(updates).slice(0, 5).join(", ")}${Object.keys(updates).length > 5 ? "..." : ""}`)
          }
        } else {
          await client.patch(quiz._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Professional Organization documents
 */
async function processProfessionalOrganizations(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n🏛️  Processing Professional Organizations...")

  const query = `*[_type == "professionalOrganization" && !(_id in path("drafts.**"))]{
    _id,
    name,
    description
  }`

  const orgs = await client.fetch(query)
  const limited = options.limit ? orgs.slice(0, options.limit) : orgs
  stats.total = limited.length

  console.log(`   Found ${orgs.length} organizations${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const org of limited) {
    const name = org.name ?? org._id
    console.log(`   Processing: ${name}`)

    try {
      const updates: Record<string, unknown> = {}

      // description (LocalizedText)
      if (needsTranslation(org.description, options.force)) {
        const translation = await translator.translateString(org.description?.en, "Professional organization description")
        if (translation) updates["description.es"] = translation
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        } else {
          await client.patch(org._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Resource documents
 */
async function processResources(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n📚 Processing Resources...")

  const query = `*[_type == "resource" && !(_id in path("drafts.**"))]{
    _id,
    title,
    summary
  }`

  const resources = await client.fetch(query)
  const limited = options.limit ? resources.slice(0, options.limit) : resources
  stats.total = limited.length

  console.log(`   Found ${resources.length} resources${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const resource of limited) {
    const name = resource.title?.en ?? resource._id
    console.log(`   Processing: ${name}`)

    try {
      const updates: Record<string, unknown> = {}

      // title (LocalizedString)
      if (needsTranslation(resource.title, options.force)) {
        const translation = await translator.translateString(resource.title?.en, "Resource title")
        if (translation) updates["title.es"] = translation
      }

      // summary (LocalizedString)
      if (needsTranslation(resource.summary, options.force)) {
        const translation = await translator.translateString(resource.summary?.en, "Resource summary")
        if (translation) updates["summary.es"] = translation
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        } else {
          await client.patch(resource._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Program documents
 */
async function processPrograms(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n📖 Processing Programs...")

  const query = `*[_type == "program" && !(_id in path("drafts.**"))]{
    _id,
    name,
    prerequisites,
    accreditation,
    cost
  }`

  const programs = await client.fetch(query)
  const limited = options.limit ? programs.slice(0, options.limit) : programs
  stats.total = limited.length

  console.log(`   Found ${programs.length} programs${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const program of limited) {
    const name = program.name ?? program._id
    console.log(`   Processing: ${name}`)

    try {
      const updates: Record<string, unknown> = {}

      // prerequisites (LocalizedPortableText)
      if (needsTranslation(program.prerequisites, options.force)) {
        const translation = await translator.translatePortableText(program.prerequisites?.en, "Program prerequisites")
        if (translation) updates["prerequisites.es"] = translation
      }

      // accreditation (LocalizedString)
      if (needsTranslation(program.accreditation, options.force)) {
        const translation = await translator.translateString(program.accreditation?.en, "Program accreditation")
        if (translation) updates["accreditation.es"] = translation
      }

      // cost.notes (LocalizedString)
      if (program.cost && needsTranslation(program.cost.notes, options.force)) {
        const translation = await translator.translateString(program.cost.notes?.en, "Program cost notes")
        if (translation) updates["cost.notes.es"] = translation
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        } else {
          await client.patch(program._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Career Category documents
 */
async function processCareerCategories(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n🏷️  Processing Career Categories...")

  const query = `*[_type == "careerCategory" && !(_id in path("drafts.**"))]{
    _id,
    title,
    description
  }`

  const categories = await client.fetch(query)
  const limited = options.limit ? categories.slice(0, options.limit) : categories
  stats.total = limited.length

  console.log(`   Found ${categories.length} categories${options.limit ? `, processing ${limited.length}` : ""}`)

  for (const category of limited) {
    const name = category.title ?? category._id
    console.log(`   Processing: ${name}`)

    try {
      const updates: Record<string, unknown> = {}

      // description (LocalizedText)
      if (needsTranslation(category.description, options.force)) {
        const translation = await translator.translateString(category.description?.en, "Career category description")
        if (translation) updates["description.es"] = translation
      }

      if (Object.keys(updates).length > 0) {
        if (options.dryRun) {
          console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        } else {
          await client.patch(category._id).set(updates).commit()
          console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
        }
        stats.translated++
      } else {
        console.log(`      ⏭️  Skipped (no fields to translate)`)
        stats.skipped++
      }
    } catch (error) {
      console.error(`      ❌ Error: ${(error as Error).message}`)
      stats.errors++
    }
  }

  return stats
}

/**
 * Process Site Settings document
 */
async function processSiteSettings(
  client: SanityClient,
  translator: TranslationService,
  options: CLIOptions
): Promise<TranslationStats> {
  const stats: TranslationStats = { total: 0, translated: 0, skipped: 0, errors: 0 }

  console.log("\n⚙️  Processing Site Settings...")

  const query = `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
    _id,
    navLinks,
    footerLinks,
    announcements,
    seoDefaults
  }`

  const settings = await client.fetch(query)

  if (!settings) {
    console.log("   No site settings found")
    return stats
  }

  stats.total = 1
  console.log(`   Found site settings document`)

  try {
    const updates: Record<string, unknown> = {}

    // navLinks[].label (LocalizedString)
    if (settings.navLinks && Array.isArray(settings.navLinks)) {
      for (let i = 0; i < settings.navLinks.length; i++) {
        const link = settings.navLinks[i]
        if (needsTranslation(link.label, options.force)) {
          const translation = await translator.translateString(link.label?.en, "Navigation link label")
          if (translation) updates[`navLinks[${i}].label.es`] = translation
        }
      }
    }

    // footerLinks[].label (LocalizedString)
    if (settings.footerLinks && Array.isArray(settings.footerLinks)) {
      for (let i = 0; i < settings.footerLinks.length; i++) {
        const link = settings.footerLinks[i]
        if (needsTranslation(link.label, options.force)) {
          const translation = await translator.translateString(link.label?.en, "Footer link label")
          if (translation) updates[`footerLinks[${i}].label.es`] = translation
        }
      }
    }

    // announcements (LocalizedText)
    if (needsTranslation(settings.announcements, options.force)) {
      const translation = await translator.translateString(settings.announcements?.en, "Site announcement")
      if (translation) updates["announcements.es"] = translation
    }

    // seoDefaults.title (LocalizedString)
    if (settings.seoDefaults?.title && needsTranslation(settings.seoDefaults.title, options.force)) {
      const translation = await translator.translateString(settings.seoDefaults.title?.en, "SEO title")
      if (translation) updates["seoDefaults.title.es"] = translation
    }

    // seoDefaults.description (LocalizedText)
    if (settings.seoDefaults?.description && needsTranslation(settings.seoDefaults.description, options.force)) {
      const translation = await translator.translateString(settings.seoDefaults.description?.en, "SEO description")
      if (translation) updates["seoDefaults.description.es"] = translation
    }

    if (Object.keys(updates).length > 0) {
      if (options.dryRun) {
        console.log(`      🧪 Dry run: would update ${Object.keys(updates).length} fields`)
        if (options.verbose) {
          console.log(`         Fields: ${Object.keys(updates).join(", ")}`)
        }
      } else {
        await client.patch(settings._id).set(updates).commit()
        console.log(`      ✅ Updated ${Object.keys(updates).length} fields`)
      }
      stats.translated++
    } else {
      console.log(`      ⏭️  Skipped (no fields to translate)`)
      stats.skipped++
    }
  } catch (error) {
    console.error(`      ❌ Error: ${(error as Error).message}`)
    stats.errors++
  }

  return stats
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════════════════")
  console.log("  Spanish Translation Script for Sanity Content")
  console.log("═══════════════════════════════════════════════════════════════════")

  const options = parseArgs()

  if (options.dryRun) {
    console.log("\n🧪 DRY RUN MODE - No changes will be made")
  }

  if (options.force) {
    console.log("\n⚠️  FORCE MODE - Existing translations will be overwritten")
  }

  if (options.contentType) {
    console.log(`\n📌 Processing only: ${options.contentType}`)
  }

  if (options.limit) {
    console.log(`\n📊 Limit: ${options.limit} documents per type`)
  }

  const client = createSanityClient()
  const translator = new TranslationService(options.verbose)

  const allStats: Record<string, TranslationStats> = {}

  // Define content type processors
  const processors: Record<ContentType, () => Promise<TranslationStats>> = {
    career: () => processCareers(client, translator, options),
    scholarship: () => processScholarships(client, translator, options),
    quiz: () => processQuiz(client, translator, options),
    professionalOrganization: () => processProfessionalOrganizations(client, translator, options),
    resource: () => processResources(client, translator, options),
    program: () => processPrograms(client, translator, options),
    careerCategory: () => processCareerCategories(client, translator, options),
    siteSettings: () => processSiteSettings(client, translator, options)
  }

  // Process selected or all content types
  const typesToProcess = options.contentType ? [options.contentType] : VALID_CONTENT_TYPES

  for (const contentType of typesToProcess) {
    const processor = processors[contentType]
    if (processor) {
      allStats[contentType] = await processor()
    }
  }

  // Print summary
  console.log("\n═══════════════════════════════════════════════════════════════════")
  console.log("  Summary")
  console.log("═══════════════════════════════════════════════════════════════════")

  let totalDocs = 0
  let totalTranslated = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const [contentType, stats] of Object.entries(allStats)) {
    console.log(`\n   ${contentType}:`)
    console.log(`      Total: ${stats.total}`)
    console.log(`      Translated: ${stats.translated}`)
    console.log(`      Skipped: ${stats.skipped}`)
    console.log(`      Errors: ${stats.errors}`)

    totalDocs += stats.total
    totalTranslated += stats.translated
    totalSkipped += stats.skipped
    totalErrors += stats.errors
  }

  console.log("\n   ─────────────────────────────────")
  console.log(`   TOTAL Documents: ${totalDocs}`)
  console.log(`   TOTAL Translated: ${totalTranslated}`)
  console.log(`   TOTAL Skipped: ${totalSkipped}`)
  console.log(`   TOTAL Errors: ${totalErrors}`)

  if (options.dryRun) {
    console.log("\n🧪 This was a dry run. Run without --dry-run to apply changes.")
  }

  console.log("\n═══════════════════════════════════════════════════════════════════")
  console.log("  Translation Complete")
  console.log("═══════════════════════════════════════════════════════════════════\n")
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
