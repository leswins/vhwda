type Language = "en" | "es"

type QuizResultsEmailCareer = {
  id: string
  title: string
  careerPath?: string
  matchPercentage: number
  typicalSalary?: string
  salaryRange?: string
  educationLabel?: string
}

type QuizResultsEmailPayload = {
  language: Language
  topMatches: QuizResultsEmailCareer[]
  otherMatches: QuizResultsEmailCareer[]
  generatedAt: string
}

type QuizResultsEmailRequest = {
  email: string
  results: QuizResultsEmailPayload
}

function isValidEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const STRINGS = {
  en: {
    subject: "Your VHWDA Career Quiz Results",
    intro: "Thanks for taking the VHWDA Career Discovery Quiz. Here's a summary of your top career matches.",
    explore: "Continue exploring careers on the VHWDA Health Careers Catalog.",
    topMatches: "Your Top Matches",
    otherMatches: "Other Strong Matches",
    match: "Match",
    typicalSalary: "Typical Salary",
    education: "Education",
    viewCareer: "View career details",
    generated: "Generated",
  },
  es: {
    subject: "Sus Resultados del Cuestionario de Carreras de VHWDA",
    intro: "Gracias por completar el Cuestionario de Descubrimiento de Carreras de VHWDA. Aquí tiene un resumen de sus principales coincidencias de carrera.",
    explore: "Continúe explorando carreras en el Catálogo de Carreras de Salud de VHWDA.",
    topMatches: "Sus Mejores Coincidencias",
    otherMatches: "Otras Coincidencias Fuertes",
    match: "Coincidencia",
    typicalSalary: "Salario Típico",
    education: "Educación",
    viewCareer: "Ver detalles de la carrera",
    generated: "Generado",
  },
}

function s(language: Language, key: keyof typeof STRINGS["en"]): string {
  return STRINGS[language]?.[key] ?? STRINGS["en"][key]
}

export const config = { runtime: "nodejs", maxDuration: 15 }

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "es"
}

function isCareer(value: unknown): value is QuizResultsEmailCareer {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.matchPercentage === "number" &&
    (value.careerPath === undefined || typeof value.careerPath === "string") &&
    (value.typicalSalary === undefined || typeof value.typicalSalary === "string") &&
    (value.salaryRange === undefined || typeof value.salaryRange === "string") &&
    (value.educationLabel === undefined || typeof value.educationLabel === "string")
  )
}

function isResultsPayload(value: unknown): value is QuizResultsEmailPayload {
  return (
    isRecord(value) &&
    isLanguage(value.language) &&
    typeof value.generatedAt === "string" &&
    Array.isArray(value.topMatches) &&
    Array.isArray(value.otherMatches) &&
    value.topMatches.every(isCareer) &&
    value.otherMatches.every(isCareer)
  )
}

