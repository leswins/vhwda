export const config = { runtime: "edge" }

import { corsHeaders, jsonResponse, sanityQuery } from "../server/cms"
import { fetchTeacherProfile, getAuthUser, getBearerToken } from "../server/teacher"
import { supabaseRest } from "../server/cms"

const CORS = corsHeaders("POST, OPTIONS", "Authorization")

type DownloadPayload = {
  resource_id?: string
}

type ResourceFile = {
  _id: string
  title?: { en?: string }
  fileLabel?: string
  fileUrl?: string
  file?: { url?: string; originalFilename?: string }
  resourceType?: { slug?: string; title?: { en?: string }; audience?: string }
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  const token = getBearerToken(request)
  const user = token ? await getAuthUser(token) : null
  if (!user) {
    return jsonResponse({ error: "Unauthorized" }, 401, CORS)
  }

  const profile = await fetchTeacherProfile(user.id)
  if (!profile?.onboarding_completed_at) {
    return jsonResponse({ error: "Complete your teacher profile before downloading" }, 403, CORS)
  }

  let payload: DownloadPayload
  try {
    payload = (await request.json()) as DownloadPayload
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, CORS)
  }

  if (!payload.resource_id) {
    return jsonResponse({ error: "resource_id is required" }, 400, CORS)
  }

  const resource = await sanityQuery<ResourceFile>(
    `*[_type == "resource" && _id == $id && published != false][0]{
      _id,
      title,
      fileLabel,
      fileUrl,
      "file": file.asset->{ url, originalFilename },
      resourceType->{ slug, title, audience }
    }`,
    { id: payload.resource_id }
  )

  if (!resource?._id) {
    return jsonResponse({ error: "Resource not found" }, 404, CORS)
  }

  const audience = resource.resourceType?.audience
  if (audience && audience !== "teacherPortal" && audience !== "both") {
    return jsonResponse({ error: "This resource is not available in the teacher library" }, 403, CORS)
  }

  const url = resource.file?.url || resource.fileUrl
  if (!url) {
    return jsonResponse({ error: "No downloadable file is attached to this resource" }, 404, CORS)
  }

  await supabaseRest("teacher_downloads", {
    method: "POST",
    body: {
      teacher_id: profile.id,
      teacher_email: profile.email,
      teacher_name: profile.full_name,
      school_name: profile.school_name,
      resource_id: resource._id,
      resource_title: resource.title?.en || resource.fileLabel || resource._id,
      resource_type_slug: resource.resourceType?.slug || "teacher-materials"
    }
  })

  return jsonResponse(
    {
      url,
      filename: resource.file?.originalFilename || resource.fileLabel || "resource",
      title: resource.title?.en
    },
    200,
    CORS
  )
}
