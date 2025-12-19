import React, { useEffect } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"

export function AppShell() {
  const { language, setLanguage } = useLanguageStore()

  useEffect(() => {
    document.title = t(language, "app.title")
  }, [language])

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(language, "a11y.skipToContent")}
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-semibold text-foreground">
            {t(language, "app.title")}
          </Link>

          <nav className="flex items-center gap-4">
            <NavLink to="/careers" className="text-sm text-foreground/80 hover:text-foreground">
              {t(language, "nav.browse")}
            </NavLink>
            <NavLink to="/quiz" className="text-sm text-foreground/80 hover:text-foreground">
              {t(language, "nav.quiz")}
            </NavLink>
            <NavLink to="/compare" className="text-sm text-foreground/80 hover:text-foreground">
              {t(language, "nav.compare")}
            </NavLink>
            <NavLink to="/resources" className="text-sm text-foreground/80 hover:text-foreground">
              {t(language, "nav.resources")}
            </NavLink>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted" htmlFor="lang">
                {t(language, "nav.language")}
              </label>
              <select
                id="lang"
                className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "es")}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}


