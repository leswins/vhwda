import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"

type Props = {
  language: Language
}

export function ChatEmptyState({ language }: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <p
        className="font-bold uppercase text-foreground opacity-50"
        style={{
          fontSize: "var(--text-sub2)",
          lineHeight: "var(--leading-sub2)",
          letterSpacing: "var(--tracking-sub2)"
        }}
      >
        {t(language, "chat.selectOrEnterPrompt")}
      </p>
    </div>
  )
}
