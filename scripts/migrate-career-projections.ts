#!/usr/bin/env npx tsx
/**
 * Career Projection Migration Script
 *
 * Parses the Career Projection Data CSV to extract % change projections and updates
 * matching careers in Sanity with outlook label, value, and year.
 *
 * Usage: npx tsx scripts/migrate-career-projections.ts
 */

import { createClient } from "@sanity/client"
import { parse } from "csv-parse/sync"
import * as fs from "fs"
import * as path from "path"
import * as readline from "readline"
import * as stringSimilarity from "string-similarity"

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(__dirname, "../data-migration/Career Projection Data.csv")
const SANITY_PROJECT_ID = "j0yc55ca"
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2024-01-01"

const OUTLOOK_LABEL = "Projected 10-Year Growth"
const TARGET_PROJECTION_YEARS = 10

// Matching thresholds
const AUTO_MATCH_THRESHOLD = 0.8 // Auto-accept matches >= this score
const PROMPT_THRESHOLD = 0.5 // Prompt for matches between this and AUTO_MATCH_THRESHOLD

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ProjectionRow = Record<string, string>

interface ProjectionData {
    value: number
    year: number
    periodLabel: string
    endYear: number
}

interface SanityCareer {
    _id: string
    title: string
    slug?: { current: string }
}

interface MatchResult {
    sanityCareer: SanityCareer
    csvTitle: string
    projectionData: ProjectionData
    score: number
    autoMatched: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanity Client
// ─────────────────────────────────────────────────────────────────────────────

const sanityClient = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN
})

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a career title for comparison
 */
function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^\w\s]/g, " ") // Remove punctuation
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim()
        .replace(/s$/, "") // Remove trailing 's' (plural)
}

/**
 * Parse a period string like "2022-2032 Projections" and return years
 */
function parsePeriod(period: string): { startYear: number; endYear: number } | null {
    const match = period.match(/(\d{4})\s*-\s*(\d{4})/)
    if (!match) return null

    const startYear = parseInt(match[1], 10)
    const endYear = parseInt(match[2], 10)

    if (Number.isNaN(startYear) || Number.isNaN(endYear) || endYear <= startYear) return null

    return { startYear, endYear }
}

/**
 * Convert decimal change to percent (rounded to 1 decimal)
 */
function toPercent(value: number): number {
    return Math.round(value * 1000) / 10
}

/**
 * Create a readline interface for interactive prompts
 */
function createReadlineInterface(): readline.Interface {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
}

/**
 * Prompt user with a question and wait for response
 */
async function prompt(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim())
        })
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV Processing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the projections CSV and extract most recent 10-year % change per occupation
 */
function parseProjectionData(): Map<string, ProjectionData> {
    console.log(`\n📂 Reading CSV from: ${CSV_PATH}`)

  const rawBuffer = fs.readFileSync(CSV_PATH)
  const looksUtf16 = rawBuffer.includes(0x00)
  const csvContent = looksUtf16 ? rawBuffer.toString("utf16le") : rawBuffer.toString("utf-8")
  const records: ProjectionRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t",
    bom: true,
    relax_column_count: true
  })

    console.log(`   Found ${records.length} total rows`)

    const projectionMap = new Map<string, ProjectionData>()
    let percentChangeCount = 0

    for (const row of records) {
        const measureName = (row["Measure Names"] || "").trim()
        if (measureName !== "% Change") continue
        percentChangeCount++

        const occupationTitle = (row["Occupation Title"] || "").trim()
        if (!occupationTitle) continue

        const periodRaw = (row["Period"] || row["Period (copy)"] || "").trim()
        const periodParsed = parsePeriod(periodRaw)
        if (!periodParsed) continue

        const projectionYears = periodParsed.endYear - periodParsed.startYear
        if (projectionYears !== TARGET_PROJECTION_YEARS) continue

        const rawValue = row["Measure Values"] || row["Measure Value"] || ""
        const numericValue = parseFloat(rawValue)
        if (Number.isNaN(numericValue)) continue

        const percentValue = toPercent(numericValue)

        const existing = projectionMap.get(occupationTitle)
        if (!existing || periodParsed.endYear > existing.endYear) {
            projectionMap.set(occupationTitle, {
                value: percentValue,
                year: periodParsed.endYear,
                periodLabel: periodRaw,
                endYear: periodParsed.endYear
            })
        }
    }

    console.log(`   Filtered to ${percentChangeCount} % Change rows`)
    console.log(`   Extracted ${projectionMap.size} unique occupation titles`)

    return projectionMap
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanity Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all careers from Sanity
 */
