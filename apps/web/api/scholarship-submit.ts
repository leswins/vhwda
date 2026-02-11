export const config = { runtime: "edge" }

type SubmissionPayload = {
  name?: string
  summary?: string
  description?: string
  institution?: string
  eligibility?: string
  region?: string
  deadline?: string
  link?: string
  current_stage?: string[]
  funding_type?: string
  location_scope?: string
  badges?: string[]
  career_areas_text?: string
  submitter_name?: string
  submitter_email?: string
  submitter_organization?: string
  notes?: string
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  })
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return json({ error: "Server configuration error" }, 500)
  }

  let payload: SubmissionPayload
  try {
    payload = (await request.json()) as SubmissionPayload
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  // Validate required fields
  const errors: string[] = []
  if (!payload.name?.trim()) errors.push("name is required")
  if (!payload.link?.trim()) errors.push("link is required")
  if (!payload.submitter_name?.trim()) errors.push("submitter_name is required")
  if (!payload.submitter_email?.trim()) errors.push("submitter_email is required")

  // Basic email format check
  if (payload.submitter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.submitter_email)) {
    errors.push("submitter_email is not a valid email")
  }

  // Basic URL format check
  if (payload.link) {
    try {
      new URL(payload.link)
    } catch {
      errors.push("link must be a valid URL")
    }
  }

  if (errors.length > 0) {
    return json({ error: "Validation failed", details: errors }, 400)
  }

  const row = {
    name: payload.name!.trim(),
    summary: payload.summary?.trim() || null,
    description: payload.description?.trim() || null,
    institution: payload.institution?.trim() || null,
    eligibility: payload.eligibility?.trim() || null,
    region: payload.region?.trim() || null,
    deadline: payload.deadline || null,
    link: payload.link!.trim(),
    current_stage: payload.current_stage ?? [],
    funding_type: payload.funding_type || null,
    location_scope: payload.location_scope || null,
    badges: payload.badges ?? [],
    career_areas_text: payload.career_areas_text?.trim() || null,
    submitter_name: payload.submitter_name!.trim(),
    submitter_email: payload.submitter_email!.trim(),
    submitter_organization: payload.submitter_organization?.trim() || null,
    notes: payload.notes?.trim() || null,
    status: "pending"
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/scholarship_submissions`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("Supabase insert error:", text)
    return json({ error: "Failed to save submission" }, 502)
  }

  return json({ success: true, message: "Scholarship submitted successfully" }, 201)
}
