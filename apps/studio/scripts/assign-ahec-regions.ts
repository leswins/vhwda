#!/usr/bin/env node
import "dotenv/config"
import { readFile, writeFile } from "fs/promises"
import { basename, dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { createClient } from "@sanity/client"
import { GoogleGenerativeAI } from "@google/generative-ai"

type EducationalInstitution = {
  _id: string
  name?: string
  address?: string
  location?: { lat?: number; lng?: number }
  region?: string
  hasDraft?: boolean
}

type MatchResult = {
  institutionId: string
  institutionName?: string
  region?: string
  reason?: string
}

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
const reportIndex = args.indexOf("--report")
const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : undefined
const mapIndex = args.indexOf("--map")
const mapPath = mapIndex >= 0 ? args[mapIndex + 1] : undefined

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "..", "..", "..")

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is required")
  process.exit(1)
}

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is required")
  process.exit(1)
}

const geminiApiKey = process.env.GEMINI_API_KEY

if (limitIndex >= 0 && (!Number.isFinite(limit) || limit === undefined)) {
  console.error("❌ --limit requires a numeric value")
  process.exit(1)
}

if (!mapPath) {
  console.error("❌ --map path to the AHEC map image is required")
  process.exit(1)
}

const mapPathValue = mapPath

const allowedRegions = [
  "Northern VA",
  "Blue Ridge",
  "Rappahannock",
  "Central",
  "Southside",
  "Eastern VA",
  "South Central",
  "Southwest"
]

const regionLookup = new Map(
  allowedRegions.map((region) => [region.toLowerCase(), region])
)

function normalizeRegion(value?: string) {
  if (!value) return undefined
  const direct = regionLookup.get(value.toLowerCase().trim())
  if (direct) return direct
  return regionLookup.get(value.replace(/ahec/i, "").trim().toLowerCase())
}

function extractJson(text: string): string | null {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  return text.slice(start, end + 1)
}

async function loadMapImage(path: string) {
  const imageBuffer = await readFile(path)
  const base64 = imageBuffer.toString("base64")
  const fileName = basename(path)
  const mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg"
  return { base64, mimeType }
}

function buildPrompt(params: {
  name?: string
  address?: string
  lat?: number
  lng?: number
}) {
  return [
    "You are assigning Virginia AHEC regions for educational institutions.",
    "Use the provided AHEC map image to determine the correct region.",
    "Return ONLY a JSON object with a single field: region.",
    "",
    "Allowed regions:",
    allowedRegions.join(", "),
    "",
    "Institution:",
    `Name: ${params.name ?? "Unknown"}`,
    `Address: ${params.address ?? "Unknown"}`,
    `Latitude: ${params.lat ?? "Unknown"}`,
    `Longitude: ${params.lng ?? "Unknown"}`
  ].join("\n")
}

async function main() {
  const resolvedMapPath = mapPathValue.startsWith("/")
    ? mapPathValue
    : resolve(repoRoot, mapPathValue)
  const { base64, mimeType } = await loadMapImage(resolvedMapPath)
  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { temperature: 0.1 }
  })

  const institutions = await client.fetch<EducationalInstitution[]>(
    `*[_type == "educationalInstitution" && defined(location)]{
      _id,
      name,
      address,
      location,
      region,
      "hasDraft": count(*[_id == "drafts." + ^._id]) > 0
    }`
  )

  const targetInstitutions =
    typeof limit === "number" ? institutions.slice(0, limit) : institutions

  console.log(`Found ${institutions.length} educational institutions with locations.`)
  if (typeof limit === "number") {
    console.log(`Limiting to first ${targetInstitutions.length} record(s).`)
  }

  const results: MatchResult[] = []
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const inst of targetInstitutions) {
    const lat = inst.location?.lat
    const lng = inst.location?.lng
    if (typeof lat !== "number" || typeof lng !== "number") {
      skipped++
      results.push({
        institutionId: inst._id,
        institutionName: inst.name,
        reason: "missing_coordinates"
      })
      continue
    }

    try {
      const prompt = buildPrompt({
        name: inst.name,
        address: inst.address,
        lat,
        lng
      })

      const response = await model.generateContent([
        {
          inlineData: {
            data: base64,
            mimeType
          }
        },
        { text: prompt }
      ])

      const text = response.response.text()
      const jsonText = extractJson(text)
      if (!jsonText) {
        skipped++
        results.push({
          institutionId: inst._id,
          institutionName: inst.name,
          reason: "invalid_response"
        })
        continue
      }

      const parsed = JSON.parse(jsonText) as { region?: string }
      const region = normalizeRegion(parsed.region)
      if (!region) {
        skipped++
        results.push({
          institutionId: inst._id,
          institutionName: inst.name,
          reason: "unknown_region"
        })
        continue
      }

      if (dryRun) {
        console.log(`🧪 Dry run: would set ${inst.name ?? inst._id} to ${region}`)
        updated++
        results.push({
          institutionId: inst._id,
          institutionName: inst.name,
          region
        })
        continue
      }

      const targetId = inst.hasDraft ? `drafts.${inst._id}` : inst._id
      await client.patch(targetId).set({ region }).commit()
      if (inst.hasDraft) {
        await client.mutate([{ publish: { id: inst._id } } as any])
      }

      console.log(`✅ Updated ${inst.name ?? inst._id} -> ${region}`)
      updated++
      results.push({
        institutionId: inst._id,
        institutionName: inst.name,
        region
      })
    } catch (error) {
      errors++
      console.error(`❌ Error updating ${inst.name ?? inst._id}:`, error)
      results.push({
        institutionId: inst._id,
        institutionName: inst.name,
        reason: "update_failed"
      })
    }
  }

  if (reportPath) {
    const reportFullPath = resolve(process.cwd(), reportPath)
    await writeFile(reportFullPath, JSON.stringify(results, null, 2), "utf8")
    console.log(`Report written to ${reportFullPath}`)
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

