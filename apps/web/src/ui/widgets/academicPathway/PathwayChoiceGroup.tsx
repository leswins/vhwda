import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import { PathwayNode } from "./PathwayNode"
import { ForkConnector, MergeConnector } from "./PathwayConnectors"
import type { PathwayRow } from "./types"

type PathwayChoiceGroupProps = {
  row: Extract<PathwayRow, { type: "choice" }>
  language: Language
  connectToNext?: boolean
}

export function PathwayChoiceGroup({
  row,
  language,
  connectToNext = true
}: PathwayChoiceGroupProps) {
  const label = row.label || t(language, "career.pathway.chooseOne")

  return (
    <div role="group" aria-label={label} className="w-full max-w-3xl">
      <p className="mb-fluid-5 text-center text-body-sm text-muted">{label}</p>
      <ForkConnector columns={row.options.length} />
      <ul className="flex list-none flex-col items-stretch gap-fluid-15 border border-dashed border-foreground/40 px-fluid-15 py-fluid-15 lg:flex-row lg:items-stretch lg:justify-center lg:gap-fluid-30 lg:border-0 lg:p-0" role="list">
        {row.options.map((option, index) => (
          <li key={option.key} className="flex min-w-0 flex-1 flex-col items-center">
            {index > 0 ? (
              <span className="mb-fluid-10 text-body-sm text-muted lg:hidden">
                {t(language, "career.pathway.or")}
              </span>
            ) : null}
            <PathwayNode step={option} />
          </li>
        ))}
      </ul>
      <MergeConnector columns={row.options.length} connected={connectToNext} />
    </div>
  )
}
