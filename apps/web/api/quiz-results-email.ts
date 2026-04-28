import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { Resend } from "resend"
import { t, type Language } from "../src/utils/i18n"
import {
  isValidEmailAddress,
  type QuizResultsEmailCareer,
  type QuizResultsEmailPayload,
  type QuizResultsEmailRequest,
} from "../src/ui/widgets/quiz/quizResultsEmail"

export const config = { runtime: "nodejs" }

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
  const url = new URL(request.url)
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host")

  if (forwardedHost) {
    return `${forwardedProto || url.protocol.replace(":", "")}://${forwardedHost}`
  }

  return url.origin
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

function formatGeneratedAt(language: Language, value: string): string {
  try {
    return new Intl.DateTimeFormat(language === "es" ? "es-US" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)

  if (words.length === 0) return [""]

  const lines: string[] = []
  let currentLine = words[0]

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`
    if (font.widthOfTextAtSize(nextLine, size) <= maxWidth) {
      currentLine = nextLine
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }

  lines.push(currentLine)
  return lines
}

async function createQuizResultsPdf(results: QuizResultsEmailPayload, origin: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [612, 792]
  const margin = 50
  const contentWidth = pageSize[0] - margin * 2
  const lineGap = 6
  const bodyColor = rgb(0.1, 0.1, 0.1)
  const mutedColor = rgb(0.33, 0.33, 0.33)
  const accentColor = rgb(0.09, 0.54, 0.76)

  let page = pdf.addPage(pageSize)
  let y = page.getHeight() - margin

  function addPage() {
    page = pdf.addPage(pageSize)
    y = page.getHeight() - margin
  }

  function ensureSpace(lines = 1, fontSize = 12) {
    const neededHeight = lines * (fontSize + lineGap)
    if (y - neededHeight < margin) {
      addPage()
    }
  }

  function drawWrapped(
    text: string,
    options: {
      font: PDFFont
      size: number
      color?: ReturnType<typeof rgb>
      indent?: number
    }
  ) {
    const { font, size, color = bodyColor, indent = 0 } = options
    const lines = wrapText(text, font, size, contentWidth - indent)

    for (const line of lines) {
      ensureSpace(1, size)
      page.drawText(line, {
        x: margin + indent,
        y,
        size,
        font,
        color,
      })
      y -= size + lineGap
    }
  }

  function drawCareer(career: QuizResultsEmailCareer, index: number) {
    drawWrapped(`${index + 1}. ${career.title}`, { font: boldFont, size: 16 })
    drawWrapped(`${t(results.language, "quiz.results.email.pdf.match")}: ${career.matchPercentage}%`, { font: regularFont, size: 12, color: mutedColor, indent: 12 })

    if (career.typicalSalary) {
      drawWrapped(
        `${t(results.language, "quiz.results.email.pdf.typicalSalary")}: ${career.typicalSalary}`,
        { font: regularFont, size: 12, color: mutedColor, indent: 12 }
      )
    }

    if (career.educationLabel) {
      drawWrapped(
        `${t(results.language, "quiz.results.email.pdf.education")}: ${career.educationLabel}`,
        { font: regularFont, size: 12, color: mutedColor, indent: 12 }
      )
    }

    if (career.salaryRange) {
      drawWrapped(
        `${t(results.language, "quiz.results.email.pdf.salaryRange")}: ${career.salaryRange}`,
        { font: regularFont, size: 12, color: mutedColor, indent: 12 }
      )
    }

    const careerUrl = getCareerUrl(origin, career.careerPath)
    if (careerUrl) {
      drawWrapped(`${t(results.language, "quiz.results.email.pdf.viewCareer")}: ${careerUrl}`, {
        font: regularFont,
        size: 11,
        color: accentColor,
        indent: 12,
      })
    }

    y -= 8
  }

  drawWrapped(t(results.language, "quiz.results.email.pdf.title"), { font: boldFont, size: 22 })
  drawWrapped(`${t(results.language, "quiz.results.email.pdf.generated")}: ${formatGeneratedAt(results.language, results.generatedAt)}`, {
    font: regularFont,
    size: 11,
    color: mutedColor,
  })
  y -= 12

  drawWrapped(t(results.language, "quiz.results.topMatches"), { font: boldFont, size: 18 })
  y -= 4
  results.topMatches.forEach((career, index) => drawCareer(career, index))

  if (results.otherMatches.length > 0) {
    y -= 8
    drawWrapped(t(results.language, "quiz.results.otherMatches"), { font: boldFont, size: 18 })
    y -= 4
    results.otherMatches.forEach((career, index) => drawCareer(career, index))
  }

  return pdf.save()
}

function createEmailHtml(results: QuizResultsEmailPayload, origin: string): string {
  const topMatches = results.topMatches
    .map((career) => {
      const careerUrl = getCareerUrl(origin, career.careerPath)
      const title = escapeHtml(career.title)
      const details = [
        `${t(results.language, "quiz.results.email.pdf.match")}: ${career.matchPercentage}%`,
        career.typicalSalary ? `${t(results.language, "quiz.results.email.pdf.typicalSalary")}: ${career.typicalSalary}` : "",
      ]
        .filter(Boolean)
        .join(" | ")

      if (careerUrl) {
        return `<li style="margin-bottom:12px;"><a href="${escapeHtml(careerUrl)}" style="color:#0f6b94;text-decoration:underline;">${title}</a><br /><span style="color:#555555;">${escapeHtml(details)}</span></li>`
      }

      return `<li style="margin-bottom:12px;"><strong>${title}</strong><br /><span style="color:#555555;">${escapeHtml(details)}</span></li>`
    })
    .join("")

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111111;line-height:1.5;">
      <h1 style="font-size:24px;margin-bottom:16px;">${escapeHtml(t(results.language, "quiz.results.email.subject"))}</h1>
      <p>${escapeHtml(t(results.language, "quiz.results.email.bodyIntro"))}</p>
      <p>${escapeHtml(t(results.language, "quiz.results.email.bodyAttachment"))}</p>
      <h2 style="font-size:18px;margin-top:24px;">${escapeHtml(t(results.language, "quiz.results.topMatches"))}</h2>
      <ul style="padding-left:20px;">${topMatches}</ul>
      <p>${escapeHtml(t(results.language, "quiz.results.email.bodyExplore"))}</p>
      <p><a href="${escapeHtml(origin)}" style="color:#0f6b94;text-decoration:underline;">${escapeHtml(origin)}</a></p>
    </div>
  `
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
    return json({ error: "Server configuration error" }, 500)
  }

  let payload: QuizResultsEmailRequest

  try {
    const body = (await request.json()) as unknown

    if (!isRecord(body) || typeof body.email !== "string" || !isResultsPayload(body.results)) {
      return json({ error: "Validation failed" }, 400)
    }

    payload = {
      email: body.email.trim(),
      results: body.results,
    }
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
  const resend = new Resend(resendApiKey)
  const pdfBytes = await createQuizResultsPdf(payload.results, origin)

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: [payload.email],
    subject: t(payload.results.language, "quiz.results.email.subject"),
    html: createEmailHtml(payload.results, origin),
    attachments: [
      {
        filename: "vhwda-quiz-results.pdf",
        content: Buffer.from(pdfBytes),
      },
    ],
  })

  if (error) {
    console.error("Resend send error:", error)
    return json({ error: "Failed to send email" }, 502)
  }

  return json({ success: true }, 200)
}
