export const config = { runtime: "edge" }

import { corsHeaders, jsonResponse, sanityQuery } from "../server/cms"
import { insertResourceSubmission } from "../server/submissions"
import { fieldsForKind, submitKindForSlug, type ResourceDetails } from "../src/lib/resourceSubmitFields"

type ResourceDestination = "public_hub" | "teacher_portal"

function destinationForAudience(
  audience: string | undefined,
  requested: ResourceDestination
): ResourceDestination {
  if (audience === "teacherPortal") return "teacher_portal"
  if (audience === "publicHub") return "public_hub"
  return requested
}

const FALLBACK_AUDIENCE: Record<string, string> = {
  scholarships: "publicHub",
  organizations: "publicHub",
  schools: "publicHub",
  internships: "publicHub",
  grants: "publicHub",
  "teacher-materials": "teacherPortal"
}

async function resolveDestination(slug: string, requested: ResourceDestination): Promise<ResourceDestination> {
  const fromCms = await sanityQuery<{ audience?: string }>(
    `*[_type == "resourceType" && slug == $slug][0]{ audience }`,
    { slug }
  )
  return destinationForAudience(fromCms?.audience || FALLBACK_AUDIENCE[slug], requested)
}

type SubmissionPayload = {
  resource_type_slug?: string
  resource_type_id?: string
  destination?: "public_hub" | "teacher_portal"
  name?: string
  summary?: string
  description?: string
  institution?: string
  eligibility?: string
  region?: string
  deadline?: string
  link?: string
  file_url?: string
  current_stage?: string[]
  funding_type?: string
  location_scope?: string
  badges?: string[]
  career_areas_text?: string
  details?: ResourceDetails
  submitter_name?: string
  submitter_email?: string
  submitter_organization?: string
  notes?: string
}

const CORS = corsHeaders("POST, OPTIONS")

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  let payload: SubmissionPayload
  try {
    payload = (await request.json()) as SubmissionPayload
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, CORS)
  }

  const slug = payload.resource_type_slug?.trim() || "scholarships"
  const kind = submitKindForSlug(slug)
  const fields = fieldsForKind(kind)
  const destination = await resolveDestination(
    slug,
    payload.destination === "teacher_portal" ? "teacher_portal" : "public_hub"
  )
  const errors: string[] = []
  if (!payload.name?.trim()) errors.push("name is required")
  if (!payload.submitter_name?.trim()) errors.push("submitter_name is required")
  if (!payload.submitter_email?.trim()) errors.push("submitter_email is required")
  if (payload.submitter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.submitter_email)) {
    errors.push("submitter_email is not a valid email")
  }

  const details = payload.details ?? {}
  const link = payload.link?.trim() || ""
  const fileUrl = payload.file_url?.trim() || ""
  if (fields.linkRequired && !link) errors.push("link is required")
  if (fields.fileUrl && !fields.linkRequired && !link && !fileUrl) {
    errors.push("a file URL or web link is required")
  }
  if (link) {
    try {
      new URL(link)
    } catch {
      errors.push("link must be a valid URL")
    }
  }
  if (fileUrl) {
    try {
      new URL(fileUrl)
    } catch {
      errors.push("file_url must be a valid URL")
    }
  }
  if (fields.experienceKind && !details.experienceKind && !payload.funding_type) {
    errors.push("experience type is required")
  }
  if (fields.compensation && !details.compensation) {
    errors.push("compensation is required")
  }
  if (fields.opportunityKind && !details.opportunityKind && !payload.funding_type) {
    errors.push("opportunity type is required")
  }
  if (fields.applicantType && !(details.applicantType?.length || payload.current_stage?.length)) {
    errors.push("at least one applicant type is required")
  }
  if (fields.materialKind && !details.materialKind && !payload.funding_type) {
    errors.push("material type is required")
  }

  if (errors.length > 0) {
    return jsonResponse({ error: "Validation failed", details: errors }, 400, CORS)
  }

  const result = await insertResourceSubmission({
    resource_type_slug: slug,
    resource_type_id: payload.resource_type_id?.trim() || null,
    destination,
    name: payload.name!.trim(),
    summary: payload.summary?.trim() || null,
    description: payload.description?.trim() || null,
    institution: payload.institution?.trim() || null,
    eligibility: payload.eligibility?.trim() || null,
    region: payload.region?.trim() || null,
    deadline: payload.deadline || null,
    link: link || null,
    file_url: fileUrl || null,
    current_stage: payload.current_stage ?? [],
    funding_type: payload.funding_type || null,
    location_scope: payload.location_scope || null,
    badges: payload.badges ?? [],
    career_areas_text: payload.career_areas_text?.trim() || null,
    details,
    submitter_name: payload.submitter_name!.trim(),
    submitter_email: payload.submitter_email!.trim(),
    submitter_organization: payload.submitter_organization?.trim() || null,
    notes: payload.notes?.trim() || null
  })

  if (!result.ok) {
    console.error("Supabase insert error:", result.error)
    return jsonResponse({ error: "Failed to save submission" }, 502, CORS)
  }

  return jsonResponse({ success: true, message: "Resource submitted successfully" }, 201, CORS)
}
