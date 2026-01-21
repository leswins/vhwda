#!/usr/bin/env node
import "dotenv/config"
import { createClient } from "@sanity/client"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { professionalOrganization } from "../src/schemaTypes/documents/professional-organization"

type LocalizedText = {
  en?: string
  es?: string
}

type ProfessionalOrganization = {
  _id: string
  name?: string
  link?: string
  description?: LocalizedText
  membershipType?: string[]
  geographicFocus?: string
  careerAreas?: Array<{ _ref: string }>
}

type EnumOption = { title: string; value: string }

const client = createClient({
  projectId: "j0yc55ca",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN
})

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const limitIndex = args.indexOf("--limit")
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : undefined

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is required")
  process.exit(1)
}

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is required")
  process.exit(1)
}

if (limitIndex >= 0 && (!Number.isFinite(limit) || limit === undefined)) {
  console.error("❌ --limit requires a numeric value")
  process.exit(1)
}

function getEnumOptions(fieldName: string): EnumOption[] {
  const fields = professionalOrganization.fields ?? []
  const field = fields.find((item: any) => item?.name === fieldName) as any
  if (!field) return []
  if (field.options?.list) {
    return field.options.list as EnumOption[]
  }
  if (field.of?.[0]?.options?.list) {
    return field.of[0].options.list as EnumOption[]
  }
  return []
}

function normalizeEnumValue(
  input: string | undefined,
  allowedValues: Set<string>,
  titleToValue: Map<string, string>
): string | undefined {
  if (!input) return undefined
  if (allowedValues.has(input)) return input
  const normalized = titleToValue.get(input.toLowerCase())
  return normalized
}

function normalizeEnumList(
  input: unknown,
  allowedValues: Set<string>,
  titleToValue: Map<string, string>
): string[] {
  const items = Array.isArray(input) ? input : typeof input === "string" ? [input] : []
  const normalized = items
    .map((item) => (typeof item === "string" ? item : ""))
    .map((value) => normalizeEnumValue(value, allowedValues, titleToValue))
    .filter((value): value is string => Boolean(value))
  return Array.from(new Set(normalized))
}

function extractJson(text: string): string | null {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  return text.slice(start, end + 1)
}

function buildPrompt(params: {
  orgName?: string
  orgUrl?: string
  membershipOptions: EnumOption[]
  geographicOptions: EnumOption[]
  careerCategoryTitles: string[]
}) {
  const { orgName, orgUrl, membershipOptions, geographicOptions, careerCategoryTitles } = params
  const membershipList = membershipOptions.map((opt) => `${opt.title} (${opt.value})`).join(", ")
  const geographicList = geographicOptions.map((opt) => `${opt.title} (${opt.value})`).join(", ")
  const careerList = careerCategoryTitles.join(", ")

  return [
    "You are enriching a professional organization record for a Virginia healthcare directory.",
    "Return ONLY a JSON object matching the schema below, with no extra text.",
    "",
    "Schema:",
    "{",
    '  "description": "One sentence description in English.",',
    '  "membershipType": ["student", "professional"],',
    '  "geographicFocus": "national",',
    '  "careerAreas": ["Nursing", "Public Health"]',
    "}",
    "",
    "Allowed membershipType values:",
    membershipList,
    "",
    "Allowed geographicFocus values:",
    geographicList,
    "",
    "Allowed careerAreas titles (choose from this list):",
    careerList,
    "",
    "Organization:",
    `Name: ${orgName ?? "Unknown"}`,
    `URL: ${orgUrl ?? "Unknown"}`,
    "",
    "Guidance:",
    "- Choose the closest matching career areas (can be multiple).",
    "- Use membershipType values exactly from the allowed list.",
    "- Use geographicFocus value exactly from the allowed list.",
    "- If unsure, make a best guess based on name and URL."
  ].join("\n")
}

