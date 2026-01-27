import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import reloadIcon from "../../icons/shapes/reload.png"

type QuizResultsHeaderProps = {
  language: Language
  onStartOver: () => void
}

export function QuizResultsHeader({ language, onStartOver }: QuizResultsHeaderProps) {
  return (
    <div className="mx-fluid-30 py-fluid-30 border-b-[0.5px] border-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-h5 font-bold text-foreground">{t(language, "quiz.sidebar.title")}</span>
        </div>
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 bg-surface hover:bg-surface1 text-body-base text-foreground transition-colors hover:underline"
        >
          <img src={reloadIcon} alt="" className="w-4 h-4" />
          <span>{t(language, "quiz.results.retake")}</span>
        </button>
      </div>
    </div>
  )
}