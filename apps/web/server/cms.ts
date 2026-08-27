export function jsonResponse(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders
    }
  })
}

export function corsHeaders(methods: string, extra = "") {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": extra
      ? `Content-Type, ${extra}`
      : "Content-Type"
  }
  return headers
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  return { supabaseUrl, serviceKey, anonKey }
}

export function getSanityWriteConfig() {
  return {
    projectId: process.env.SANITY_PROJECT_ID || "j0yc55ca",
    dataset: process.env.SANITY_DATASET || "production",
    token: process.env.SANITY_API_TOKEN
  }
}

export function authorizePortal(request: Request): boolean {
  const password = request.headers.get("x-portal-password")
  const expected = process.env.SCHOLARSHIP_PORTAL_PASSWORD
  if (!expected) return false
  return password === expected
}

export async function supabaseRest<T>(
  pathAndQuery: string,
  init: {
    method?: string
    body?: unknown
    headers?: Record<string, string>
  } = {}
): Promise<{ ok: boolean; status: number; data: T | null; text: string }> {
  const { supabaseUrl, serviceKey } = getSupabaseConfig()
  if (!supabaseUrl || !serviceKey) {
    return { ok: false, status: 500, data: null, text: "Supabase is not configured" }
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${pathAndQuery}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...init.headers
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body)
  })

  const text = await response.text()
  let data: T | null = null
  if (text) {
    try {
      data = JSON.parse(text) as T
    } catch {
      data = null
    }
  }

  return { ok: response.ok, status: response.status, data, text }
}

export async function sanityMutate(mutations: unknown[]) {
  const { projectId, dataset, token } = getSanityWriteConfig()
  if (!token) return { ok: false, text: "Missing SANITY_API_TOKEN" }

  const response = await fetch(`https://${projectId}.api.sanity.io/v2025-11-01/data/mutate/${dataset}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mutations })
  })

  const text = await response.text()
  return { ok: response.ok, text }
}

export async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  const { projectId, dataset, token } = getSanityWriteConfig()
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-11-01/data/query/${dataset}`)
  url.searchParams.set("query", query)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  const headers: Record<string, string> = { Accept: "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(url.toString(), { headers })
  if (!response.ok) return null
  const payload = (await response.json()) as { result?: T }
  return payload.result ?? null
}

export function toPortableText(text: string) {
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

export function localizedString(en: string) {
  return { _type: "localizedString", en }
}

export function localizedText(en: string) {
  return { _type: "localizedText", en }
}
