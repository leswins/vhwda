import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"

interface ComparePageHeaderProps {
  careerCount: number
  language: Language
}

export function ComparePageHeader({ careerCount, language }: ComparePageHeaderProps) {
  const getTitle = () => {
    if (careerCount === 0) {
      return t(language, "compare.title")
    } else if (careerCount === 1) {
      return t(language, "compare.title.comparing").replace("{count}", "1")
    }
    return t(language, "compare.title.comparingPlural").replace("{count}", careerCount.toString())
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">{getTitle()}</h1>
    </div>
  )
}

