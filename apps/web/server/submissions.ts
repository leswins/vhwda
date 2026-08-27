import { supabaseRest } from "./cms"

export type ResourceDestination = "public_hub" | "teacher_portal"

export type ResourceSubmission = {
  id: string
  resource_type_slug: string
  resource_type_id: string | null
  destination: ResourceDestination
  name: string
  summary: string | null
  description: string | null
  institution: string | null
  eligibility: string | null
  region: string | null
  deadline: string | null
  link: string | null
  file_url: string | null
  current_stage: string[]
  funding_type: string | null
  location_scope: string | null
  badges: string[]
  career_areas_text: string | null
  submitter_name: string
  submitter_email: string
  submitter_organization: string | null
  notes: string | null
  status: "pending" | "approved" | "declined"
  submitted_at: string
  reviewed_at: string | null
  sanity_document_id: string | null
}

export type ResourceSubmissionInsert = Omit<
  ResourceSubmission,
  "id" | "status" | "submitted_at" | "reviewed_at" | "sanity_document_id"
>

function withDefaults(row: Partial<ResourceSubmission> & { id: string; name: string }): ResourceSubmission {
  return {
    id: row.id,
    resource_type_slug: row.resource_type_slug || "scholarships",
    resource_type_id: row.resource_type_id ?? null,
    destination: row.destination === "teacher_portal" ? "teacher_portal" : "public_hub",
    name: row.name,
    summary: row.summary ?? null,
    description: row.description ?? null,
    institution: row.institution ?? null,
    eligibility: row.eligibility ?? null,
    region: row.region ?? null,
    deadline: row.deadline ?? null,
    link: row.link ?? null,
    file_url: row.file_url ?? null,
    current_stage: row.current_stage ?? [],
    funding_type: row.funding_type ?? null,
    location_scope: row.location_scope ?? null,
    badges: row.badges ?? [],
    career_areas_text: row.career_areas_text ?? null,
    submitter_name: row.submitter_name ?? "",
    submitter_email: row.submitter_email ?? "",
    submitter_organization: row.submitter_organization ?? null,
    notes: row.notes ?? null,
    status: row.status ?? "pending",
    submitted_at: row.submitted_at ?? new Date().toISOString(),
    reviewed_at: row.reviewed_at ?? null,
    sanity_document_id: row.sanity_document_id ?? null
  }
}

const FULL_COLUMNS = [
  "resource_type_slug",
  "resource_type_id",
  "destination",
  "name",
  "summary",
  "description",
  "institution",
  "eligibility",
  "region",
  "deadline",
  "link",
  "file_url",
  "current_stage",
  "funding_type",
  "location_scope",
  "badges",
  "career_areas_text",
  "submitter_name",
  "submitter_email",
  "submitter_organization",
  "notes",
  "status"
]

const LEGACY_COLUMNS = [
  "name",
  "summary",
  "description",
  "institution",
  "eligibility",
  "region",
  "deadline",
  "link",
  "current_stage",
  "funding_type",
  "location_scope",
  "badges",
  "career_areas_text",
  "submitter_name",
  "submitter_email",
  "submitter_organization",
  "notes",
  "status"
]

function pick(row: Record<string, unknown>, keys: string[]) {
  const next: Record<string, unknown> = {}
  for (const key of keys) {
    if (key in row) next[key] = row[key]
  }
  return next
}

export async function insertResourceSubmission(input: ResourceSubmissionInsert) {
  const fullRow = {
    ...input,
    resource_type_slug: input.resource_type_slug || "scholarships",
    destination: input.destination || "public_hub",
    current_stage: input.current_stage ?? [],
    badges: input.badges ?? [],
    status: "pending"
  }

  const attempts: Array<{ table: string; columns: string[] }> = [
    { table: "resource_submissions", columns: FULL_COLUMNS },
    { table: "scholarship_submissions", columns: FULL_COLUMNS },
    { table: "scholarship_submissions", columns: LEGACY_COLUMNS }
  ]

  let lastError = "Failed to save submission"
  for (const attempt of attempts) {
    const result = await supabaseRest<ResourceSubmission[]>(`${attempt.table}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: pick(fullRow, attempt.columns)
    })
    if (result.ok && Array.isArray(result.data) && result.data[0]) {
      return { ok: true as const, row: withDefaults(result.data[0]) }
    }
    lastError = result.text || lastError
  }

  return { ok: false as const, error: lastError }
}

export async function listResourceSubmissions(status?: string) {
  const statusFilter =
    status && ["pending", "approved", "declined"].includes(status) ? `&status=eq.${status}` : ""

  const tables = ["resource_submissions", "scholarship_submissions"]
  const seen = new Set<string>()
  const rows: ResourceSubmission[] = []

  for (const table of tables) {
    const result = await supabaseRest<Array<Partial<ResourceSubmission> & { id: string; name: string }>>(
      `${table}?order=submitted_at.desc${statusFilter}`
    )
    if (!result.ok || !Array.isArray(result.data)) continue
    for (const row of result.data) {
      if (seen.has(row.id)) continue
      seen.add(row.id)
      rows.push(withDefaults(row))
    }
  }

  rows.sort((a, b) => (a.submitted_at < b.submitted_at ? 1 : -1))
  return rows
}

export async function fetchResourceSubmission(id: string) {
  for (const table of ["resource_submissions", "scholarship_submissions"]) {
    const result = await supabaseRest<Array<Partial<ResourceSubmission> & { id: string; name: string }>>(
      `${table}?id=eq.${id}&limit=1`
    )
    if (result.ok && Array.isArray(result.data) && result.data[0]) {
      return { table, row: withDefaults(result.data[0]) }
    }
  }
  return null
}

export async function patchResourceSubmission(
  table: string,
  id: string,
  patch: Record<string, unknown>,
  extraFilters = ""
) {
  const result = await supabaseRest<Array<Partial<ResourceSubmission> & { id: string; name: string }>>(
    `${table}?id=eq.${id}${extraFilters}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: patch
    }
  )
  if (!result.ok || !Array.isArray(result.data) || result.data.length === 0) return []
  return result.data.map((row) => withDefaults(row))
}
