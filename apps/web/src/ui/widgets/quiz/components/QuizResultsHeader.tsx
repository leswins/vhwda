import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import reloadIcon from "../shapes/reload.png"

type QuizResultsHeaderProps = {
  language: Language
  onStartOver: () => void
}

export function QuizResultsHeader({ language, onStartOver }: QuizResultsHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-body-base font-medium text-foreground">{t(language, "quiz.sidebar.title")}</span>
          <span className="px-2.5 py-1 bg-accentOrange text-foreground text-xs font-bold uppercase tracking-wider">
            {t(language, "quiz.title").split(" ").pop()}
          </span>
        </div>
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-foreground/20 bg-surface2 hover:bg-surface2/90 text-body-base text-foreground transition-colors"
        >
          <img src={reloadIcon} alt="" className="w-4 h-4" />
          <span>{t(language, "quiz.results.retake")}</span>
        </button>
      </div>
      <div className="border-b border-dashed border-foreground/30 mb-8" />
    </>
  )
}