function getRequestOrigin(request: Request): string {
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host")
  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`
  }
  return new URL(request.url).origin
}

function getCareerUrl(origin: string, careerPath?: string): string | undefined {
  if (!careerPath) return undefined
  try {
    return new URL(careerPath, origin).toString()
  } catch {
    return undefined
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatDate(language: Language, value: string): string {
  try {
    return new Intl.DateTimeFormat(language === "es" ? "es-US" : "en-US", {
      dateStyle: "medium",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function careerRow(career: QuizResultsEmailCareer, language: Language, origin: string): string {
  const careerUrl = getCareerUrl(origin, career.careerPath)
  const title = escapeHtml(career.title)
  const titleHtml = careerUrl
    ? `<a href="${escapeHtml(careerUrl)}" style="color:#111111;text-decoration:none;font-weight:700;font-size:16px;">${title}</a>`
    : `<span style="font-weight:700;font-size:16px;">${title}</span>`

  const meta = [
    career.typicalSalary ? `${escapeHtml(s(language, "typicalSalary"))}: <strong>${escapeHtml(career.typicalSalary)}</strong>` : "",
    career.educationLabel ? `${escapeHtml(s(language, "education"))}: ${escapeHtml(career.educationLabel)}` : "",
  ].filter(Boolean).join("&nbsp;&nbsp;·&nbsp;&nbsp;")

  const viewLink = careerUrl
    ? `<a href="${escapeHtml(careerUrl)}" style="display:inline-block;margin-top:6px;font-size:12px;color:#0f6b94;text-decoration:underline;">${escapeHtml(s(language, "viewCareer"))} →</a>`
    : ""

  return `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:56px;vertical-align:top;padding-right:16px;">
              <div style="width:56px;height:56px;background:#1a9ab9;display:flex;align-items:center;justify-content:center;text-align:center;">
                <span style="color:#ffffff;font-size:13px;font-weight:700;line-height:1;">${career.matchPercentage}%<br/><span style="font-size:10px;letter-spacing:0.05em;">MATCH</span></span>
              </div>
            </td>
            <td style="vertical-align:top;">
              ${titleHtml}
              ${meta ? `<div style="margin-top:4px;font-size:13px;color:#555555;">${meta}</div>` : ""}
              ${viewLink}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

function createEmailHtml(results: QuizResultsEmailPayload, origin: string): string {
  const lang = results.language
  const topRows = results.topMatches.map((c) => careerRow(c, lang, origin)).join("")
  const otherRows = results.otherMatches.map((c) => careerRow(c, lang, origin)).join("")

  const otherSection = results.otherMatches.length > 0 ? `
    <tr><td style="padding-top:32px;padding-bottom:8px;">
      <h2 style="margin:0;font-size:18px;font-weight:700;color:#111111;">${escapeHtml(s(lang, "otherMatches"))}</h2>
    </td></tr>
    ${otherRows}
  ` : ""

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;">

        <!-- Header -->
        <tr><td style="background:#111111;padding:24px 32px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#aaaaaa;">VHWDA Health Careers Catalog</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;">${escapeHtml(s(lang, "subject"))}</h1>
          <p style="margin:6px 0 0;font-size:12px;color:#aaaaaa;">${escapeHtml(s(lang, "generated"))}: ${escapeHtml(formatDate(lang, results.generatedAt))}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">${escapeHtml(s(lang, "intro"))}</p>

          <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111111;">${escapeHtml(s(lang, "topMatches"))}</h2>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${topRows}
          </table>

          ${otherSection}

          <p style="margin:32px 0 0;font-size:13px;color:#777777;">${escapeHtml(s(lang, "explore"))}</p>
          <p style="margin:8px 0 0;"><a href="${escapeHtml(origin)}" style="color:#0f6b94;font-size:13px;">${escapeHtml(origin)}</a></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f0f0f0;padding:16px 32px;border-top:1px solid #e5e5e5;">
          <p style="margin:0;font-size:11px;color:#999999;">Virginia Health Workforce Development Authority · 7818 E. Parham Road, Richmond, VA 23294</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.QUIZ_RESULTS_EMAIL_FROM

  if (!resendApiKey || !fromAddress) {
    console.error("[quiz-results-email] missing env vars")
    return json({ error: "Server configuration error" }, 500)
  }

  let payload: QuizResultsEmailRequest
  try {
    const body = (await request.json()) as unknown
    if (!isRecord(body) || typeof body.email !== "string" || !isResultsPayload(body.results)) {
      return json({ error: "Validation failed" }, 400)
    }
    payload = { email: body.email.trim(), results: body.results }
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  if (!isValidEmailAddress(payload.email)) {
    return json({ error: "Validation failed" }, 400)
  }

  if (payload.results.topMatches.length === 0) {
    return json({ error: "Validation failed" }, 400)
  }

  const origin = getRequestOrigin(request)

  try {
    console.log("[quiz-results-email] sending to:", payload.email)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)

    let resendResponse: Response
    try {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [payload.email],
          subject: s(payload.results.language, "subject"),
          html: createEmailHtml(payload.results, origin),
        }),
      })
    } finally {
      clearTimeout(timeoutId)
    }

    const responseBody = await resendResponse.json() as Record<string, unknown>

    if (!resendResponse.ok) {
      console.error("[quiz-results-email] Resend API error:", resendResponse.status, JSON.stringify(responseBody))
      return json({ error: "Failed to send email" }, 502)
    }

    console.log("[quiz-results-email] sent, id:", responseBody.id)
    return json({ success: true }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[quiz-results-email] unexpected error:", message)
    return json({ error: "Failed to send email" }, 502)
  }
}
