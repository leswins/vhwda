#!/usr/bin/env node
/**
 * Populate career.educationInstitutions[].programUrl from the Ideal Layout CSV.
 *
 * Matches CSV Career + Institution rows to Sanity career documents and their
 * educationInstitutions items, then sets programUrl when a valid http(s) URL
 * is present in "Program Specific Website".
 *
 * Usage (from repo root):
 *   pnpm --filter studio migrate:program-urls -- --dry-run
 *   pnpm --filter studio migrate:program-urls
 *   pnpm --filter studio migrate:program-urls -- --csv path/to.csv --publish
 *
 * Default writes drafts only. --publish patches published documents so URLs
 * are live, and syncs the same programUrl values onto any existing drafts so
 * a later Studio publish cannot wipe them. Existing drafts are not published
 * wholesale (they may contain unrelated unpublished edits).
 *
 * Requires SANITY_API_TOKEN with Editor (or higher) permissions.
 */
import "dotenv/config"
import { readFile, writeFile } from "fs/promises"
import { basename, dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { createClient } from "@sanity/client"
import { parse } from "csv-parse/sync"
import * as stringSimilarity from "string-similarity"

type EducationInstitutionItem = {
  _key: string
  programUrl?: string
  institutionId?: string
  institutionName?: string
}

type SanityCareer = {
  _id: string
  title: string
  hasDraft?: boolean
  educationInstitutions?: EducationInstitutionItem[]
  draftEducationInstitutions?: Array<{ _key: string; programUrl?: string }>
}

type CsvRow = {
  Career: string
  Institution: string
  "Institution Website"?: string
  "Program Specific Website"?: string
}

type PlannedUpdate = {
  careerId: string
  careerTitle: string
  itemKey: string
  institutionName: string
  csvInstitution: string
  oldUrl?: string
  newUrl: string
  matchHow: string
  patchPublished: boolean
  patchDraft: boolean
}

const SANITY_PROJECT_ID = "j0yc55ca"
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2024-01-01"

const CAREER_FUZZY_THRESHOLD = 0.9
const INSTITUTION_FUZZY_THRESHOLD = 0.88

/** CSV career title → Sanity title.en */
const CAREER_ALIASES: Record<string, string> = {
  "certified personal care aide (home health aide)":
    "Certified Personal Care Aide (Home Health Aide/Direct Support Professional)",
  "community health worker": "Certified Community Health Worker",
  "environmental science & protect": "Environmental Science & Protection Technician",
  "environmental science and protect": "Environmental Science & Protection Technician"
}

/** CSV institution name → Sanity educationalInstitution.name */
const INSTITUTION_ALIASES: Record<string, string> = {
  "virgiia tech": "Virginia Tech",
  "patrick henry community college (repeat)": "Patrick Henry Community College",
  "bon secours st. mary's hospital": "Bon Secours St. Mary’s Hospital",
  "danville area training center": "Danville Training Center",
  "gloucester county volunteer fire & rescue": "Gloucester County Volunteer Fire and Rescue",
  "frederick county fire & rescue": "Frederick County Fire & Rescue, Winchester",
  "prince william county fire and rescue": "Prince William County Fire and Rescue System",
  "standard healthcare services": "Standard Healthcare Services, College of Nursing",
  "john tyler community college": "Brightpoint Community College",
  "lord fairfax community college": "Laurel Ridge Community College",
  "college of william and mary": "College of William & Mary",
  "smyth county career & tech": "Smyth County Career & Technology Center",
  "riverside college of health careers": "Riverside College of Health Careers School of Practical Nursing",
  "tidewater community college": "Tidewater Community College Virginia",
  "mary washington hospital school (of health professions)":
    "Mary Washington Hospital School of Radiologic Technology",
  // Typo in Sanity content (Exercise Physiologist links the misspelled doc)
  "bluefield university": "Bluefield Unviersity",
  // CSV names Social Services; career links Fire & Rescue (URL is fire-rescue)
  "albemarle county department of social services": "Albemarle County Department of Fire & Rescue"
}

const URL_IN_TEXT = /https?:\/\/[^\s<>"']+/gi

const args = process.argv.slice(2).filter((a) => a !== "--")
const dryRun = args.includes("--dry-run")
const shouldPublish = args.includes("--publish")
const csvIndex = args.indexOf("--csv")
const reportIndex = args.indexOf("--report")

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "..", "..", "..")
const defaultCsvPath = resolve(repoRoot, "data-migration/program-specific-websites.csv")
const csvPath = csvIndex >= 0 ? resolve(args[csvIndex + 1] ?? defaultCsvPath) : defaultCsvPath
const reportPath =
  reportIndex >= 0
    ? resolve(args[reportIndex + 1] ?? resolve(repoRoot, "apps/studio/program-url-migration-report.json"))
    : resolve(repoRoot, "apps/studio/program-url-migration-report.json")

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Extract first valid http(s) URL from a messy CSV cell; otherwise null. */
function extractProgramUrl(raw: string | undefined): string | null {
  const text = (raw ?? "").trim()
  if (!text) return null

  const matches = text.match(URL_IN_TEXT)
  if (!matches?.length) return null

  let url = matches[0]
  // Strip common trailing punctuation from prose cells
  url = url.replace(/[),.;:]+$/g, "")

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return parsed.toString()
  } catch {
    return null
  }
}

