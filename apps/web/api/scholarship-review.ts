export const config = { runtime: "edge" }

import {
  authorizePortal,
  corsHeaders,
  jsonResponse,
  localizedString,
  localizedText,
  sanityMutate,
  sanityQuery,
  toPortableText
} from "../server/cms"
import {
  fetchResourceSubmission,
  patchResourceSubmission,
  type ResourceSubmission
} from "../server/submissions"
import { submitKindForSlug, type ResourceDetails } from "../src/lib/resourceSubmitFields"

type ReviewPayload = {
  id?: string
  action?: "approve" | "decline"
}

const CORS = corsHeaders("POST, OPTIONS", "x-portal-password")

type SanityResourceType = {
  _id: string
  slug?: string
  sourceKind?: string
  audience?: string
}

function splitList(value?: string | null) {
  if (!value) return []
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function detailsOf(submission: ResourceSubmission): ResourceDetails {
  return submission.details ?? {}
}

async function resolveCareerAreaRefs(submission: ResourceSubmission) {
  const ids = detailsOf(submission).careerAreaIds?.filter(Boolean) ?? []
  if (ids.length > 0) {
    return ids.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: crypto.randomUUID().slice(0, 12)
    }))
  }
  const names = splitList(submission.career_areas_text)
  if (names.length === 0) return []
  const matches = await sanityQuery<Array<{ _id: string }>>(
    `*[_type == "careerCategory" && title in $names]{ _id }`,
    { names }
  )
  return (matches ?? []).map((row) => ({
    _type: "reference",
    _ref: row._id,
    _key: crypto.randomUUID().slice(0, 12)
  }))
}

async function resolveResourceType(submission: ResourceSubmission): Promise<SanityResourceType | null> {
  if (submission.resource_type_id && !submission.resource_type_id.startsWith("fallback.")) {
    const byId = await sanityQuery<SanityResourceType>(
      `*[_type == "resourceType" && _id == $id][0]{ _id, slug, sourceKind, audience }`,
      { id: submission.resource_type_id }
    )
    if (byId?._id) return byId
  }

  const slug = submission.resource_type_slug || "scholarships"
  return await sanityQuery<SanityResourceType>(
    `*[_type == "resourceType" && slug == $slug][0]{ _id, slug, sourceKind, audience }`,
    { slug }
  )
}

