export const config = { runtime: "edge" }

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

const MODEL = "gemini-2.0-flash-lite"
const MAX_MESSAGE_CHARS = 4_000
const MAX_HISTORY_MESSAGES = 24
const MAX_HISTORY_PART_CHARS = 8_000
const MAX_SYSTEM_CONTEXT_CHARS = 120_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20
const GEMINI_TIMEOUT_MS = 25_000

type ChatTurn = {
  role: "user" | "model"
  parts: string
}

type GeminiPart = { text?: string }
type GeminiContent = { role?: string; parts?: GeminiPart[] }

const recentHits = new Map<string, number[]>()

function jsonResponse(body: unknown, status: number, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra }
  })
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip") || "unknown"
}

function allowRequest(ip: string) {
  const now = Date.now()
  const next = (recentHits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS)
  if (next.length >= RATE_LIMIT_MAX) {
    recentHits.set(ip, next)
    return false
  }
  next.push(now)
  recentHits.set(ip, next)
  return true
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeTurn(value: unknown): ChatTurn | null {
  if (!isRecord(value) || typeof value.parts !== "string") return null
  const role = value.role === "model" ? "model" : value.role === "user" ? "user" : null
  if (!role) return null
  const parts = value.parts.trim().slice(0, MAX_HISTORY_PART_CHARS)
  if (!parts) return null
  return { role, parts }
}

function getGeminiKey() {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ""
}

function extractText(payload: unknown): string {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) return ""
  const candidate = payload.candidates[0]
  if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
    return ""
  }
  return candidate.content.parts
    .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim()
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  if (!allowRequest(getClientIp(request))) {
    return jsonResponse({ error: "Too many requests. Please wait a moment and try again." }, 429, {
      "Retry-After": "60"
    })
  }

  const apiKey = getGeminiKey()
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not configured")
    return jsonResponse({ error: "Chat is not configured" }, 503)
  }

  let message: string
  let history: ChatTurn[] = []
  let systemContext = ""

  try {
    const body = (await request.json()) as unknown
    if (!isRecord(body) || typeof body.message !== "string") {
      return jsonResponse({ error: "Validation failed" }, 400)
    }
    message = body.message.trim().slice(0, MAX_MESSAGE_CHARS)
    if (!message) return jsonResponse({ error: "Validation failed" }, 400)

    if (typeof body.systemContext === "string") {
      systemContext = body.systemContext.trim().slice(0, MAX_SYSTEM_CONTEXT_CHARS)
    }

    if (Array.isArray(body.history)) {
      history = body.history
        .slice(-MAX_HISTORY_MESSAGES)
        .map(normalizeTurn)
        .filter((turn): turn is ChatTurn => Boolean(turn))
    }
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400)
  }

  while (history.length > 0 && history[history.length - 1].role === "user") {
    history.pop()
  }

  const contents: GeminiContent[] = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.parts }]
    })),
    { role: "user", parts: [{ text: message }] }
  ]

  const payload: Record<string, unknown> = { contents }
  if (systemContext) {
    payload.system_instruction = { parts: [{ text: systemContext }] }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      }
    )

    const geminiBody = (await geminiResponse.json().catch(() => null)) as unknown

    if (geminiResponse.status === 429) {
      return jsonResponse({ error: "Rate limit exceeded. Please wait a moment and try again." }, 429, {
        "Retry-After": "10"
      })
    }

    if (!geminiResponse.ok) {
      console.error("[chat] Gemini error:", geminiResponse.status)
      return jsonResponse({ error: "Failed to generate a response" }, 502)
    }

    const text = extractText(geminiBody)
    if (!text) {
      return jsonResponse({ error: "Failed to generate a response" }, 502)
    }

    return jsonResponse({ text }, 200)
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError"
    console.error("[chat] request failed:", aborted ? "timeout" : "network")
    return jsonResponse({ error: "Failed to generate a response" }, 502)
  } finally {
    clearTimeout(timeoutId)
  }
}
