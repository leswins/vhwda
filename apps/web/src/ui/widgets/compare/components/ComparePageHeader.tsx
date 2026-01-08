import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"

interface ComparePageHeaderProps {
  careerCount: number
  language: Language
}

export function ComparePageHeader({ careerCount, language }: ComparePageHeaderProps) {
  const title =
    careerCount === 0
      ? t(language, "compare.title")
      : careerCount === 1
        ? t(language, "compare.title.comparing").replace("{count}", "1")
        : t(language, "compare.title.comparingPlural").replace("{count}", careerCount.toString())

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  )
}