function findCareer(careers: SanityCareer[], csvTitle: string): { career: SanityCareer; how: string } | null {
  const trimmed = csvTitle.trim()
  if (!trimmed) return null

  const alias = CAREER_ALIASES[trimmed.toLowerCase()]
  if (alias) {
    const hit = careers.find((c) => c.title === alias)
    if (hit) return { career: hit, how: "alias" }
  }

  const exact = careers.find((c) => c.title === trimmed)
  if (exact) return { career: exact, how: "exact" }

  const normExact = careers.find((c) => normalizeName(c.title) === normalizeName(trimmed))
  if (normExact) return { career: normExact, how: "normalized" }

  const titles = careers.map((c) => c.title)
  const { bestMatch, bestMatchIndex, ratings } = stringSimilarity.findBestMatch(
    normalizeName(trimmed),
    titles.map(normalizeName)
  )
  const score = ratings[bestMatchIndex]?.rating ?? 0
  if (score >= CAREER_FUZZY_THRESHOLD) {
    return { career: careers[bestMatchIndex], how: `fuzzy:${score.toFixed(2)}` }
  }

  void bestMatch
  return null
}

function findInstitutionItem(
  career: SanityCareer,
  csvInstitution: string
): { item: EducationInstitutionItem; how: string } | null {
  const items = career.educationInstitutions ?? []
  if (!items.length) return null

  const trimmed = csvInstitution.trim()
  const alias = INSTITUTION_ALIASES[trimmed.toLowerCase()]
  const candidates = alias ? [trimmed, alias] : [trimmed]

  for (const name of candidates) {
    const exact = items.find((it) => it.institutionName === name)
    if (exact) return { item: exact, how: name === trimmed ? "exact" : "alias" }
  }

  for (const name of candidates) {
    const norm = normalizeName(name)
    const hit = items.find((it) => normalizeName(it.institutionName ?? "") === norm)
    if (hit) return { item: hit, how: "normalized" }
  }

  const names = items.map((it) => it.institutionName ?? "")
  const query = normalizeName(alias ?? trimmed)
  const { bestMatchIndex, ratings } = stringSimilarity.findBestMatch(
    query,
    names.map((n) => normalizeName(n))
  )
  const score = ratings[bestMatchIndex]?.rating ?? 0
  if (score >= INSTITUTION_FUZZY_THRESHOLD) {
    return { item: items[bestMatchIndex], how: `fuzzy:${score.toFixed(2)}` }
  }

  return null
}

function draftUrlFor(career: SanityCareer, itemKey: string): string | undefined {
  return career.draftEducationInstitutions?.find((item) => item._key === itemKey)?.programUrl
}

async function ensureDraft(
  client: ReturnType<typeof createClient>,
  publishedId: string
): Promise<void> {
  const published = await client.getDocument(publishedId)
  if (!published) {
    throw new Error(`Published document not found: ${publishedId}`)
  }
  const { _rev, ...rest } = published
  void _rev
  await client.createIfNotExists({ ...rest, _id: `drafts.${publishedId}` })
}

