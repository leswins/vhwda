import React from "react"
import type { PathwayTone, ResolvedStep } from "./types"

const TONE_CLASS: Record<PathwayTone, string> = {
  startEnd: "border-solid border-foreground bg-surface",
  required: "border-solid border-foreground bg-accentBlue/25",
  optional: "border-dashed border-foreground/70 bg-surface2",
  choice: "border-solid border-foreground bg-accentGreen/25"
}

type PathwayNodeProps = {
  step: ResolvedStep
}

export function PathwayNode({ step }: PathwayNodeProps) {
  return (
    <div
      className={`w-full max-w-sm rounded-none border px-fluid-20 py-[calc(var(--space-15)+10px)] text-center ${TONE_CLASS[step.tone]}`}
    >
      <div className="text-h5 text-foreground">{step.title}</div>
      {step.description ? (
        <div className="mt-[calc(var(--space-5)+5px)] text-body-sm text-muted">{step.description}</div>
      ) : null}
    </div>
  )
}
