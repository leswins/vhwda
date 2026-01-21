#!/usr/bin/env node
import "dotenv/config"
import { createClient } from "@sanity/client"
import { randomUUID } from "crypto"

type CareerAreaRef = {
  _key?: string
  _ref: string
  _type?: "reference"
  _weak?: boolean
  _strengthenOnPublish?: {
    type: string
    weak: boolean
    template: {
      id: string
    }
  }
}

type ProfessionalOrganization = {
  _id: string
  name?: string
  careerAreas?: CareerAreaRef[]
  hasDraft?: boolean
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

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is required")
  process.exit(1)
}

if (limitIndex >= 0 && (!Number.isFinite(limit) || limit === undefined)) {
  console.error("❌ --limit requires a numeric value")
  process.exit(1)
}

function addMissingKeys(items: CareerAreaRef[]) {
  let changed = false
  const updated = items.map((item) => {
    if (item._key) return item
    changed = true
    return {
      ...item,
      _type: item._type ?? "reference",
      _key: randomUUID()
    }
  })
  return { updated, changed }
}

async function main() {
  const orgs = await client.fetch<ProfessionalOrganization[]>(
    `*[_type == "professionalOrganization" && defined(careerAreas)]{
      _id,
      name,
      careerAreas,
      "hasDraft": count(*[_id == "drafts." + ^._id]) > 0
    }`
  )

  const targetOrgs = typeof limit === "number" ? orgs.slice(0, limit) : orgs
  console.log(`Found ${orgs.length} professional organizations with career areas.`)
  if (typeof limit === "number") {
    console.log(`Limiting to first ${targetOrgs.length} record(s).`)
  }

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const org of targetOrgs) {
    if (!org.careerAreas || org.careerAreas.length === 0) {
      skipped++
      continue
    }

    const { updated: updatedAreas, changed } = addMissingKeys(org.careerAreas)
    if (!changed) {
      skipped++
      continue
    }

    const label = org.name ?? org._id

    try {
      if (dryRun) {
        console.log(`🧪 Dry run: would add keys for ${label}`)
        updated++
        continue
      }

      await client.patch(org._id).set({ careerAreas: updatedAreas }).commit()
      if (org.hasDraft) {
        await client.mutate([{ publish: { id: org._id } }])
      }
      console.log(`✅ Fixed and published ${label}`)
      updated++
    } catch (error) {
      console.error(`❌ Error fixing ${label}:`, error)
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

