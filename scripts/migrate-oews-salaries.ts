#!/usr/bin/env npx tsx
/**
 * OEWS Salary Migration Script
 *
 * Parses the OEWS CSV file to extract annual salary data and updates
 * matching careers in Sanity with entry-level, median, and experienced salary values.
 *
 * Usage: npx tsx scripts/migrate-oews-salaries.ts
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

const CSV_PATH = path.resolve(__dirname, "../data-migration/2024-OEWS-Data.xlsx - iowage.csv")
const SANITY_PROJECT_ID = "j0yc55ca"
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2024-01-01"

// Matching thresholds
const AUTO_MATCH_THRESHOLD = 0.8 // Auto-accept matches >= this score
const PROMPT_THRESHOLD = 0.5 // Prompt for matches between this and AUTO_MATCH_THRESHOLD

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OEWSRow {
    occcodetitle: string
    ratetype: string
    entrywg: string
    median: string
    experience: string
    indcode: string
}

interface SalaryData {
    rangeMin: number | null
    median: number | null
    rangeMax: number | null
    source: string
    year: number
}

interface SanityCareer {
    _id: string
    title: string
    slug?: { current: string }
}

interface MatchResult {
    sanityCareer: SanityCareer
    csvTitle: string
    salaryData: SalaryData
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
 * Parse a numeric value from CSV, returning null for invalid/zero values
 */
function parseNumeric(value: string): number | null {
    const num = parseFloat(value)
    if (isNaN(num) || num === 0) return null
    return Math.round(num) // Round to whole dollars
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
 * Parse the OEWS CSV and extract unique annual salary entries
 */
function parseOEWSData(): Map<string, SalaryData> {
    console.log(`\n📂 Reading CSV from: ${CSV_PATH}`)

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8")
    const records: OEWSRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    })

    console.log(`   Found ${records.length} total rows`)

    // Filter for annual salaries (ratetype == 4) and dedupe by career title
    const salaryMap = new Map<string, SalaryData>()
    let annualCount = 0

    for (const row of records) {
        // Only process annual wage entries
        if (row.ratetype !== "4") continue
        annualCount++

        const title = row.occcodetitle.trim()

        // Skip if we already have this career (take first occurrence)
        if (salaryMap.has(title)) continue

        salaryMap.set(title, {
            rangeMin: parseNumeric(row.entrywg),
            median: parseNumeric(row.median),
            rangeMax: parseNumeric(row.experience),
            source: "BLS OEWS",
            year: 2024
        })
    }

    console.log(`   Filtered to ${annualCount} annual wage rows`)
    console.log(`   Extracted ${salaryMap.size} unique career titles`)

    return salaryMap
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
 * Update a career's salary data in Sanity
 */