async function createSanityDocument(submission: ResourceSubmission) {
  const resourceType = await resolveResourceType(submission)
  const sourceKind = resourceType?.sourceKind || (submission.resource_type_slug === "organizations" ? "professionalOrganization" : "scholarship")
  const docId = crypto.randomUUID()

  if (sourceKind === "scholarship" && submission.destination !== "teacher_portal") {
    const doc: Record<string, unknown> = {
      _id: docId,
      _type: "scholarship",
      name: submission.name,
      link: submission.link || "https://vahealthcareers.org/resources"
    }
    if (submission.summary) doc.summary = localizedString(submission.summary)
    if (submission.description) doc.description = localizedText(submission.description)
    if (submission.institution) doc.institution = submission.institution
    if (submission.eligibility) {
      doc.eligibility = { _type: "localizedPortableText", en: toPortableText(submission.eligibility) }
    }
    if (submission.region) doc.region = submission.region
    if (submission.deadline) doc.deadline = submission.deadline
    if (submission.current_stage?.length) doc.currentStage = submission.current_stage
    if (submission.funding_type) doc.fundingType = submission.funding_type
    if (submission.location_scope) doc.locationScope = submission.location_scope
    if (submission.badges?.length) doc.badges = submission.badges
    const careerAreas = await resolveCareerAreaRefs(submission)
    if (careerAreas.length) doc.careerAreas = careerAreas

    const result = await sanityMutate([{ create: doc }])
    return result.ok ? { id: docId } : null
  }

  if (sourceKind === "professionalOrganization" && submission.destination !== "teacher_portal") {
    const doc: Record<string, unknown> = {
      _id: docId,
      _type: "professionalOrganization",
      name: submission.name
    }
    if (submission.link) doc.link = submission.link
    if (submission.institution) doc.institution = submission.institution
    if (submission.description) doc.description = localizedText(submission.description)
    if (submission.location_scope) doc.geographicFocus = submission.location_scope
    const details = detailsOf(submission)
    if (details.membershipType?.length) doc.membershipType = details.membershipType
    const careerAreas = await resolveCareerAreaRefs(submission)
    if (careerAreas.length) doc.careerAreas = careerAreas

    const result = await sanityMutate([{ create: doc }])
    return result.ok ? { id: docId } : null
  }

  const details = detailsOf(submission)
  const kind = submitKindForSlug(submission.resource_type_slug)
  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "resource",
    title: localizedString(submission.name),
    published: true
  }
  if (resourceType?._id) {
    doc.resourceType = { _type: "reference", _ref: resourceType._id }
  }
  if (submission.summary) doc.summary = localizedString(submission.summary)
  if (submission.description) doc.description = localizedText(submission.description)
  if (submission.institution) doc.institution = submission.institution
  if (kind !== "educational" && submission.eligibility) doc.eligibility = localizedText(submission.eligibility)
  if (submission.region) doc.region = submission.region
  if (kind !== "educational" && submission.deadline) doc.deadline = submission.deadline
  if (submission.link) doc.link = submission.link
  if (submission.file_url) doc.fileUrl = submission.file_url
  if (details.fileLabel) doc.fileLabel = details.fileLabel
  if (details.experienceKind || (kind === "internship" && submission.funding_type)) {
    doc.experienceKind = details.experienceKind || submission.funding_type
  }
  if (details.compensation) doc.compensation = details.compensation
  if (details.audienceLevel?.length) doc.audienceLevel = details.audienceLevel
  if (details.setting) doc.setting = details.setting
  if (details.duration) doc.duration = details.duration
  if (details.opportunityKind || (kind === "grant" && submission.funding_type)) {
    doc.opportunityKind = details.opportunityKind || submission.funding_type
  }
  if (details.applicantType?.length) doc.applicantType = details.applicantType
  if (details.fundingAmount) doc.fundingAmount = details.fundingAmount
  if (details.materialKind || (kind === "educational" && submission.funding_type)) {
    doc.materialKind = details.materialKind || submission.funding_type
  }
  if (details.gradeBands?.length) doc.gradeBands = details.gradeBands
  if (details.topicFocus) doc.topicFocus = details.topicFocus
  if (details.format) doc.format = details.format
  if (submission.location_scope) doc.locationScope = submission.location_scope
  const careerAreas = await resolveCareerAreaRefs(submission)
  if (careerAreas.length) doc.careerAreas = careerAreas
  if (details.tags?.length) doc.tags = details.tags

  const result = await sanityMutate([{ create: doc }])
  return result.ok ? { id: docId } : null
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  if (!authorizePortal(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401, CORS)
  }

  let payload: ReviewPayload
  try {
    payload = (await request.json()) as ReviewPayload
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, CORS)
  }

  if (!payload.id) {
    return jsonResponse({ error: "id is required" }, 400, CORS)
  }

  if (!payload.action || !["approve", "decline"].includes(payload.action)) {
    return jsonResponse({ error: "action must be 'approve' or 'decline'" }, 400, CORS)
  }

  const existing = await fetchResourceSubmission(payload.id)
  if (!existing) {
    return jsonResponse({ error: "Submission not found" }, 404, CORS)
  }

  if (payload.action === "decline") {
    const updated = await patchResourceSubmission(
      existing.table,
      payload.id,
      { status: "declined", reviewed_at: new Date().toISOString() },
      "&status=eq.pending"
    )
    if (updated.length === 0) {
      return jsonResponse({ error: `Submission already ${existing.row.status}` }, 409, CORS)
    }
    return jsonResponse({ success: true, message: "Submission declined" }, 200, CORS)
  }

  const claimed = await patchResourceSubmission(
    existing.table,
    payload.id,
    { status: "approved", reviewed_at: new Date().toISOString() },
    "&status=eq.pending"
  )

  if (claimed.length === 0) {
    return jsonResponse({ error: `Submission already ${existing.row.status}` }, 409, CORS)
  }

  const submission = claimed[0]
  const sanityResult = await createSanityDocument(submission)
  if (!sanityResult) {
    await patchResourceSubmission(existing.table, payload.id, {
      status: "pending",
      reviewed_at: null
    })
    return jsonResponse({ error: "Failed to create document in Sanity" }, 502, CORS)
  }

  await patchResourceSubmission(existing.table, payload.id, {
    sanity_document_id: sanityResult.id
  })

  return jsonResponse(
    {
      success: true,
      message: "Submission approved and added to Sanity",
      sanity_document_id: sanityResult.id
    },
    200,
    CORS
  )
}
