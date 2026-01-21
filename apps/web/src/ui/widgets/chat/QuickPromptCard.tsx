import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"

type Props = {
  language: Language
  promptKey: string
  prompt: string
  icon: string
  iconColor: string
  onClick: (prompt: string) => void
  disabled?: boolean
}

export function QuickPromptCard({ language, promptKey, prompt, icon, iconColor, onClick, disabled }: Props) {
  return (
    <button
      onClick={() => onClick(prompt)}
      disabled={disabled}
      className="flex shrink-0 cursor-pointer items-center gap-[15px] p-0 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div 
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center"
        style={{ backgroundColor: `rgb(${iconColor})` }}
      >
        <img src={icon} alt="" className="h-[20px] w-[20px]" />
      </div>
      <div className="flex flex-col items-start justify-center gap-[5px] text-left">
        <p 
          className="font-bold text-foreground"
          style={{
            fontSize: "var(--text-h5)",
            lineHeight: "var(--leading-h5)",
            letterSpacing: "var(--tracking-h5)"
          }}
        >
          {t(language, `chat.prompts.${promptKey}.title`)}
        </p>
        <p 
          className="text-muted"
          style={{
            fontSize: "var(--text-body-base)",
            lineHeight: "var(--leading-body-base)",
            letterSpacing: "var(--tracking-body-base)",
            fontWeight: "500"
          }}
        >
          {t(language, `chat.prompts.${promptKey}.subtitle`)}
        </p>
      </div>
    </button>
  )
}