async function main() {
  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN is required (Editor or higher)")
    console.error("   export SANITY_API_TOKEN='...'")
    process.exit(1)
  }

  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: dryRun && !process.env.SANITY_API_TOKEN,
    token: process.env.SANITY_API_TOKEN
  })

  console.log(`📄 CSV: ${csvPath}`)
  console.log(`Mode: ${dryRun ? "DRY RUN" : "APPLY"}${shouldPublish ? " + publish" : ""}`)

  const csvText = await readFile(csvPath, "utf8")
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true
  }) as CsvRow[]

  const careers = (await client.fetch(`*[_type == "career" && !(_id in path("drafts.**"))]{
    _id,
    "title": coalesce(title.en, title),
    "hasDraft": defined(*[_id == "drafts." + ^._id][0]._id),
    educationInstitutions[]{
      _key,
      programUrl,
      "institutionId": institution->_id,
      "institutionName": institution->name
    },
    "draftEducationInstitutions": *[_id == "drafts." + ^._id][0].educationInstitutions[]{
      _key,
      programUrl
    }
  } | order(title)`)) as SanityCareer[]

  console.log(`Loaded ${rows.length} CSV rows, ${careers.length} published Sanity careers`)

  const planned: PlannedUpdate[] = []
  const skipped: Array<Record<string, string>> = []
  const unmatched: Array<Record<string, string>> = []

  for (const row of rows) {
    const careerTitle = (row.Career ?? "").trim()
    const institution = (row.Institution ?? "").trim()
    const rawProgram = row["Program Specific Website"]
    const programUrl = extractProgramUrl(rawProgram)

    if (!programUrl) {
      skipped.push({
        reason: "no_valid_url",
        career: careerTitle,
        institution,
        raw: (rawProgram ?? "").slice(0, 160)
      })
      continue
    }

    const careerHit = findCareer(careers, careerTitle)
    if (!careerHit) {
      unmatched.push({
        reason: "career_not_found",
        career: careerTitle,
        institution,
        programUrl
      })
      continue
    }

    const itemHit = findInstitutionItem(careerHit.career, institution)
    if (!itemHit) {
      unmatched.push({
        reason: "institution_not_on_career",
        career: careerTitle,
        matchedCareer: careerHit.career.title,
        institution,
        programUrl,
        available: (careerHit.career.educationInstitutions ?? [])
          .map((i) => i.institutionName)
          .filter(Boolean)
          .join(" | ")
          .slice(0, 300)
      })
      continue
    }

    const oldUrl = itemHit.item.programUrl
    const publishedId = careerHit.career._id.replace(/^drafts\./, "")
    const draftUrl = draftUrlFor(careerHit.career, itemHit.item._key)
    const patchPublished = shouldPublish && oldUrl !== programUrl
    const patchDraft = shouldPublish
      ? Boolean(careerHit.career.hasDraft) && draftUrl !== programUrl
      : !careerHit.career.hasDraft || draftUrl !== programUrl

    if (!patchPublished && !patchDraft) {
      skipped.push({
        reason: "already_set",
        career: careerHit.career.title,
        institution: itemHit.item.institutionName ?? institution,
        programUrl
      })
      continue
    }

    planned.push({
      careerId: publishedId,
      careerTitle: careerHit.career.title,
      itemKey: itemHit.item._key,
      institutionName: itemHit.item.institutionName ?? institution,
      csvInstitution: institution,
      oldUrl,
      newUrl: programUrl,
      matchHow: `${careerHit.how}+${itemHit.how}`,
      patchPublished,
      patchDraft
    })
  }

  // Group updates by career for batched patches
  const byCareer = new Map<string, PlannedUpdate[]>()
  for (const update of planned) {
    const list = byCareer.get(update.careerId) ?? []
    list.push(update)
    byCareer.set(update.careerId, list)
  }

  const publishedUpdates = planned.filter((p) => p.patchPublished)
  const draftUpdates = planned.filter((p) => p.patchDraft)

  console.log("\n—— Summary ——")
  console.log(`Would update:     ${planned.length}`)
  console.log(`  published:      ${publishedUpdates.length}`)
  console.log(`  drafts:         ${draftUpdates.length}`)
  console.log(`  overwrite:      ${publishedUpdates.filter((p) => p.oldUrl).length}`)
  console.log(`  new:            ${publishedUpdates.filter((p) => !p.oldUrl).length}`)
  console.log(`Careers touched:  ${byCareer.size}`)
  console.log(`Skipped:          ${skipped.length}`)
  console.log(`Unmatched:        ${unmatched.length}`)

  if (unmatched.length) {
    console.log("\nUnmatched (first 20):")
    for (const row of unmatched.slice(0, 20)) {
      console.log(`  [${row.reason}] ${row.career} × ${row.institution}`)
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    csv: basename(csvPath),
    dryRun,
    counts: {
      csvRows: rows.length,
      planned: planned.length,
      published: publishedUpdates.length,
      drafts: draftUpdates.length,
      overwrite: publishedUpdates.filter((p) => p.oldUrl).length,
      skipped: skipped.length,
      unmatched: unmatched.length,
      careers: byCareer.size
    },
    planned,
    skipped,
    unmatched
  }
  await writeFile(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📝 Report: ${reportPath}`)

  if (dryRun) {
    console.log("\nDry run complete — no changes written.")
    return
  }

  let patched = 0
  let failed = 0
  let draftsSynced = 0

  for (const [careerId, updates] of byCareer) {
    const publishedId = careerId.replace(/^drafts\./, "")
    const draftId = `drafts.${publishedId}`
    const title = updates[0]?.careerTitle ?? publishedId
    const publishedOps: Record<string, string> = {}
    const draftOps: Record<string, string> = {}

    for (const update of updates) {
      const path = `educationInstitutions[_key=="${update.itemKey}"].programUrl`
      if (update.patchPublished) publishedOps[path] = update.newUrl
      if (update.patchDraft) draftOps[path] = update.newUrl
    }

    try {
      if (shouldPublish && Object.keys(publishedOps).length) {
        await client.patch(publishedId).set(publishedOps).commit({ autoGenerateArrayKeys: false })
      }

      if (Object.keys(draftOps).length) {
        if (!shouldPublish) {
          await ensureDraft(client, publishedId)
        }
        await client.patch(draftId).set(draftOps).commit({ autoGenerateArrayKeys: false })
        draftsSynced += 1
      }

      patched += 1
      const pubCount = Object.keys(publishedOps).length
      const draftCount = Object.keys(draftOps).length
      console.log(
        `✓ ${title} (published ${pubCount} URL(s), draft ${draftCount} URL(s))`
      )
    } catch (err) {
      failed += 1
      console.error(`✗ Failed ${title} (${publishedId}):`, err)
    }
  }

  if (!shouldPublish) {
    console.log("\nPatches saved as drafts. Re-run with --publish to write live published documents.")
  }

  console.log(`\nDone. Careers patched: ${patched}, drafts synced: ${draftsSynced}, failed: ${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
