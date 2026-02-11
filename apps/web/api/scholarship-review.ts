export const config = { runtime: "edge" }

type ReviewPayload = {
  id?: string
  action?: "approve" | "decline"
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-portal-password"
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  })
}

function authorize(request: Request): boolean {
  const password = request.headers.get("x-portal-password")
  const expected = process.env.SCHOLARSHIP_PORTAL_PASSWORD
  if (!expected) return false
  return password === expected
}

/** Convert plain text into a minimal portable-text array (single block). */
function toPortableText(text: string) {
  return [
    {
      _type: "block",
      _key: crypto.randomUUID().slice(0, 8),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: crypto.randomUUID().slice(0, 8),
          text,
          marks: []
        }
      ]
    }
  ]
}

type Submission = {
  id: string
  name: string
  summary: string | null
  description: string | null
  institution: string | null
  eligibility: string | null
  region: string | null
  deadline: string | null
  link: string
  current_stage: string[]
  funding_type: string | null
  location_scope: string | null
  badges: string[]
  career_areas_text: string | null
  status: "pending" | "approved" | "declined"
  submitted_at: string
  reviewed_at: string | null
  sanity_document_id: string | null
}

async function fetchSubmission(
  supabaseUrl: string,
  supabaseKey: string,
  id: string
): Promise<Submission | null> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/scholarship_submissions?id=eq.${id}&limit=1`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  )
  if (!response.ok) return null
  const rows = (await response.json()) as Submission[]
  return rows[0] ?? null
}

/**
 * Atomically update a submission row. Returns the updated rows (empty array
 * if no row matched the filters, which signals a lost race).
 *
 * @param extraFilters  Additional PostgREST filters appended to the URL
 *                      (e.g. `&status=eq.pending`) so the PATCH only succeeds
 *                      when the row is still in the expected state.
 */
async function updateSubmission(
  supabaseUrl: string,
  supabaseKey: string,
  id: string,
  patch: Record<string, unknown>,
  extraFilters = ""
): Promise<Submission[]> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/scholarship_submissions?id=eq.${id}${extraFilters}`,
    {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(patch)
    }
  )
  if (!response.ok) return []
  return (await response.json()) as Submission[]
}

async function createSanityScholarship(
  submission: Submission
): Promise<{ id: string } | null> {
  const sanityToken = process.env.SANITY_API_TOKEN
  const projectId = process.env.SANITY_PROJECT_ID || "j0yc55ca"
  const dataset = process.env.SANITY_DATASET || "production"

  if (!sanityToken) return null

  const docId = crypto.randomUUID()

  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "scholarship",
    name: submission.name,
    link: submission.link
  }

  if (submission.summary) {
    doc.summary = { _type: "localizedString", en: submission.summary }
  }

  if (submission.description) {
    doc.description = { _type: "localizedText", en: submission.description }
  }

  if (submission.institution) {
    doc.institution = submission.institution
  }

  if (submission.eligibility) {
    doc.eligibility = {
      _type: "localizedPortableText",
      en: toPortableText(submission.eligibility)
    }
  }

  if (submission.region) {
    doc.region = submission.region
  }

  if (submission.deadline) {
    doc.deadline = submission.deadline
  }

  if (submission.current_stage && submission.current_stage.length > 0) {
    doc.currentStage = submission.current_stage
  }

  if (submission.funding_type) {
    doc.fundingType = submission.funding_type
  }

  if (submission.location_scope) {
    doc.locationScope = submission.location_scope
  }

  if (submission.badges && submission.badges.length > 0) {
    doc.badges = submission.badges
  }

  const mutations = [{ create: doc }]

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2025-11-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanityToken}`
      },
      body: JSON.stringify({ mutations })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    console.error("Sanity create error:", text)
    return null
  }

  return { id: docId }
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  if (!authorize(request)) {
    return json({ error: "Unauthorized" }, 401)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return json({ error: "Server configuration error" }, 500)
  }

  let payload: ReviewPayload
  try {
    payload = (await request.json()) as ReviewPayload
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  if (!payload.id) {
    return json({ error: "id is required" }, 400)
  }

  if (!payload.action || !["approve", "decline"].includes(payload.action)) {
    return json({ error: "action must be 'approve' or 'decline'" }, 400)
  }

  // ── Decline flow ────────────────────────────────────────────────
  if (payload.action === "decline") {
    // Atomic: only patches if the row is still pending
    const updated = await updateSubmission(
      supabaseUrl,
      supabaseKey,
      payload.id,
      { status: "declined", reviewed_at: new Date().toISOString() },
      "&status=eq.pending"
    )

    if (updated.length === 0) {
      // Either not found or already reviewed
      const existing = await fetchSubmission(supabaseUrl, supabaseKey, payload.id)
      if (!existing) return json({ error: "Submission not found" }, 404)
      return json({ error: `Submission already ${existing.status}` }, 409)
    }

    return json({ success: true, message: "Scholarship declined" }, 200)
  }

  // ── Approve flow ───────────────────────────────────────────────
  // Step 1: Atomically claim the row by moving it to "approved".
  //         This prevents a second concurrent request from also claiming it.
  const claimed = await updateSubmission(
    supabaseUrl,
    supabaseKey,
    payload.id,
    { status: "approved", reviewed_at: new Date().toISOString() },
    "&status=eq.pending"
  )

  if (claimed.length === 0) {
    const existing = await fetchSubmission(supabaseUrl, supabaseKey, payload.id)
    if (!existing) return json({ error: "Submission not found" }, 404)
    return json({ error: `Submission already ${existing.status}` }, 409)
  }

  const submission = claimed[0]

  // Step 2: Create the Sanity document (only one request can reach here per submission)
  const sanityResult = await createSanityScholarship(submission)
  if (!sanityResult) {
    // Roll back: move row back to pending so it can be retried
    await updateSubmission(supabaseUrl, supabaseKey, payload.id, {
      status: "pending",
      reviewed_at: null
    })
    return json({ error: "Failed to create scholarship in Sanity" }, 502)
  }

  // Step 3: Store the Sanity document ID on the row
  await updateSubmission(supabaseUrl, supabaseKey, payload.id, {
    sanity_document_id: sanityResult.id
  })

  return json({
    success: true,
    message: "Scholarship approved and added to Sanity",
    sanity_document_id: sanityResult.id
  }, 200)
}
