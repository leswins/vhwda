import React from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"

export function HomePage() {
  const { language } = useLanguageStore()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold">{t(language, "home.title")}</h1>
        <p className="text-muted">{t(language, "home.body")}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/careers"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-onPrimary"
        >
          {t(language, "nav.browse")}
        </Link>
        <Link to="/compare" className="rounded-md border border-border px-4 py-2 text-sm">
          {t(language, "nav.compare")}
        </Link>
        <Link to="/quiz" className="rounded-md border border-border px-4 py-2 text-sm">
          {t(language, "nav.quiz")}
        </Link>
        <Link to="/resources" className="rounded-md border border-border px-4 py-2 text-sm">
          {t(language, "nav.resources")}
        </Link>
      </div>
    </div>
  )
}


