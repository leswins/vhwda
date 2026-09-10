import React from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"

export function NotFoundPage() {
  const { language } = useLanguageStore()

  return (
    <>
      <PageHead
        title={t(language, "page.title.notFound")}
        description={t(language, "notFound.description")}
        path="/404"
      />

      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl space-y-3">
          <span className="text-sub2 font-bold uppercase tracking-[0.15em] text-onSurfaceSecondary">
            {t(language, "notFound.kicker")}
          </span>
          <h1 className="text-h2 font-bold tracking-tight text-foreground">{t(language, "notFound.title")}</h1>
          <p className="text-body-lg text-muted">{t(language, "notFound.description")}</p>
        </div>
      </div>

      <div className="min-h-[70vh] px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="text-body-base text-muted">{t(language, "notFound.body")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center border border-foreground bg-foreground px-5 py-3 text-base font-semibold text-surface hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              {t(language, "notFound.home")}
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center border-[0.5px] border-foreground px-5 py-3 text-base font-semibold text-foreground hover:bg-surface1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              {t(language, "notFound.resources")}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
