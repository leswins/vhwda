import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"

type Props = {
  language: Language
}

export function ChatEmptyState({ language }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted text-sm">{t(language, "chat.selectOrEnterPrompt")}</p>
    </div>
  )
}

