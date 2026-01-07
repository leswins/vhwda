import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import { QuickPromptCard } from "./QuickPromptCard"

type Props = {
  language: Language
  onPromptClick: (prompt: string) => void
  disabled?: boolean
}

export function QuickPrompts({ language, onPromptClick, disabled }: Props) {
  const quickPrompts = [
    { key: "findCareers", prompt: t(language, "chat.prompts.findCareers") },
    { key: "compareSalaries", prompt: t(language, "chat.prompts.compareSalaries") },
    { key: "educationPaths", prompt: t(language, "chat.prompts.educationPaths") },
    { key: "jobOutlook", prompt: t(language, "chat.prompts.jobOutlook") },
    { key: "careerTransitions", prompt: t(language, "chat.prompts.careerTransitions") },
    { key: "quickStart", prompt: t(language, "chat.prompts.quickStart") },
  ]

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {quickPrompts.map((item) => (
          <QuickPromptCard
            key={item.key}
            language={language}
            promptKey={item.key}
            prompt={item.prompt}
            onClick={onPromptClick}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}

