export const config = { runtime: "edge" }

import { corsHeaders, getSupabaseConfig, jsonResponse } from "../server/cms"

const CORS = corsHeaders("GET, OPTIONS")

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  const { supabaseUrl, anonKey } = getSupabaseConfig()
  const googleAuthEnabled = process.env.TEACHER_GOOGLE_AUTH === "true"
  if (!supabaseUrl || !anonKey) {
    return jsonResponse({ configured: false, googleAuthEnabled }, 200, CORS)
  }

  return jsonResponse(
    {
      configured: true,
      googleAuthEnabled,
      supabaseUrl,
      anonKey
    },
    200,
    CORS
  )
}
