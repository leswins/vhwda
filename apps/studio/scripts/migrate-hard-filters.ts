#!/usr/bin/env node
/**
 * Migration Script: Legacy Hard Filters → New Checklist Format
 * 
 * This script migrates career documents from the old hard filter structure
 * (educationMin, licensureRequired, hardRequirements) to the new hardFilters
 * checklist format.
 * 
 * Usage:
 *   pnpm --filter studio migrate:hard-filters
 *   or
 *   tsx scripts/migrate-hard-filters.ts
 */

import { createClient } from "@sanity/client"

// Sanity configuration
const client = createClient({
  projectId: "j0yc55ca",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Set this in your environment
})

type LegacyCareer = {
  _id: string
  _rev: string
  title?: { en?: string; es?: string }
  educationMin?: string
  licensureRequired?: boolean
  hardRequirements?: {
    requiresLicensure?: boolean
    requiresLifting?: boolean
    requiresNightsWeekends?: boolean
    requiresBloodNeedles?: boolean
    requiresAcuteStress?: boolean
  }
  salary?: {
    rangeMin?: number
  }
  hardFilters?: Array<{
    type: string
    educationLevel?: string
    minSalary?: number
    region?: string
    note?: string
  }>
}

type NewHardFilter = {
  _type: "careerHardFilter"
  _key: string
  type: string
  educationLevel?: string
  minSalary?: number
  region?: string
  note?: string
}

/**
 * Converts legacy fields to new hardFilters array
 */
function convertLegacyToHardFilters(career: LegacyCareer): NewHardFilter[] {
  const hardFilters: NewHardFilter[] = []
  let keyCounter = 1

  // 1. Convert educationMin
  if (career.educationMin) {
    hardFilters.push({
      _type: "careerHardFilter",
      _key: `migrated_${keyCounter++}`,
      type: "education_ceiling",
      educationLevel: career.educationMin,
      note: `Migrated from educationMin field`,
    })
  }

  // 2. Convert licensureRequired (top-level)
  if (career.licensureRequired === true) {
    hardFilters.push({
      _type: "careerHardFilter",
      _key: `migrated_${keyCounter++}`,
      type: "licensure_required",
      note: `Migrated from licensureRequired field`,
    })
  }

  // 3. Convert hardRequirements object
  if (career.hardRequirements) {
    const hr = career.hardRequirements

    if (hr.requiresLicensure === true) {
      hardFilters.push({
        _type: "careerHardFilter",
        _key: `migrated_${keyCounter++}`,
        type: "licensure_required",
        note: `Migrated from hardRequirements.requiresLicensure`,
      })
    }

    if (hr.requiresLifting === true) {
      hardFilters.push({
        _type: "careerHardFilter",
        _key: `migrated_${keyCounter++}`,
        type: "dealbreaker_lifting",
        note: `Migrated from hardRequirements.requiresLifting`,
      })
    }

    if (hr.requiresNightsWeekends === true) {
      hardFilters.push({
        _type: "careerHardFilter",
        _key: `migrated_${keyCounter++}`,
        type: "dealbreaker_nights_weekends",
        note: `Migrated from hardRequirements.requiresNightsWeekends`,
      })
    }

    if (hr.requiresBloodNeedles === true) {
      hardFilters.push({
        _type: "careerHardFilter",
        _key: `migrated_${keyCounter++}`,
        type: "dealbreaker_blood_needles",
        note: `Migrated from hardRequirements.requiresBloodNeedles`,
      })
    }

    if (hr.requiresAcuteStress === true) {
      hardFilters.push({
        _type: "careerHardFilter",
        _key: `migrated_${keyCounter++}`,
        type: "dealbreaker_high_stress",
        note: `Migrated from hardRequirements.requiresAcuteStress`,
      })
    }
  }

  // 4. Convert salary.rangeMin to min_start_salary if it exists
  if (career.salary?.rangeMin && career.salary.rangeMin > 0) {
    hardFilters.push({
      _type: "careerHardFilter",
      _key: `migrated_${keyCounter++}`,
      type: "min_start_salary",
      minSalary: career.salary.rangeMin,
      note: `Migrated from salary.rangeMin`,
    })
  }

  return hardFilters
}

/**
 * Main migration function
 */
async function migrateHardFilters() {
  console.log("🚀 Starting Hard Filters Migration...\n")

  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ Error: SANITY_API_TOKEN environment variable is required")
    console.error("   Set it with: export SANITY_API_TOKEN='your-token'")
    console.error("   Or create a .env file in apps/studio/ with SANITY_API_TOKEN=...")
    process.exit(1)
  }

  try {
    // Fetch all careers
    console.log("📥 Fetching all careers...")
    const careers = await client.fetch<LegacyCareer[]>(
      `*[_type == "career"]{
        _id,
        _rev,
        title,
        educationMin,
        licensureRequired,
        hardRequirements,
        salary,
        hardFilters
      }`
    )

    console.log(`   Found ${careers.length} careers\n`)

    if (careers.length === 0) {
      console.log("✅ No careers found. Nothing to migrate.")
      return
    }

    // Process each career
    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const career of careers) {
      const careerTitle = career.title?.en || career.title?.es || career._id

      try {
        // Skip if already has hardFilters (already migrated)
        if (career.hardFilters && career.hardFilters.length > 0) {
          console.log(`⏭️  Skipping "${careerTitle}" - already has hardFilters`)
          skipped++
          continue
        }

        // Convert legacy fields
        const newHardFilters = convertLegacyToHardFilters(career)

        // Skip if no filters to add
        if (newHardFilters.length === 0) {
          console.log(`⏭️  Skipping "${careerTitle}" - no legacy filters found`)
          skipped++
          continue
        }

        // Merge with existing hardFilters if any (shouldn't happen, but safe)
        const existingFilters = career.hardFilters || []
        const allFilters = [...existingFilters, ...newHardFilters]

        // Update the career
        console.log(`🔄 Migrating "${careerTitle}"...`)
        console.log(`   Adding ${newHardFilters.length} hard filter(s):`)
        newHardFilters.forEach((filter) => {
          console.log(`     - ${filter.type}${filter.educationLevel ? ` (${filter.educationLevel})` : ""}${filter.minSalary ? ` ($${filter.minSalary})` : ""}`)
        })

        await client
          .patch(career._id)
          .set({ hardFilters: allFilters })
          .commit()

        console.log(`   ✅ Successfully migrated "${careerTitle}"\n`)
        migrated++

      } catch (error) {
        console.error(`   ❌ Error migrating "${careerTitle}":`, error)
        errors++
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50))
    console.log("📊 Migration Summary:")
    console.log(`   ✅ Migrated: ${migrated}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log("=".repeat(50) + "\n")

    if (migrated > 0) {
      console.log("✨ Migration complete! Check Sanity Studio to verify the changes.")
      console.log("   The legacy fields are still present but marked as deprecated.")
      console.log("   You can remove them manually after verifying the migration.\n")
    }

  } catch (error) {
    console.error("❌ Fatal error during migration:", error)
    process.exit(1)
  }
}

// Run migration
migrateHardFilters().catch((error) => {
  console.error("❌ Unhandled error:", error)
  process.exit(1)
})

