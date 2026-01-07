import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"

type Props = {
  language: Language
  promptKey: string
  prompt: string
  onClick: (prompt: string) => void
  disabled?: boolean
}

export function QuickPromptCard({ language, promptKey, prompt, onClick, disabled }: Props) {
  return (
    <button
      onClick={() => onClick(prompt)}
      disabled={disabled}
      className="rounded-md border border-border bg-surface p-4 text-left hover:bg-surface-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="font-medium text-foreground mb-1">
        {t(language, `chat.prompts.${promptKey}.title`)}
      </div>
      <div className="text-sm text-muted">
        {t(language, `chat.prompts.${promptKey}.subtitle`)}
      </div>
    </button>
  )
}

