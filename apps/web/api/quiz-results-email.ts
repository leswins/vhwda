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
    goToSite: "Go to site",
    retakeQuiz: "Take the quiz again",
    orgName: "Virginia Health Workforce Development Authority",
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
    goToSite: "Ir al sitio",
    retakeQuiz: "Volver a hacer el cuestionario",
    orgName: "Virginia Health Workforce Development Authority",
  },
}

function s(language: Language, key: keyof typeof STRINGS["en"]): string {
  return STRINGS[language]?.[key] ?? STRINGS["en"][key]
}

export const config = { runtime: "edge" }

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

const FONT = "Arial,Helvetica,sans-serif"

function careerRow(
  career: QuizResultsEmailCareer,
  language: Language,
  origin: string,
  badgeColor: string,
): string {
  const careerUrl = getCareerUrl(origin, career.careerPath)
  const title = escapeHtml(career.title)
  const salary = career.typicalSalary ?? career.salaryRange

  const viewLink = careerUrl
    ? `<a href="${escapeHtml(careerUrl)}" style="font-family:${FONT};font-size:16px;color:#14c6ed;text-decoration:underline;line-height:1.35;">${escapeHtml(s(language, "viewCareer"))} &#8594;</a>`
    : ""

  return `
    <tr>
      <td style="padding-bottom:30px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="100" height="100" style="width:100px;height:100px;min-width:100px;background-color:${badgeColor};text-align:center;vertical-align:middle;">
              <div style="font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#09090b;line-height:1.35;text-align:center;">
                ${career.matchPercentage}%<br>Match
              </div>
            </td>
            <td style="padding-left:30px;vertical-align:middle;">
              <div style="font-family:${FONT};font-size:22px;font-weight:700;color:#09090b;line-height:1.2;margin-bottom:10px;">${title}</div>
              ${salary ? `<div style="font-family:${FONT};font-size:16px;color:#71717a;line-height:1.35;margin-bottom:10px;">${escapeHtml(s(language, "typicalSalary"))}: ${escapeHtml(salary)}</div>` : ""}
              ${viewLink}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

function divider(): string {
  return `
    <tr>
      <td style="padding:20px 0 50px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="height:1px;background-color:#e4e4e7;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`
}

function createEmailHtml(results: QuizResultsEmailPayload, origin: string): string {
  const lang = results.language
  const topRows = results.topMatches.map((c) => careerRow(c, lang, origin, "#71e861")).join("")
  const otherRows = results.otherMatches.map((c) => careerRow(c, lang, origin, "#14c6ed")).join("")

  const otherSection = results.otherMatches.length > 0 ? `
    ${divider()}
    <tr>
      <td style="padding-bottom:30px;">
        <div style="font-family:${FONT};font-size:28px;font-weight:700;color:#09090b;line-height:1.2;">${escapeHtml(s(lang, "otherMatches"))}</div>
      </td>
    </tr>
    ${otherRows}
  ` : ""

  const quizUrl = `${origin}/quiz`

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;">

        <!-- Header -->
        <tr>
          <td style="background-color:#09090b;padding:30px;">
            <img src="${origin}/VHWDA%20HCC%20Logo.png" alt="VHWDA Health Careers Catalog" width="196" height="54" style="display:block;width:196px;height:54px;margin-bottom:20px;border:0;">
            <div style="font-family:${FONT};font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:10px;">${escapeHtml(s(lang, "subject"))}</div>
            <div style="font-family:${FONT};font-size:18px;color:#a1a1aa;line-height:1.35;">${escapeHtml(s(lang, "generated"))}: ${escapeHtml(formatDate(lang, results.generatedAt))}</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:50px 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">

              <!-- Intro -->
              <tr>
                <td style="padding-bottom:50px;">
                  <div style="font-family:${FONT};font-size:20px;color:#27272a;line-height:1.35;">${escapeHtml(s(lang, "intro"))}</div>
                </td>
              </tr>

              <!-- Top Matches heading -->
              <tr>
                <td style="padding-bottom:30px;">
                  <div style="font-family:${FONT};font-size:28px;font-weight:700;color:#09090b;line-height:1.2;">${escapeHtml(s(lang, "topMatches"))}</div>
                </td>
              </tr>

              <!-- Top match rows -->
              ${topRows}

              <!-- Other matches + divider -->
              ${otherSection}

              <!-- Divider before CTA -->
              ${divider()}

              <!-- CTA section -->
              <tr>
                <td style="padding-bottom:30px;">
                  <div style="font-family:${FONT};font-size:20px;color:#27272a;line-height:1.35;margin-bottom:20px;">${escapeHtml(s(lang, "explore"))}</div>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:20px;">
                        <a href="${escapeHtml(origin)}" style="display:inline-block;background-color:#09090b;color:#ffffff;font-family:${FONT};font-size:16px;font-weight:600;text-decoration:none;padding:10px 15px;line-height:1.35;">${escapeHtml(s(lang, "goToSite"))}</a>
                      </td>
                      <td>
                        <a href="${escapeHtml(quizUrl)}" style="display:inline-block;background-color:#f4f4f5;color:#09090b;font-family:${FONT};font-size:16px;font-weight:600;text-decoration:none;padding:10px 15px;line-height:1.35;">${escapeHtml(s(lang, "retakeQuiz"))}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#09090b;padding:30px;">
            <img src="${origin}/VHWDA%20HCC%20Logo.png" alt="VHWDA Health Careers Catalog" width="196" height="54" style="display:block;width:196px;height:54px;border:0;">
          </td>
        </tr>

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
