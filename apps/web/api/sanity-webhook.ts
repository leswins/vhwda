type Language = "en" | "es"
type LocalizedString = { en?: string; es?: string }

type CareerWebhookPayload = {
  _id?: string
  _type?: string
  _originalId?: string
  title?: LocalizedString
}

const DEFAULT_LANGUAGE: Language = "en"

const dictionary: Record<string, { en: string; es: string }> = {
  "slack.fallback": { en: "New career added: {title}", es: "Nueva carrera agregada: {title}" },
  "slack.footer": { en: "New career added to VHWDA", es: "Nueva carrera agregada a VHWDA" },
  "slack.unknownTitle": { en: "Untitled career", es: "Carrera sin titulo" },
  "slack.viewInStudio": { en: "View in Sanity Studio", es: "Ver en Sanity Studio" },
  "response.methodNotAllowed": { en: "Method not allowed", es: "Metodo no permitido" },
  "response.badRequest": { en: "Invalid payload", es: "Carga invalida" },
  "response.missingWebhook": { en: "Missing Slack webhook URL", es: "Falta la URL de Slack webhook" },
  "response.ok": { en: "OK", es: "OK" },
  "response.skipped": { en: "Update event - skipped", es: "Evento de actualizacion - omitido" },
  "response.notCareer": { en: "Not a career payload", es: "No es payload de carrera" }
}

function t(key: string, language: Language, vars?: Record<string, string>) {
  const entry = dictionary[key] ?? { en: key, es: key }
  const template = entry[language] ?? entry.en

  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match)
}

function getStudioUrl(documentId?: string) {
  if (!documentId) return undefined
  const normalizedId = documentId.replace(/^drafts\./, "")
  return `https://careercatalog.sanity.studio/desk/career;${normalizedId}`
}

function getCareerTitle(payload: CareerWebhookPayload, language: Language) {
  return payload.title?.en ?? payload.title?.es ?? t("slack.unknownTitle", language)
}

export const config = { runtime: "edge" }

export default async function handler(request: Request) {
  const language = DEFAULT_LANGUAGE

  if (request.method !== "POST") {
    return new Response(t("response.methodNotAllowed", language), { status: 405 })
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return new Response(t("response.missingWebhook", language), { status: 500 })
  }

  let payload: CareerWebhookPayload

  try {
    payload = (await request.json()) as CareerWebhookPayload
  } catch {
    return new Response(t("response.badRequest", language), { status: 400 })
  }

  if (payload._type && payload._type !== "career") {
    return new Response(t("response.notCareer", language), { status: 200 })
  }

  const isCreate = !payload._originalId
  if (!isCreate) {
    return new Response(t("response.skipped", language), { status: 200 })
  }

  const title = getCareerTitle(payload, language)
  const studioUrl = getStudioUrl(payload._id)
  const fallbackText = t("slack.fallback", language, { title })
  const linkLine = studioUrl ? `<${studioUrl}|${t("slack.viewInStudio", language)}>` : ""
  const sectionText = linkLine ? `*${title}*\n${linkLine}` : `*${title}*`

  const slackPayload = {
    text: fallbackText,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: sectionText
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: t("slack.footer", language)
          }
        ]
      }
    ]
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackPayload)
  })

  if (!response.ok) {
    return new Response(response.statusText || t("response.badRequest", language), { status: 502 })
  }

  return new Response(t("response.ok", language), { status: 200 })
}