async function main() {
  const membershipOptions = getEnumOptions("membershipType")
  const geographicOptions = getEnumOptions("geographicFocus")

  if (membershipOptions.length === 0 || geographicOptions.length === 0) {
    console.error("❌ Failed to read enum options from schema.")
    process.exit(1)
  }

  const membershipValueSet = new Set(membershipOptions.map((opt) => opt.value))
  const geographicValueSet = new Set(geographicOptions.map((opt) => opt.value))

  const membershipTitleMap = new Map(
    membershipOptions.map((opt) => [opt.title.toLowerCase(), opt.value])
  )
  const geographicTitleMap = new Map(
    geographicOptions.map((opt) => [opt.title.toLowerCase(), opt.value])
  )

  const careerCategories = await client.fetch<Array<{ _id: string; title?: string }>>(
    `*[_type == "careerCategory"]{_id, title}`
  )
  const careerCategoryTitles = careerCategories
    .map((cat) => cat.title)
    .filter((title): title is string => Boolean(title))
  const careerCategoryMap = new Map(
    careerCategories
      .filter((cat): cat is { _id: string; title: string } => Boolean(cat.title))
      .map((cat) => [cat.title.toLowerCase(), cat._id])
  )

  const orgs = await client.fetch<ProfessionalOrganization[]>(
    `*[_type == "professionalOrganization" && (
      !defined(description) ||
      !defined(membershipType) ||
      !defined(geographicFocus) ||
      !defined(careerAreas)
    )]{
      _id,
      name,
      link,
      description,
      membershipType,
      geographicFocus,
      careerAreas
    }`
  )

  const targetOrgs = typeof limit === "number" ? orgs.slice(0, limit) : orgs

  console.log(`Found ${orgs.length} professional organizations to review.`)
  if (typeof limit === "number") {
    console.log(`Limiting to first ${targetOrgs.length} record(s).`)
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const preferredModel = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
  const modelFallbacks = [
    preferredModel,
    "gemini-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash"
  ]
  let activeModelName: string | null = null

  async function generateWithFallback(prompt: string) {
    const candidates = activeModelName ? [activeModelName] : modelFallbacks
    let lastError: unknown

    for (const modelName of candidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.2 }
        })
        const result = await model.generateContent(prompt)
        activeModelName = modelName
        return result
      } catch (error) {
        const message = String((error as Error)?.message ?? "")
        const isNotFound =
          message.includes("404") ||
          message.toLowerCase().includes("not found") ||
          message.toLowerCase().includes("listmodels")
        if (!isNotFound || (activeModelName && modelName === activeModelName)) {
          throw error
        }
        lastError = error
      }
    }

    throw lastError
  }

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const org of targetOrgs) {
    const missingDescription = !org.description?.en
    const missingMembership = !org.membershipType || org.membershipType.length === 0
    const missingGeographic = !org.geographicFocus
    const missingCareerAreas = !org.careerAreas || org.careerAreas.length === 0

    if (!missingDescription && !missingMembership && !missingGeographic && !missingCareerAreas) {
      skipped++
      continue
    }

    const prompt = buildPrompt({
      orgName: org.name,
      orgUrl: org.link,
      membershipOptions,
      geographicOptions,
      careerCategoryTitles
    })

    try {
      const result = await generateWithFallback(prompt)
      const text = result.response.text()
      const jsonText = extractJson(text)
      if (!jsonText) {
        console.error(`⚠️  Could not parse JSON for ${org.name ?? org._id}`)
        errors++
        continue
      }

      const parsed = JSON.parse(jsonText) as {
        description?: string
        membershipType?: unknown
        geographicFocus?: string
        careerAreas?: unknown
      }

      const setPayload: Record<string, unknown> = {}

      if (missingDescription && parsed.description && typeof parsed.description === "string") {
        setPayload["description.en"] = parsed.description.trim()
      }

      if (missingMembership) {
        const normalized = normalizeEnumList(parsed.membershipType, membershipValueSet, membershipTitleMap)
        if (normalized.length > 0) {
          setPayload.membershipType = normalized
        }
      }

      if (missingGeographic) {
        const normalized = normalizeEnumValue(parsed.geographicFocus, geographicValueSet, geographicTitleMap)
        if (normalized) {
          setPayload.geographicFocus = normalized
        }
      }

      if (missingCareerAreas) {
        const items = Array.isArray(parsed.careerAreas) ? parsed.careerAreas : []
        const normalized = items
          .map((item) => (typeof item === "string" ? item : ""))
          .map((title) => careerCategoryMap.get(title.toLowerCase()))
          .filter((id): id is string => Boolean(id))
        const unique = Array.from(new Set(normalized))
        if (unique.length > 0) {
          setPayload.careerAreas = unique.map((id) => ({ _type: "reference", _ref: id }))
        }
      }

      if (Object.keys(setPayload).length === 0) {
        console.log(`⏭️  Skipping ${org.name ?? org._id} (no valid fields returned)`)
        skipped++
        continue
      }

      if (dryRun) {
        console.log(`🧪 Dry run: would update ${org.name ?? org._id}`, setPayload)
        updated++
        continue
      }

      await client.patch(org._id).set(setPayload).commit()
      console.log(`✅ Updated ${org.name ?? org._id}`)
      updated++
    } catch (error) {
      console.error(`❌ Error updating ${org.name ?? org._id}:`, error)
      errors++
    }
  }

  console.log("\nSummary")
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Errors: ${errors}`)
}

main().catch((error) => {
  console.error("❌ Fatal error:", error)
  process.exit(1)
})

