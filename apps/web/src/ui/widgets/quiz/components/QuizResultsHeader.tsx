import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import reloadIcon from "../../icons/shapes/reload.png"

type QuizResultsHeaderProps = {
  language: Language
  onStartOver: () => void
  onEmailResults?: () => void
}

export function QuizResultsHeader({ language, onStartOver, onEmailResults }: QuizResultsHeaderProps) {
  return (
    <div className="mx-fluid-30 py-fluid-30 border-b-[0.5px] border-foreground">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-h5 font-bold text-foreground">{t(language, "quiz.sidebar.title")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-body-base text-foreground">
          {onEmailResults ? (
            <button
              onClick={onEmailResults}
              className="flex items-center gap-2 bg-surface text-body-base text-foreground transition-colors hover:bg-surface1 hover:underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6.5H20C20.5523 6.5 21 6.94772 21 7.5V16.5C21 17.0523 20.5523 17.5 20 17.5H4C3.44772 17.5 3 17.0523 3 16.5V7.5C3 6.94772 3.44772 6.5 4 6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 8L11.1056 12.9739C11.6469 13.3528 12.3531 13.3528 12.8944 12.9739L20 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t(language, "quiz.results.email.trigger")}</span>
            </button>
          ) : null}

          {onEmailResults ? (
            <span className="hidden h-5 w-px bg-foreground/30 lg:block" aria-hidden="true" />
          ) : null}

          <button
            onClick={onStartOver}
            className="flex items-center gap-2 bg-surface hover:bg-surface1 text-body-base text-foreground transition-colors hover:underline"
          >
            <img src={reloadIcon} alt="" className="w-4 h-4" />
            <span>{t(language, "quiz.results.retake")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}