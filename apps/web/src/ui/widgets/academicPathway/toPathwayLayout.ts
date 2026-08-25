import type { Language } from "../../../utils/i18n"
import {
  getLocalizedString,
  isPathwayChoice,
  type AcademicPathwayItem,
  type PathwayKind,
  type PathwayRequirement,
  type PathwayStep
} from "../../../sanity/queries/careers"
import type { PathwayRow, PathwayTone, ResolvedStep } from "./types"

function resolveStep(
  step: PathwayStep,
  language: Language,
  fallbackKey: string,
  defaultTone: PathwayTone
): ResolvedStep | null {
  const title = getLocalizedString(language, step.title)?.trim()
  if (!title) return null

  const requirement: PathwayRequirement = step.requirement ?? "required"
  const kind: PathwayKind = step.kind ?? "other"
  const tone: PathwayTone =
    defaultTone === "choice"
      ? "choice"
      : requirement === "optional" || requirement === "recommended"
        ? "optional"
        : "required"

  const description = getLocalizedString(language, step.description)?.trim()

  return {
    key: step._key ?? fallbackKey,
    title,
    description: description || undefined,
    kind,
    requirement,
    organization: step.organization?.trim() || undefined,
    tone
  }
}

export function toPathwayLayout(items: AcademicPathwayItem[] | undefined, language: Language): PathwayRow[] {
  if (!items?.length) return []

  const rows: PathwayRow[] = []

  items.forEach((item, index) => {
    if (isPathwayChoice(item)) {
      const options = (item.options ?? [])
        .map((option, optionIndex) =>
          resolveStep(option, language, `${item._key ?? `choice-${index}`}-option-${optionIndex}`, "choice")
        )
        .filter((option): option is ResolvedStep => Boolean(option))

      if (options.length >= 2) {
        rows.push({
          type: "choice",
          key: item._key ?? `choice-${index}`,
          label: getLocalizedString(language, item.label)?.trim() ?? "",
          options
        })
        return
      }

      if (options.length === 1) {
        const [only] = options
        rows.push({
          type: "step",
          step: {
            ...only,
            tone: only.requirement === "optional" || only.requirement === "recommended" ? "optional" : "required"
          }
        })
      }
      return
    }

    const step = resolveStep(item, language, item._key ?? `step-${index}`, "required")
    if (step) rows.push({ type: "step", step })
  })

  if (!rows.length) return rows

  const first = rows[0]
  const last = rows[rows.length - 1]
  if (first.type === "step" && first.step.requirement === "required") {
    first.step.tone = "startEnd"
  }
  if (last.type === "step" && last.step.requirement === "required") {
    last.step.tone = "startEnd"
  }

  return rows
}
