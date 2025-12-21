import React from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t, type TranslationKey } from "../../utils/i18n"

export function Footer() {
  const { language, setLanguage } = useLanguageStore()

  const exploreLinks: Array<{ key: TranslationKey; to?: string }> = [
    { key: "footer.link.home", to: "/" },
    { key: "footer.link.browseCareers", to: "/careers" },
    { key: "footer.link.findCareer", to: "/quiz" },
    { key: "footer.link.resources", to: "/resources" },
    { key: "footer.link.scholarship", to: "/resources" }
  ]

  const helpLinks: Array<{ key: TranslationKey; to?: string }> = [
    { key: "footer.link.compareCareers", to: "/compare" },
    // TODO: add routes when pages exist
    { key: "footer.link.glossary" },
    { key: "footer.link.contact" }
  ]

  return (
    <footer className="border-t border-foreground bg-surface text-foreground">
      <div className="mx-auto max-w-[1368px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="text-4xl font-extrabold leading-none">{t(language, "brand.name")}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest">{t(language, "brand.tagline")}</div>
            </div>

            <div className="space-y-6 text-sm text-foreground/80">
              <p>{t(language, "footer.about")}</p>
              <p className="text-foreground/90">{t(language, "footer.address")}</p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest">{t(language, "footer.heading.explore")}</div>
              <ul className="space-y-2 text-sm">
                {exploreLinks.map((l) => (
                  <li key={l.key as string}>
                    {l.to ? (
                      <Link className="hover:underline" to={l.to}>
                        {t(language, l.key)}
                      </Link>
                    ) : (
                      <span className="text-foreground/70">{t(language, l.key)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest">{t(language, "footer.heading.helpTools")}</div>
              <ul className="space-y-2 text-sm">
                {helpLinks.map((l) => (
                  <li key={l.key as string}>
                    {l.to ? (
                      <Link className="hover:underline" to={l.to}>
                        {t(language, l.key)}
                      </Link>
                    ) : (
                      <span className="text-foreground/70">{t(language, l.key)}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="pt-2 text-sm">
                <button
                  type="button"
                  className={language === "en" ? "font-bold" : "text-foreground/70 hover:text-foreground"}
                  onClick={() => setLanguage("en")}
                >
                  {t(language, "language.english")}
                </button>
                <span className="px-2 text-foreground/60">•</span>
                <button
                  type="button"
                  className={language === "es" ? "font-bold" : "text-foreground/70 hover:text-foreground"}
                  onClick={() => setLanguage("es")}
                >
                  {t(language, "language.spanish")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

