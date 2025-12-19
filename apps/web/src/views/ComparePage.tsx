import React from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"

export function ComparePage() {
  const { language } = useLanguageStore()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{t(language, "compare.title")}</h1>
      <p className="text-muted">{t(language, "compare.body")}</p>
    </div>
  )
}


