import React from "react"
import { useParams } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"

export function CareerDetailPage() {
  const { slug } = useParams()
  const { language } = useLanguageStore()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{t(language, "career.title")}</h1>
      <p className="text-muted">{t(language, "career.body")}</p>
      <p className="text-sm text-muted">
        {t(language, "career.slugLabel")}: {slug ?? t(language, "common.missing")}
      </p>
    </div>
  )
}


