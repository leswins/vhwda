import React from "react"
import { Link } from "react-router-dom"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  title: string
  salary?: string
  to: string
  imageUrl?: string
  showMatch?: boolean
  matchLabel?: string
}

export function CareerCard({ language, title, salary, to, imageUrl, showMatch, matchLabel }: Props) {
  return (
    <div className="w-[360px] shrink-0 border border-foreground bg-surface">
      <Link to={to} className="block">
        <div className="relative h-[283px] w-full overflow-hidden bg-surface2">
          {imageUrl ? <img alt="" src={imageUrl} className="h-full w-full object-cover" /> : null}

          {showMatch ? (
            <div className="absolute left-0 top-0 bg-accentGreen px-2.5 py-2">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground">{matchLabel}</div>
            </div>
          ) : null}
        </div>

        <div className="relative border-y border-foreground bg-surface1 px-5 py-5">
          <div className="absolute left-0 top-1/2 h-[69px] w-px -translate-y-1/2 bg-foreground" aria-hidden="true" />
          <div className="text-2xl font-bold leading-tight">{title}</div>
        </div>

        <div className="px-5">
          <div className="flex items-center justify-between py-5 text-sm font-bold text-onSurfaceSecondary">
            <span>{t(language, "careerCard.typicalVaSalary")}</span>
            <span>{salary ?? "—"}</span>
          </div>

          <div className="h-px w-full bg-foreground/20" />

          <div className="flex items-center justify-between py-5">
            <span className="text-sm text-muted">{t(language, "careerCard.learnMore")}</span>
            <span aria-hidden="true" className="text-xl text-foreground">
              →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

