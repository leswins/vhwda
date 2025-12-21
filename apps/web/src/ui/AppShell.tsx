import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { Footer } from "./widgets/Footer"
import { NavHeader } from "./widgets/NavHeader"

export function AppShell() {
  const { language } = useLanguageStore()

  useEffect(() => {
    document.title = t(language, "app.title")
  }, [language])

  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(language, "a11y.skipToContent")}
      </a>
      <NavHeader />

      <main id="main" className="mx-auto w-full max-w-[1368px] flex-1 px-6 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}