async function updateCareerSalary(careerId: string, salaryData: SalaryData): Promise<void> {
    await sanityClient
        .patch(careerId)
        .set({
            salary: {
                rangeMin: salaryData.rangeMin,
                median: salaryData.median,
                rangeMax: salaryData.rangeMax,
                source: salaryData.source,
                year: salaryData.year
            }
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
    salaryMap: Map<string, SalaryData>
): { csvTitle: string; score: number; salaryData: SalaryData } | null {
    const normalizedSanityTitle = normalizeTitle(sanityCareer.title)

    // Get normalized CSV titles
    const normalizedCsvTitles = csvTitles.map(normalizeTitle)

    // Find best match
    const result = stringSimilarity.findBestMatch(normalizedSanityTitle, normalizedCsvTitles)
    const bestMatch = result.bestMatch

    if (bestMatch.rating < 0.3) {
        return null // No reasonable match found
    }

    const originalCsvTitle = csvTitles[result.bestMatchIndex]
    const salaryData = salaryMap.get(originalCsvTitle)!

    return {
        csvTitle: originalCsvTitle,
        score: bestMatch.rating,
        salaryData
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
    salaryData: SalaryData
): Promise<boolean> {
    console.log(`\n┌─────────────────────────────────────────────────────────────────`)
    console.log(`│ Sanity:  "${sanityTitle}"`)
    console.log(`│ CSV:     "${csvTitle}"`)
    console.log(`│ Score:   ${(score * 100).toFixed(1)}%`)
    console.log(`│ Salary:  Entry: $${salaryData.rangeMin?.toLocaleString() ?? "N/A"} | Median: $${salaryData.median?.toLocaleString() ?? "N/A"} | Exp: $${salaryData.rangeMax?.toLocaleString() ?? "N/A"}`)
    console.log(`└─────────────────────────────────────────────────────────────────`)

    const answer = await prompt(rl, "Accept this match? (y/n/s to skip all similar): ")
    return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes"
}

/**
 * Prompt user to select from a list of potential matches
 */
async function selectFromList(
    rl: readline.Interface,
    sanityTitle: string,
    csvTitles: string[],
    salaryMap: Map<string, SalaryData>
): Promise<{ csvTitle: string; salaryData: SalaryData } | null> {
    console.log(`\n┌─────────────────────────────────────────────────────────────────`)
    console.log(`│ No good match found for: "${sanityTitle}"`)
    console.log(`└─────────────────────────────────────────────────────────────────`)

    // Show top 5 closest matches
    const normalizedSanityTitle = normalizeTitle(sanityTitle)
    const normalizedCsvTitles = csvTitles.map(normalizeTitle)
    const result = stringSimilarity.findBestMatch(normalizedSanityTitle, normalizedCsvTitles)

    // Sort by rating and take top 5
    const topMatches = result.ratings
        .map((r, i) => ({ ...r, originalTitle: csvTitles[i] }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)

    console.log("\nTop potential matches:")
    topMatches.forEach((match, idx) => {
        const salary = salaryMap.get(match.originalTitle)!
        console.log(
            `  ${idx + 1}. "${match.originalTitle}" (${(match.rating * 100).toFixed(1)}%) - $${salary.median?.toLocaleString() ?? "N/A"} median`
        )
    })
    console.log("  0. Skip this career")

    const answer = await prompt(rl, "\nSelect option (0-5): ")
    const selection = parseInt(answer)

    if (isNaN(selection) || selection === 0 || selection > topMatches.length) {
        return null
    }

    const selected = topMatches[selection - 1]
    return {
        csvTitle: selected.originalTitle,
        salaryData: salaryMap.get(selected.originalTitle)!
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log("═══════════════════════════════════════════════════════════════════")
    console.log("  OEWS Salary Migration Script")
    console.log("═══════════════════════════════════════════════════════════════════")

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
        console.error("\n❌ Error: SANITY_API_TOKEN environment variable is required")
        console.error("   Get a token from: https://www.sanity.io/manage/project/j0yc55ca/api#tokens")
        process.exit(1)
    }

    // Parse CSV data
    const salaryMap = parseOEWSData()
    const csvTitles = Array.from(salaryMap.keys())

    // Fetch Sanity careers
    const sanityCareers = await fetchSanityCareers()

    // Process matches
    const autoMatches: MatchResult[] = []
    const promptMatches: { career: SanityCareer; match: ReturnType<typeof findBestMatch> }[] = []
    const noMatches: SanityCareer[] = []

    console.log("\n🔄 Analyzing matches...")

    for (const career of sanityCareers) {
        const match = findBestMatch(career, csvTitles, salaryMap)

        if (!match) {
            noMatches.push(career)
        } else if (match.score >= AUTO_MATCH_THRESHOLD) {
            autoMatches.push({
                sanityCareer: career,
                csvTitle: match.csvTitle,
                salaryData: match.salaryData,
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

    // Show auto-matches
    if (autoMatches.length > 0) {
        console.log("\n✅ Auto-matched careers:")
        for (const match of autoMatches) {
            console.log(`   • "${match.sanityCareer.title}" → "${match.csvTitle}" (${(match.score * 100).toFixed(1)}%)`)
        }
    }

    // Interactive prompts for uncertain matches
    const rl = createReadlineInterface()
    const confirmedMatches: MatchResult[] = [...autoMatches]

    if (promptMatches.length > 0 || noMatches.length > 0) {
        console.log("\n\n═══════════════════════════════════════════════════════════════════")
        console.log("  Interactive Matching")
        console.log("═══════════════════════════════════════════════════════════════════")
    }

    // Handle uncertain matches
    for (const { career, match } of promptMatches) {
        const confirmed = await confirmMatch(
            rl,
            career.title,
            match!.csvTitle,
            match!.score,
            match!.salaryData
        )

        if (confirmed) {
            confirmedMatches.push({
                sanityCareer: career,
                csvTitle: match!.csvTitle,
                salaryData: match!.salaryData,
                score: match!.score,
                autoMatched: false
            })
        } else {
            noMatches.push(career)
        }
    }

    // Handle no-match careers
    for (const career of noMatches) {
        const selection = await selectFromList(rl, career.title, csvTitles, salaryMap)

        if (selection) {
            confirmedMatches.push({
                sanityCareer: career,
                csvTitle: selection.csvTitle,
                salaryData: selection.salaryData,
                score: 0, // Manual selection
                autoMatched: false
            })
        }
    }

    rl.close()

    // Update Sanity
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
            await updateCareerSalary(match.sanityCareer._id, match.salaryData)
            console.log("✅")
            successCount++
        } catch (error) {
            console.log("❌")
            console.error(`      Error: ${error instanceof Error ? error.message : String(error)}`)
            errorCount++
        }
    }

    // Final summary
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

