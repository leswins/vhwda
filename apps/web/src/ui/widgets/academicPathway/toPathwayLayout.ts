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

function isOptionalRequirement(requirement: PathwayRequirement): boolean {
  return requirement === "optional" || requirement === "recommended"
}

function rowHasOptionalStep(row: PathwayRow): boolean {
  if (row.type === "step") return isOptionalRequirement(row.step.requirement)
  return row.options.some((option) => isOptionalRequirement(option.requirement))
}

function applyNeutralTonesWhenAllRequired(rows: PathwayRow[]): void {
  const hasOptionalSteps = rows.some(rowHasOptionalStep)
  if (hasOptionalSteps) return

  for (const row of rows) {
    if (row.type === "step" && row.step.tone === "required") {
      row.step.tone = "neutral"
    }
  }
}

export function getPathwayLayoutMeta(rows: PathwayRow[]) {
  const hasChoice = rows.some((row) => row.type === "choice")
  const hasOptionalSteps = rows.some(rowHasOptionalStep)
  const showLegend = hasOptionalSteps || hasChoice
  return { hasChoice, hasOptionalSteps, showLegend }
}

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
      : isOptionalRequirement(requirement)
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
            tone: isOptionalRequirement(only.requirement) ? "optional" : "required"
          }
        })
      }
      return
    }

    const step = resolveStep(item, language, item._key ?? `step-${index}`, "required")
    if (step) rows.push({ type: "step", step })
  })

  applyNeutralTonesWhenAllRequired(rows)

  return rows
}
