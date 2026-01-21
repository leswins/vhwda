#!/usr/bin/env node
import "dotenv/config"
import { readFile, writeFile } from "fs/promises"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { createClient } from "@sanity/client"

type CareerDoc = {
  _id: string
  title?: { en?: string }
  hasDraft?: boolean
}

type CsvRow = {
  Career: string
  [key: string]: string
}

type MatchResult = {
  csvCareer: string
  matchedId?: string
  matchedTitle?: string
  score?: number
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
const csvPathIndex = args.indexOf("--csv")
const csvPathArg = csvPathIndex >= 0 ? args[csvPathIndex + 1] : undefined

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is required")
  process.exit(1)
}

if (limitIndex >= 0 && (!Number.isFinite(limit) || limit === undefined)) {
  console.error("❌ --limit requires a numeric value")
  process.exit(1)
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "..", "..", "..")
const DEFAULT_CSV_PATH = resolve(
  repoRoot,
  "data-migration/vhwda_career_vector_weights.csv"
)

const columnToField: Record<string, string> = {
  "Patient Facing": "w_patient_facing",
  "Tech/Equipment": "w_tech_equipment",
  "Lab/Research": "w_lab_research",
  "Counseling/Education": "w_counseling_education",
  Pediatrics: "w_pediatrics",
  Geriatrics: "w_geriatrics",
  "Exposure Tolerance": "w_exposure_tolerance",
  Analytical: "w_analytical",
  Administrative: "w_admin",
  "Procedural Dexterity": "w_procedural_dexterity",
  Collaboration: "w_collaboration",
  "Pace: Routine": "w_pace_routine",
  "Pace: Fast": "w_pace_fast",
  "Schedule Flexibility": "w_schedule_flex",
  "Stress Tolerance": "w_stress_tolerance",
  "Physical: Light": "w_physical_light",
  "Physical: On Feet": "w_physical_on_feet",
  "Physical: Lifting": "w_physical_lifting",
  "Environment: Hospital": "w_env_hospital",
  "Environment: Clinic": "w_env_clinic",
  "Environment: Community": "w_env_community",
  "Environment: School": "w_env_school",
  "Environment: Lab": "w_env_lab",
  "Environment: Office": "w_env_office",
  "Multiple Environments": "w_multi_env",
  "Outlook Importance": "w_outlook_importance",
  "Short Path Preference": "w_short_path"
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\""
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
      continue
    }
    current += char
  }
  result.push(current)
  return result.map((value) => value.trim())
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[a.length][b.length]
}

function similarity(a: string, b: string) {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(a, b) / maxLen
}

async function main() {
  const csvPath = csvPathArg ? resolve(process.cwd(), csvPathArg) : DEFAULT_CSV_PATH
  const fileContents = await readFile(csvPath, "utf8")
  const lines = fileContents.split(/\r?\n/).filter((line) => line.trim().length > 0)
  const header = parseCsvLine(lines[0])
  const rows = lines.slice(1).map((line) => parseCsvLine(line))

  const csvRows: CsvRow[] = rows.map((values) => {
    const row: CsvRow = { Career: "" }
    header.forEach((col, index) => {
      row[col] = values[index] ?? ""
    })
    return row
  })

  const careers = await client.fetch<CareerDoc[]>(
    `*[_type == "career"]{
      _id,
      title,
      "hasDraft": count(*[_id == "drafts." + ^._id]) > 0
    }`
  )

  const careerIndex = careers
    .filter((career) => career.title?.en)
    .map((career) => ({
      id: career._id,
      title: career.title?.en ?? "",
      normalized: normalizeTitle(career.title?.en ?? ""),
      hasDraft: career.hasDraft ?? false
    }))

  const matches: MatchResult[] = []
  const targetRows = typeof limit === "number" ? csvRows.slice(0, limit) : csvRows

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const row of targetRows) {
    const careerName = row.Career?.trim()
    if (!careerName) {
      skipped++
      matches.push({ csvCareer: "", reason: "missing_career_name" })
      continue
    }

    const normalized = normalizeTitle(careerName)
    const scored = careerIndex
      .map((career) => ({
        ...career,
        score: similarity(normalized, career.normalized)
      }))
      .sort((a, b) => b.score - a.score)

    const best = scored[0]
    const second = scored[1]

    if (!best || best.score < 0.86) {
      skipped++
      matches.push({ csvCareer: careerName, reason: "no_confident_match", score: best?.score })
      continue
    }

    if (second && best.score - second.score < 0.04) {
      skipped++
      matches.push({
        csvCareer: careerName,
        reason: "ambiguous_match",
        matchedTitle: best.title,
        score: best.score
      })
      continue
    }

    const quizVector: Record<string, number> = {}
    Object.entries(columnToField).forEach(([column, fieldName]) => {
      const raw = row[column]
      const value = Number(raw)
      if (!Number.isFinite(value)) return
      quizVector[fieldName] = Math.max(-2, Math.min(2, Math.trunc(value)))
    })

    if (Object.keys(quizVector).length === 0) {
      skipped++
      matches.push({ csvCareer: careerName, reason: "no_vector_values" })
      continue
    }

    try {
      if (dryRun) {
        console.log(`🧪 Dry run: would update ${best.title}`)
        updated++
        matches.push({
          csvCareer: careerName,
          matchedId: best.id,
          matchedTitle: best.title,
          score: best.score
        })
        continue
      }

      const targetId = best.hasDraft ? `drafts.${best.id}` : best.id
      await client.patch(targetId).set({ quizVector }).commit()
      if (best.hasDraft) {
        await client.mutate([{ publish: { id: best.id } } as any])
      }
      updated++
      matches.push({
        csvCareer: careerName,
        matchedId: best.id,
        matchedTitle: best.title,
        score: best.score
      })
      console.log(`✅ Updated ${best.title}`)
    } catch (error) {
      errors++
      matches.push({
        csvCareer: careerName,
        matchedId: best.id,
        matchedTitle: best.title,
        score: best.score,
        reason: "update_failed"
      })
      console.error(`❌ Error updating ${best.title}:`, error)
    }
  }

  if (reportPath) {
    const reportFullPath = resolve(process.cwd(), reportPath)
    await writeFile(reportFullPath, JSON.stringify(matches, null, 2), "utf8")
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

