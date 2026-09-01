export const config = { runtime: "edge" }

import { authorizePortal, corsHeaders, jsonResponse, supabaseRest } from "../server/cms"

const CORS = corsHeaders("GET, OPTIONS", "x-portal-password")

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, CORS)
  }

  if (!authorizePortal(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401, CORS)
  }

  const url = new URL(request.url)
  const limit = Math.min(Number(url.searchParams.get("limit") || "200"), 500)

  const result = await supabaseRest<unknown[]>(
    `teacher_downloads?order=downloaded_at.desc&limit=${limit}`
  )

  if (!result.ok) {
    return jsonResponse({ downloads: [], configured: false }, 200, CORS)
  }

  return jsonResponse({ downloads: result.data ?? [], configured: true }, 200, CORS)
}
