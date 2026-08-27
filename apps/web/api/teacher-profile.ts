export const config = { runtime: "edge" }

import { corsHeaders, jsonResponse } from "../server/cms"
import {
  fetchTeacherProfile,
  getAuthUser,
  getBearerToken,
  upsertTeacherProfile,
  type TeacherProfile
} from "../server/teacher"

const CORS = corsHeaders("GET, PUT, OPTIONS", "Authorization")

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  const token = getBearerToken(request)
  const user = token ? await getAuthUser(token) : null
  if (!user) {
    return jsonResponse({ error: "Unauthorized" }, 401, CORS)
  }

  if (request.method === "GET") {
    const profile = await fetchTeacherProfile(user.id)
    return jsonResponse({ user, profile }, 200, CORS)
  }

  if (request.method !== "PUT") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  let payload: Partial<TeacherProfile>
  try {
    payload = (await request.json()) as Partial<TeacherProfile>
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, CORS)
  }

  const fullName = payload.full_name?.trim() || ""
  const schoolName = payload.school_name?.trim() || ""
  const purpose = payload.purpose?.trim() || ""
  if (!fullName || !schoolName || !purpose) {
    return jsonResponse({ error: "full_name, school_name, and purpose are required" }, 400, CORS)
  }

  const profile = await upsertTeacherProfile({
    id: user.id,
    email: user.email || payload.email || "",
    full_name: fullName,
    school_name: schoolName,
    school_district: payload.school_district?.trim() || null,
    role: payload.role?.trim() || null,
    purpose,
    grade_levels: payload.grade_levels?.trim() || null,
    onboarding_completed_at: new Date().toISOString()
  })

  if (!profile) {
    return jsonResponse({ error: "Failed to save profile" }, 502, CORS)
  }

  return jsonResponse({ user, profile }, 200, CORS)
}