async function fetchSanityCareers(): Promise<SanityCareer[]> {
    console.log("\n🔍 Fetching careers from Sanity...")

    const careers = await sanityClient.fetch<SanityCareer[]>(
        `*[_type == "career" && !(_id in path("drafts.**"))]{
      _id,
      "title": title.en,
      slug
    }`
    )

    console.log(`   Found ${careers.length} careers in Sanity`)
    return careers
}

/**
 * Update a career's outlook data in Sanity
 */
async function updateCareerOutlook(careerId: string, projectionData: ProjectionData): Promise<void> {
    await sanityClient
        .patch(careerId)
        .set({
            "outlook.label": OUTLOOK_LABEL,
            "outlook.value": projectionData.value,
            "outlook.year": projectionData.year
        })
        .commit()
}

// ─────────────────────────────────────────────────────────────────────────────
// Matching Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find the best CSV match for a Sanity career
 */
function findBestMatch(
    sanityCareer: SanityCareer,
    csvTitles: string[],
    projectionMap: Map<string, ProjectionData>
): { csvTitle: string; score: number; projectionData: ProjectionData } | null {
    const normalizedSanityTitle = normalizeTitle(sanityCareer.title)

    const normalizedCsvTitles = csvTitles.map(normalizeTitle)
    const result = stringSimilarity.findBestMatch(normalizedSanityTitle, normalizedCsvTitles)
    const bestMatch = result.bestMatch

    if (bestMatch.rating < 0.3) {
        return null
    }

    const originalCsvTitle = csvTitles[result.bestMatchIndex]
    const projectionData = projectionMap.get(originalCsvTitle)!

    return {
        csvTitle: originalCsvTitle,
        score: bestMatch.rating,
        projectionData
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Prompts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prompt user to confirm a match
 */
async function confirmMatch(
    rl: readline.Interface,
    sanityTitle: string,
    csvTitle: string,
    score: number,
    projectionData: ProjectionData
): Promise<boolean> {
    console.log(`\n┌─────────────────────────────────────────────────────────────────`)
    console.log(`│ Sanity:  "${sanityTitle}"`)
    console.log(`│ CSV:     "${csvTitle}"`)
    console.log(`│ Score:   ${(score * 100).toFixed(1)}%`)
    console.log(`│ Period:  ${projectionData.periodLabel}`)
    console.log(`│ Value:   ${projectionData.value.toFixed(1)}%`)
    console.log(`└─────────────────────────────────────────────────────────────────`)

    const answer = await prompt(rl, "Accept this match? (y/n): ")
    return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes"
}

/**
 * Prompt user to select from a list of potential matches
 */
async function selectFromList(
    rl: readline.Interface,
    sanityTitle: string,
    csvTitles: string[],
    projectionMap: Map<string, ProjectionData>
): Promise<{ csvTitle: string; projectionData: ProjectionData } | null> {
    console.log(`\n┌─────────────────────────────────────────────────────────────────`)
    console.log(`│ No good match found for: "${sanityTitle}"`)
    console.log(`└─────────────────────────────────────────────────────────────────`)

    const normalizedSanityTitle = normalizeTitle(sanityTitle)
    const normalizedCsvTitles = csvTitles.map(normalizeTitle)
    const result = stringSimilarity.findBestMatch(normalizedSanityTitle, normalizedCsvTitles)

    const topMatches = result.ratings
        .map((r, i) => ({ ...r, originalTitle: csvTitles[i] }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)

    console.log("\nTop potential matches:")
    topMatches.forEach((match, idx) => {
        const projection = projectionMap.get(match.originalTitle)!
        console.log(
            `  ${idx + 1}. "${match.originalTitle}" (${(match.rating * 100).toFixed(1)}%) - ${projection.value.toFixed(1)}% (${projection.periodLabel})`
        )
    })
    console.log("  0. Skip this career")

    const answer = await prompt(rl, "\nSelect option (0-5): ")
    const selection = parseInt(answer)

    if (Number.isNaN(selection) || selection === 0 || selection > topMatches.length) {
        return null
    }

    const selected = topMatches[selection - 1]
    return {
        csvTitle: selected.originalTitle,
        projectionData: projectionMap.get(selected.originalTitle)!
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log("═══════════════════════════════════════════════════════════════════")
    console.log("  Career Projection Migration Script")
    console.log("═══════════════════════════════════════════════════════════════════")

    if (!process.env.SANITY_API_TOKEN) {
        console.error("\n❌ Error: SANITY_API_TOKEN environment variable is required")
        console.error("   Get a token from: https://www.sanity.io/manage/project/j0yc55ca/api#tokens")
        process.exit(1)
    }

    const projectionMap = parseProjectionData()
    const csvTitles = Array.from(projectionMap.keys())

    const sanityCareers = await fetchSanityCareers()

    const autoMatches: MatchResult[] = []
    const promptMatches: { career: SanityCareer; match: ReturnType<typeof findBestMatch> }[] = []
    const noMatches: SanityCareer[] = []

    console.log("\n🔄 Analyzing matches...")

    for (const career of sanityCareers) {
        const match = findBestMatch(career, csvTitles, projectionMap)

        if (!match) {
            noMatches.push(career)
        } else if (match.score >= AUTO_MATCH_THRESHOLD) {
            autoMatches.push({
                sanityCareer: career,
                csvTitle: match.csvTitle,
                projectionData: match.projectionData,
                score: match.score,
                autoMatched: true
            })
        } else if (match.score >= PROMPT_THRESHOLD) {
            promptMatches.push({ career, match })
        } else {
            noMatches.push(career)
        }
    }

    console.log(`\n📊 Match Summary:`)
    console.log(`   ✅ Auto-matched (≥${AUTO_MATCH_THRESHOLD * 100}%): ${autoMatches.length}`)
    console.log(`   ❓ Needs confirmation (${PROMPT_THRESHOLD * 100}%-${AUTO_MATCH_THRESHOLD * 100}%): ${promptMatches.length}`)
    console.log(`   ❌ No good match (<${PROMPT_THRESHOLD * 100}%): ${noMatches.length}`)

    if (autoMatches.length > 0) {
        console.log("\n✅ Auto-matched careers:")
        for (const match of autoMatches) {
            console.log(`   • "${match.sanityCareer.title}" → "${match.csvTitle}" (${(match.score * 100).toFixed(1)}%)`)
        }
    }

    const rl = createReadlineInterface()
    const confirmedMatches: MatchResult[] = [...autoMatches]

    if (promptMatches.length > 0 || noMatches.length > 0) {
        console.log("\n\n═══════════════════════════════════════════════════════════════════")
        console.log("  Interactive Matching")
        console.log("═══════════════════════════════════════════════════════════════════")
    }

    for (const { career, match } of promptMatches) {
        const confirmed = await confirmMatch(
            rl,
            career.title,
            match!.csvTitle,
            match!.score,
            match!.projectionData
        )

        if (confirmed) {
            confirmedMatches.push({
                sanityCareer: career,
                csvTitle: match!.csvTitle,
                projectionData: match!.projectionData,
                score: match!.score,
                autoMatched: false
            })
        } else {
            noMatches.push(career)
        }
    }

    for (const career of noMatches) {
        const selection = await selectFromList(rl, career.title, csvTitles, projectionMap)

        if (selection) {
            confirmedMatches.push({
                sanityCareer: career,
                csvTitle: selection.csvTitle,
                projectionData: selection.projectionData,
                score: 0,
                autoMatched: false
            })
        }
    }

    rl.close()

    if (confirmedMatches.length === 0) {
        console.log("\n⚠️  No matches to update. Exiting.")
        return
    }

    console.log("\n\n═══════════════════════════════════════════════════════════════════")
    console.log("  Updating Sanity")
    console.log("═══════════════════════════════════════════════════════════════════")
    console.log(`\n📤 Updating ${confirmedMatches.length} careers in Sanity...`)

    let successCount = 0
    let errorCount = 0

    for (const match of confirmedMatches) {
        try {
            process.stdout.write(`   Updating "${match.sanityCareer.title}"... `)
            await updateCareerOutlook(match.sanityCareer._id, match.projectionData)
            console.log("✅")
            successCount++
        } catch (error) {
            console.log("❌")
            console.error(`      Error: ${error instanceof Error ? error.message : String(error)}`)
            errorCount++
        }
    }

    console.log("\n═══════════════════════════════════════════════════════════════════")
    console.log("  Migration Complete")
    console.log("═══════════════════════════════════════════════════════════════════")
    console.log(`\n   ✅ Successfully updated: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   ⏭️  Skipped: ${sanityCareers.length - confirmedMatches.length}`)
}

main().catch((error) => {
    console.error("\n❌ Fatal error:", error)
    process.exit(1)
})
