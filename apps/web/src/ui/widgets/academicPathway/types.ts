import type { PathwayKind, PathwayRequirement } from "../../../sanity/queries/careers"

export type PathwayTone = "startEnd" | "required" | "optional" | "choice"

export type ResolvedStep = {
  key: string
  title: string
  description?: string
  kind: PathwayKind
  requirement: PathwayRequirement
  organization?: string
  tone: PathwayTone
}

export type PathwayRow =
  | { type: "step"; step: ResolvedStep }
  | { type: "choice"; key: string; label: string; options: ResolvedStep[] }
