export const config = { runtime: "edge" }

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (request.method !== "GET") {
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

  const url = new URL(request.url)
  const statusFilter = url.searchParams.get("status")

  let endpoint = `${supabaseUrl}/rest/v1/scholarship_submissions?order=submitted_at.desc`

  if (statusFilter && ["pending", "approved", "declined"].includes(statusFilter)) {
    endpoint += `&status=eq.${statusFilter}`
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("Supabase select error:", text)
    return json({ error: "Failed to fetch submissions" }, 502)
  }

  const data = await response.json()
  return json(data, 200)
}
